// This module is browser compatible.

import { createElement, useEffect, useRef } from "react";
import { TAB, TYPE } from "./constant.ts";
import { useTabAttribute } from "./use_attribute.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  as?: As;

  isSelected?: boolean;

  tabPanelId?: string;

  focus?: boolean;
};

export type Props<Tag extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<Tag>
  & Omit<JSX.IntrinsicElements[Tag], keyof _Props<Tag>>;

export default function Tab(
  { as = "button", isSelected, tabPanelId, focus, ...rest }: Props,
): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current || !isSelected || !focus) return;
    ref.current.focus();
  }, [isSelected, focus]);

  const attribute = useTabAttribute({ isSelected, tabPanelId });

  return createElement(as, { ref, ...attribute, ...rest });
}

Tab[TYPE] = TAB;
