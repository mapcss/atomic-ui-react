// This module is browser compatible.

import { createElement } from "react";
import { TAB, TYPE } from "./constant.ts";
import { useTabAttribute } from "./use_attribute.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  as?: As;

  /**
   * @default false
   */
  isSelected?: boolean;
};

export type Props<Tag extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<Tag>
  & Omit<JSX.IntrinsicElements[Tag], keyof _Props<Tag>>;

export default function Tab(
  { as = "button", isSelected = false, ...rest }: Props,
): JSX.Element {
  const attribute = useTabAttribute({ isSelected });

  return createElement(as, { ...attribute, ...rest });
}

Tab[TYPE] = TAB;
