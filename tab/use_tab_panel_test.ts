import useTabPanel from "./use_tab_panel.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";

Deno.test("useTabPanel should be return attributes and contexts", () => {
  const { result, rerender } = renderHook(
    ({ id, index, selectedIndex, disabledIds }) =>
      useTabPanel({ id, index, selectedIndex, disabledIds }),
    {
      initialProps: {
        id: "test",
        index: 0,
        selectedIndex: 1,
        disabledIds: [] as number[],
      },
    },
  );

  expect(result.current[0]).toEqual({
    role: "tabpanel",
    id: "test-tab-panel-0",
    "aria-labelledby": "test-tab-0",
    hidden: true,
  });

  expect(result.current[1]).toEqual({
    isSelected: false,
    isShowable: false,
    isDisabled: false,
    selectedIndex: 1,
    index: 0,
  });

  rerender({
    id: "test",
    index: 0,
    selectedIndex: 0,
    disabledIds: [],
  });

  expect(result.current[0]).toEqual({
    role: "tabpanel",
    id: "test-tab-panel-0",
    "aria-labelledby": "test-tab-0",
    hidden: false,
  });

  expect(result.current[1]).toEqual({
    isSelected: true,
    isShowable: true,
    isDisabled: false,
    selectedIndex: 0,
    index: 0,
  });

  rerender({
    id: "test",
    index: 0,
    selectedIndex: 1,
    disabledIds: [0],
  });

  expect(result.current[0]).toEqual({
    role: "tabpanel",
    id: "test-tab-panel-0",
    "aria-labelledby": "test-tab-0",
    hidden: true,
  });

  expect(result.current[1]).toEqual({
    isSelected: false,
    isShowable: false,
    isDisabled: true,
    selectedIndex: 1,
    index: 0,
  });
});
