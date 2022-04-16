// This module is browser compatible.

import { createElement } from "react";
import { TAB, TYPE } from "./constant.ts";
import { useTabAttribute } from "./use_attribute.ts";

type _Props<Tag extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  tag?: Tag;

  /**
   * @default false
   */
  isSelect?: boolean;

  propsAs?: (
    { isSelect }: { isSelect: boolean },
  ) => JSX.IntrinsicElements["button"];
};

export type Props<Tag extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<Tag>
  & Omit<JSX.IntrinsicElements[Tag], keyof _Props<Tag>>;

export default function Tab(
  { tag = "button", isSelect = false, ...rest }: Props,
): JSX.Element {
  const attribute = useTabAttribute({ selected: isSelect });

  return createElement(tag, { ...attribute, ...rest });
}

Tab[TYPE] = TAB;
