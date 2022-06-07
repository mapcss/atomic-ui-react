// This module is browser compatible.

import { createElement, ReactNode, useContext } from "react";
import useTabList, { Options, Returns } from "./use_tab_list.ts";
import { CommonContextsContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";
import { FocusStrategyContext, RovingTabIndex } from "../focus/mod.ts";

export type Props = {
  children: (attributes: Returns[0], contexts: Returns[1]) => ReactNode;
} & Partial<Options>;

export default function WithTabList(
  { children, isHorizontal, focusStrategy = RovingTabIndex, activeThenSelect }:
    Props,
): JSX.Element | never {
  const commonContexts = useContext(CommonContextsContext);

  if (!commonContexts) throw Error(ERROR_MSG);

  const [attributes, contexts] = useTabList(commonContexts, {
    isHorizontal,
    focusStrategy,
    activeThenSelect,
  });

  return createElement(
    FocusStrategyContext.Provider,
    { value: focusStrategy },
    children(attributes, contexts),
  );
}
