import { createElement, ReactNode, useContext } from "react";
import { CommonContextsContext, HorizontalContext } from "./context.ts";
import { Tag } from "../types.ts";
import { FocusStrategyContext } from "../focus/mod.ts";
import { ERROR_MSG } from "./constant.ts";
import useTabList, { AttributesWithContexts } from "./use_tab_list.ts";

export type Props<T extends Tag> = {
  /**
   * @default `div`
   */
  tag?: T;

  children?: ReactNode;
} & AttributesWithContexts;

export default function TabList<T extends Tag>(
  { tag = "div" as T, children, ...allAttributes }: Props<T>,
): JSX.Element | never {
  const commonContexts = useContext(CommonContextsContext);
  const isHorizontal = useContext(HorizontalContext);
  const focusStrategy = useContext(FocusStrategyContext);

  if (!commonContexts) {
    throw Error(ERROR_MSG);
  }

  const [attributes] = useTabList(commonContexts, {
    isHorizontal,
    focusStrategy,
  }, allAttributes);

  return createElement(tag, attributes, children);
}
