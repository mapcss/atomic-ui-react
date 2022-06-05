import useMergedRef from "./use_merged_ref.ts";
import { renderHook } from "@testing-library/react-hooks";
import { anyFunction, anyObject, expect } from "../dev_deps.ts";

Deno.test("useMergedRef should return getter ref and setter ref", () => {
  const { result } = renderHook(() => useMergedRef({ current: 1 }));

  expect(result.current).toEqual([anyObject(), anyObject()]);
});

Deno.test("useMergedRef should return function as setter ref", () => {
  const { result } = renderHook(() => useMergedRef(() => {}));

  expect(result.current).toEqual([anyObject(), anyFunction()]);
});

Deno.test("useMergedRef should return new ref object set", () => {
  const { result } = renderHook(() => useMergedRef(null));

  expect(result.current).toEqual([anyObject(), anyObject()]);
  expect(result.current[0]).toBe(result.current[1]);
});
