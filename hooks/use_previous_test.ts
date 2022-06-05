import usePrevious from "./use_previous.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";

Deno.test("usePrevious should return previous rendering value", () => {
  const { rerender, result } = renderHook(({ value }) => usePrevious(value), {
    initialProps: {
      value: false as unknown,
    },
  });

  expect(result.current).toBeUndefined();

  rerender({ value: undefined });
  expect(result.current).toBeFalsy();

  rerender({ value: true });
  expect(result.current).toBeUndefined();

  rerender({ value: undefined });
  expect(result.current).toBeTruthy();
});

Deno.test("usePrevious should change initial previous value", () => {
  const { rerender, result } = renderHook(() => usePrevious(false, 100));

  expect(result.current).toBe(100);

  rerender();
  expect(result.current).toBeFalsy();
});
