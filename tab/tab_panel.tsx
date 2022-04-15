// This module is browser compatible.

import { createElement } from "react";
import { useTabPanelAttribute } from "./use_attribute.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `div`
   */
  as?: As;
};

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function TabPanel<As extends keyof JSX.IntrinsicElements>(
  { as, ...rest }: Props<As>,
): JSX.Element {
  const _as = as ?? "div";
  const attribute = useTabPanelAttribute();

  return createElement(_as, { ...attribute, ...rest });
}
