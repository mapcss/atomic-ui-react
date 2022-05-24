// deno-lint-ignore-file no-explicit-any
import useTab from "./use_tab.ts";
import { renderHook } from "@testing-library/react-hooks";
import {
  anyFunction,
  describe,
  expect,
  fn,
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
    ({ params, contexts }) => useTab(params, contexts),
    {
      initialProps: {
        params: {
          index: 0,
          targets: () => [],
        },
        contexts: {},
      },
    },
  );

  expect(result.current[0]).toEqual({
    role: "tab",
    id: undefined,
    "aria-selected": undefined,
    "aria-disabled": "false",
    "aria-controls": undefined,
    onClick: anyFunction(),
    onKeyDown: anyFunction(),
  });

  expect(result.current[1]).toEqual({
    isHorizontal: true,
    focusPrev: anyFunction(),
    focusNext: anyFunction(),
    focusFirst: anyFunction(),
    focusLast: anyFunction(),
  });
});

it(
  describeTests,
  "should be return id and aria-controls attributes",
  () => {
    const { result } = renderHook(
      ({ params, contexts }) => useTab(params, contexts),
      {
        initialProps: {
          params: {
            index: 0,
            targets: () => [],
          },
          contexts: {
            tabId: "tab-0",
            tabPanelId: "tab-panel-0",
            isSelected: true,
          },
        },
      },
    );

    expect(result.current[0]).toEqual({
      role: "tab",
      id: "tab-0",
      "aria-selected": "true",
      "aria-disabled": "false",
      "aria-controls": "tab-panel-0",
      onClick: anyFunction(),
      onKeyDown: anyFunction(),
    });
  },
);

it(describeTests, "should focus on keyDown", () => {
  const el = document.createElement("div");
  const el2 = document.createElement("button");
  const { result } = renderHook(
    ({ params, contexts }) => useTab(params, contexts),
    {
      initialProps: {
        params: {
          index: 0,
          targets: () => [el, el2],
        },
        contexts: {
          tabId: "tab-0",
          tabPanelId: "tab-panel-0",
          isSelected: true,
        },
      },
    },
  );

  document.body.appendChild(el);
  document.body.appendChild(el2);

  result.current[0]?.onKeyDown?.({ code: "ArrowLeft" } as any);

  expect(el2).toHaveFocus();
});

it(describeTests, "should update state on click", () => {
  const el = document.createElement("div");
  const el2 = document.createElement("button");
  const mockFn = fn();
  const { result } = renderHook(
    ({ params, contexts }) => useTab(params, contexts),
    {
      initialProps: {
        params: {
          index: 0,
          targets: () => [el, el2],
        },
        contexts: {
          tabId: "tab-0",
          tabPanelId: "tab-panel-0",
          isSelected: true,
          onChange: mockFn,
        },
      },
    },
  );

  document.body.appendChild(el);
  document.body.appendChild(el2);

  expect(mockFn).not.toHaveBeenCalled();

  result.current[0].onClick?.({} as any);
  expect(mockFn).toHaveBeenCalledWith({ featureIndex: 0, target: el });
});
