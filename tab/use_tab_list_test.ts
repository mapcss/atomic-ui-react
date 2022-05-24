import useTabList from "./use_tab_list.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";

Deno.test("useTabList should be return attributes", () => {
  const { result, rerender } = renderHook(
    ({ isHorizontal }) => useTabList({ isHorizontal }),
    {
      initialProps: {
        isHorizontal: undefined as undefined | boolean,
      },
    },
  );

  expect(result.current).toEqual({
    role: "tablist",
    "aria-orientation": undefined,
  });

  rerender({ isHorizontal: true });
  expect(result.current).toEqual({
    role: "tablist",
    "aria-orientation": "horizontal",
  });

  rerender({ isHorizontal: false });
  expect(result.current).toEqual({
    role: "tablist",
    "aria-orientation": "vertical",
  });
});
