// This module is browser compatible.

import { createElement, RefObject } from "react";
import { TAB_LIST, TYPE } from "./constant.ts";
import useTabListAria, { Param } from "./use_tab_list_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `div`
   */
  as?: As;

  tabRef?: RefObject<HTMLElement>;
} & Partial<Param>;

export type Props<
  As extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function TabList<As extends keyof JSX.IntrinsicElements>(
  { as, isHorizontal, tabRef, ...rest }: Props<As>,
): JSX.Element {
  const _as = as ?? "div";
  const aria = useTabListAria({ isHorizontal });

  return createElement(_as, { ref: tabRef, ...aria, ...rest });
}

TabList[TYPE] = TAB_LIST;