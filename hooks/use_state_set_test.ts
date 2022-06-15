import useStateSet from "./use_state_set.ts";
import { act, renderHook } from "@testing-library/react-hooks";
import { anyFunction, expect, fn } from "../dev_deps.ts";

Deno.test("useStateSet should return useState return value as is", () => {
  const { result } = renderHook(() => useStateSet(false));

  expect(result.current[0]).toBeFalsy();
  expect(result.current[1]).toEqual(anyFunction());

  act(() => {
    result.current[1](true);
  });
  expect(result.current[0]).toBeTruthy();
});

Deno.test("useStateSet should return custom state set", () => {
  const mockFn = fn();
  const { result } = renderHook(() => useStateSet(undefined, [true, mockFn]));

  expect(result.current[0]).toBeTruthy();
  expect(result.current[1]).toEqual(anyFunction());

  act(() => {
    result.current[1](false);
  });
  expect(mockFn).toHaveBeenCalled();
});
