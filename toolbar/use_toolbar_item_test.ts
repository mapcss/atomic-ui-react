import useToolbarItem from "./use_toolbar_item.ts";
import { renderHook } from "@testing-library/react-hooks";
import { anyFunction, anyNumber, anyObject, expect } from "../dev_deps.ts";

Deno.test("useToolbarItem should return as default", () => {
  const { result } = renderHook(() => {
    return useToolbarItem({
      activeIndex: 0,
      setActiveIndex: () => {},
      id: "0",
      index: 0,
      itemsRef: { current: [] },
    });
  });

  expect(result.current[0]).toEqual({
    tabIndex: anyNumber(),
    onClick: anyFunction(),
  });
  expect(result.current[1]).toEqual({
    isActive: true,
    activeIndex: anyNumber(),
    setActiveIndex: anyFunction(),
    itemsRef: anyObject(),
    index: 0,
    id: "0",
  });
});

Deno.test("useToolbarItem should define attributes with contexts", () => {
  const { result } = renderHook(() => {
    return useToolbarItem(
      {
        activeIndex: 0,
        setActiveIndex: () => {},
        id: "0",
        index: 0,
        itemsRef: { current: [] },
      },
      undefined,
      {
        tabIndex: 2,
        className: ({ isActive }) => isActive ? "active" : "non-active",
      },
    );
  });

  expect(result.current[0]).toEqual({
    tabIndex: 2,
    onClick: anyFunction(),
    className: "active",
  });
});
