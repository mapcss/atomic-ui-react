import useTab from "./use_tab.ts";
import { renderHook } from "@testing-library/react-hooks";
import {
  anyFunction,
  anyObject,
  describe,
  expect,
  it,
  setupJSDOM,
} from "../dev_deps.ts";

const describeTests = describe({
  name: "useTab",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should be return attributes and contexts", () => {
  const { result } = renderHook(
    () =>
      useTab({
        index: 0,
        id: "tab-0",
        activeIndex: 0,
        setActiveIndex: () => {},
        selectIndex: 0,
        setSelectIndex: () => {},
        tabPanelsRef: { current: [] },
        tabsRef: { current: [] },
        tabPanelId: "tab-panel-0",
      }),
  );

  expect(result.current[0]).toEqual({
    role: "tab",
    id: "tab-0",
    "aria-selected": true,
    "aria-controls": "tab-panel-0",
    onClick: anyFunction(),
    tabIndex: 0,
  });

  expect(result.current[1]).toEqual({
    isHorizontal: true,
    isSelect: true,
    selectIndex: 0,
    index: 0,
    setSelectIndex: anyFunction(),
    id: "tab-0",
    tabPanelId: "tab-panel-0",
    tabPanelsRef: anyObject(),
    tabsRef: anyObject(),
    activeIndex: 0,
    setActiveIndex: anyFunction(),
    isActive: true,
  });
});

// it(
//   describeTests,
//   "should be return id and aria-controls attributes",
//   () => {
//     const { result } = renderHook(
//       ({ params, contexts }) => useTab(params, contexts),
//       {
//         initialProps: {
//           params: {
//             index: 0,
//             targets: () => [],
//           },
//           contexts: {
//             tabId: "tab-0",
//             tabPanelId: "tab-panel-0",
//             isSelected: true,
//           },
//         },
//       },
//     );

//     expect(result.current[0]).toEqual({
//       role: "tab",
//       id: "tab-0",
//       "aria-selected": "true",
//       "aria-disabled": "false",
//       "aria-controls": "tab-panel-0",
//       onClick: anyFunction(),
//       onKeyDown: anyFunction(),
//     });
//   },
// );

// it(describeTests, "should focus on keyDown", () => {
//   const el = document.createElement("div");
//   const el2 = document.createElement("button");
//   const { result } = renderHook(
//     ({ params, contexts }) => useTab(params, contexts),
//     {
//       initialProps: {
//         params: {
//           index: 0,
//           targets: () => [el, el2],
//         },
//         contexts: {
//           tabId: "tab-0",
//           tabPanelId: "tab-panel-0",
//           isSelected: true,
//         },
//       },
//     },
//   );

//   document.body.appendChild(el);
//   document.body.appendChild(el2);

//   result.current[0]?.onKeyDown?.({ code: "ArrowLeft" } as any);

//   expect(el2).toHaveFocus();
// });

// it(describeTests, "should update state on click", () => {
//   const el = document.createElement("div");
//   const el2 = document.createElement("button");
//   const mockFn = fn();
//   const { result } = renderHook(
//     ({ params, contexts }) => useTab(params, contexts),
//     {
//       initialProps: {
//         params: {
//           index: 0,
//           targets: () => [el, el2],
//         },
//         contexts: {
//           tabId: "tab-0",
//           tabPanelId: "tab-panel-0",
//           isSelected: true,
//           onChange: mockFn,
//         },
//       },
//     },
//   );

//   document.body.appendChild(el);
//   document.body.appendChild(el2);

//   expect(mockFn).not.toHaveBeenCalled();

//   result.current[0].onClick?.({} as any);
//   expect(mockFn).toHaveBeenCalledWith({ featureIndex: 0, target: el });
// });
