import useTabPanel from "./use_tab_panel.ts";
import { renderHook } from "@testing-library/react-hooks";
import { anyBoolean, anyFunction, anyObject, expect } from "../dev_deps.ts";

Deno.test("useTabPanel should be return attributes and contexts", () => {
  const { result } = renderHook(
    () =>
      useTabPanel({
        id: "tab-panel-0",
        index: 0,
        selectIndex: 0,
        setSelectIndex: () => {},
        activeIndex: 0,
        setActiveIndex: () => {},
        tabsRef: { current: [] },
        tabPanelsRef: { current: [] },
        tabId: "tab-0",
      }),
  );

  expect(result.current[0]).toEqual({
    role: "tabpanel",
    id: "tab-panel-0",
    "aria-labelledby": "tab-0",
    hidden: false,
  });

  expect(result.current[1]).toEqual({
    id: "tab-panel-0",
    index: 0,
    selectIndex: 0,
    setSelectIndex: anyFunction(),
    activeIndex: 0,
    setActiveIndex: anyFunction(),
    tabsRef: anyObject(),
    tabPanelsRef: anyObject(),
    tabId: "tab-0",
    isSelect: anyBoolean(),
  });
});
