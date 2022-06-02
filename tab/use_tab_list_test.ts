import useTabList from "./use_tab_list.ts";
import { renderHook } from "@testing-library/react-hooks";
import { anyFunction, anyObject, expect } from "../dev_deps.ts";

Deno.test("useTabList should be return attributes", () => {
  const { result } = renderHook(
    () =>
      useTabList({
        selectIndex: 0,
        setSelectIndex: () => {},
        activeIndex: 0,
        setActiveIndex: () => {},
        tabPanelsRef: { current: [] },
        tabsRef: { current: [] },
      }),
  );

  expect(result.current[0]).toEqual({
    role: "tablist",
    "aria-orientation": "horizontal",
    onKeyDown: anyFunction(),
  });

  expect(result.current[1]).toEqual({
    isHorizontal: true,
    selectIndex: 0,
    setSelectIndex: anyFunction(),
    activeIndex: 0,
    setActiveIndex: anyFunction(),
    focusStrategy: anyObject(),
    tabPanelsRef: anyObject(),
    tabsRef: anyObject(),
    activeThenSelect: true,
  });
});
