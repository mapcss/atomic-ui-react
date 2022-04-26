// This module is browser compatible.

import { createElement, ForwardedRef, forwardRef as _forwardRef } from "react";
import { TAB_LIST, TYPE } from "./constant.ts";
import useTabListAria, { Param } from "./use_tab_list_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `div`
   */
  as?: As;
} & Partial<Param>;

export type Props<
  As extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

function _TabList<As extends keyof JSX.IntrinsicElements>(
  { as, isHorizontal, ...rest }: Props<As>,
  ref: ForwardedRef<As>,
): JSX.Element {
  const _as = as ?? "div";
  const aria = useTabListAria({ isHorizontal });

  return createElement(_as, { ref, ...aria, ...rest });
}

const TabList = _forwardRef(_TabList);

// deno-lint-ignore no-explicit-any
(TabList as any)[TYPE] = TAB_LIST;
export default TabList;
