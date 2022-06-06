import useCallback from "./use_callable.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect, fn } from "../dev_deps.ts";

Deno.test("useCallback should not call when callable is false", () => {
  const mockFn = fn();
  const { result, rerender } = renderHook(
    ({ callable }) => useCallback(mockFn, callable),
    {
      initialProps: {
        callable: false,
      },
    },
  );

  result.current();
  expect(mockFn).not.toHaveBeenCalled();

  rerender({ callable: true });
  result.current(1, 2, 3);
  expect(mockFn).toHaveBeenCalledWith(1, 2, 3);

  rerender({ callable: false });
  result.current(1, 2, 3);
  expect(mockFn).toHaveBeenCalledTimes(1);
});
