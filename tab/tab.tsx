// This module is browser compatible.

import { createElement } from "react";
import { TAB, TYPE } from "./constant.ts";
import { useTabAttribute } from "./use_attribute.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  as?: As;

  isSelected?: boolean;

  tabPanelId?: string;
};

export type Props<Tag extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<Tag>
  & Omit<JSX.IntrinsicElements[Tag], keyof _Props<Tag>>;

export default function Tab(
  { as = "button", isSelected, tabPanelId, ...rest }: Props,
): JSX.Element {
  const attribute = useTabAttribute({ isSelected, tabPanelId });

  return createElement(as, { ...attribute, ...rest });
}

Tab[TYPE] = TAB;
