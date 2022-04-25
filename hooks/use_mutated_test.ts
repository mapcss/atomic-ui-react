import useMutated from "./use_mutated.ts";
import { describe, expect, it } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

describe("useMutated", () => {
  it("should always return false", () => {
    const { result, rerender } = renderHook(() => useMutated([]));
    expect(result.current).toBeFalsy();
    rerender();
    expect(result.current).toBeFalsy();
  });
  it("should return false first, since true", () => {
    const { result, rerender } = renderHook(({ deps }) => useMutated(deps), {
      initialProps: {
        deps: [false],
      },
    });
    expect(result.current).toBeFalsy();
    rerender({ deps: [false] });
    expect(result.current).toBeFalsy();
    rerender({ deps: [true] });
    expect(result.current).toBeTruthy();
  });
});
