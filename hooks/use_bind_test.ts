import useBind from "./use_bind.ts";
import { renderHook } from "@testing-library/react-hooks";
import { anyFunction, expect } from "../dev_deps.ts";

Deno.test("useBind should return function that binded with args", () => {
  const { result } = renderHook(() =>
    useBind((a: number, b: number) => a + b, 1)
  );

  expect(result.current).toEqual(anyFunction());
  expect(result.current(2)).toBe(3);
  expect(result.current(10)).toBe(11);
});
