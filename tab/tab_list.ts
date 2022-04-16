// This module is browser compatible.

import { createElement } from "react";
import { useTabListAttribute } from "./use_attribute.ts";
import { TAB_LIST, TYPE } from "./constant.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `div`
   */
  as?: As;

  /** When `true`, the orientation of the `TabList` will be `horizontal`, otherwise `vertical`
   * @default true
   */
  isHorizontal?: boolean;
};

export type Props<
  As extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function TabList<As extends keyof JSX.IntrinsicElements>(
  { as, isHorizontal = true, ...rest }: Props<As>,
): JSX.Element {
  const _as = as ?? "div";
  const attribute = useTabListAttribute({ isHorizontal });

  return createElement(_as, { ...attribute, ...rest });
}

TabList[TYPE] = TAB_LIST;
