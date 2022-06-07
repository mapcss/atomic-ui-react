import useUpdateEffect from "./use_update_effect.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect, fn } from "../dev_deps.ts";

Deno.test("useUpdateEffect should not call on first mount", () => {
  const mockFn = fn();
  const { rerender } = renderHook(() =>
    useUpdateEffect(() => {
      mockFn();
    })
  );

  expect(mockFn).not.toHaveBeenCalled();
  rerender();
  expect(mockFn).toHaveBeenCalled();
  rerender();
  expect(mockFn).toHaveBeenCalledTimes(2);
});

Deno.test("useUpdateEffect should call only deps is updated", () => {
  const mockFn = fn();
  const { rerender } = renderHook(({ value }) =>
    useUpdateEffect(() => {
      mockFn();
    }, [value]), {
    initialProps: {
      value: {} as unknown,
    },
  });

  expect(mockFn).not.toHaveBeenCalled();
  rerender();
  expect(mockFn).not.toHaveBeenCalled();
  rerender({ value: {} });
  expect(mockFn).toHaveBeenCalled();
});

Deno.test("useUpdateEffect should not call when empty dependency list is passed", () => {
  const mockFn = fn();
  const { rerender } = renderHook(() =>
    useUpdateEffect(() => {
      mockFn();
    }, [])
  );

  expect(mockFn).not.toHaveBeenCalled();
  rerender();
  expect(mockFn).not.toHaveBeenCalled();
  rerender();
  expect(mockFn).not.toHaveBeenCalled();
});
