import { renderHook } from "@testing-library/react-hooks";
import useToolbar from "./use_toolbar.ts";
import { expect } from "../dev_deps.ts";

Deno.test("useToolbar", () => {
  const { result } = renderHook(() => useToolbar());

  expect(result.current).toEqual({
    role: "toolbar",
  });
});
