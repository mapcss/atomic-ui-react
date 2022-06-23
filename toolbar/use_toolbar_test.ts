import { renderHook } from "@testing-library/react-hooks";
import useToolbar from "./use_toolbar.ts";
import { anyFunction, anyNumber, anyObject, expect } from "../dev_deps.ts";

Deno.test("useToolbar should return as default", () => {
  const { result } = renderHook(() =>
    useToolbar({
      activeIndex: 0,
      setActiveIndex: () => {},
      itemsRef: { current: [] },
    })
  );

  expect(result.current[0]).toEqual({
    role: "toolbar",
    onKeyDown: anyFunction(),
  });
  expect(result.current[1]).toEqual({
    itemsRef: anyObject(),
    activeIndex: anyNumber(),
    setActiveIndex: anyFunction(),
  });
});

Deno.test("useToolbar should define attributes with contexts", () => {
  const { result } = renderHook(() =>
    useToolbar(
      {
        activeIndex: 0,
        setActiveIndex: () => {},
        itemsRef: { current: [] },
      },
      undefined,
      {
        tabIndex: (contexts) => contexts.activeIndex!,
        title: "test",
      },
    )
  );

  expect(result.current[0]).toEqual({
    role: "toolbar",
    onKeyDown: anyFunction(),
    tabIndex: 0,
    title: "test",
  });
});
