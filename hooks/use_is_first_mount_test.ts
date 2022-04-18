import useIsFirstMount from "./use_is_first_mount.ts";
import { expect } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

Deno.test("should be true on first mount, false on second mount", () => {
  const { result, rerender } = renderHook(() => useIsFirstMount());

  expect(result.current.isFirstMount).toBe(true);

  rerender();
  expect(result.current.isFirstMount).toBe(false);
  rerender();
  expect(result.current.isFirstMount).toBe(false);
});
