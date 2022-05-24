import { createRef } from "react";
import useToolbarItem from "./use_toolbar_item.ts";
import { renderHook } from "@testing-library/react-hooks";
import useActiveElement from "../hooks/use_active_element.ts";
import {
  anyBoolean,
  anyFunction,
  anyNumber,
  anyObject,
  expect,
} from "../dev_deps.ts";

Deno.test("useToolbarItem", () => {
  const ref = createRef<HTMLElement>();
  const { result } = renderHook(() => {
    const stateSet = useActiveElement();
    return useToolbarItem({
      refs: [],
      ref,
      activeElementStateSet: stateSet,
    });
  });

  expect(result.current[0]).toEqual({
    tabIndex: anyNumber(),
    onKeyDown: anyFunction(),
    onFocus: anyFunction(),
    ref: anyObject(),
  });
  expect(result.current[1]).toEqual({
    isFirst: anyBoolean(),
    isActive: anyBoolean(),
    focusPrev: anyFunction(),
    focusNext: anyFunction(),
    focusFirst: anyFunction(),
    focusLast: anyFunction(),
  });
});
