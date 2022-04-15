// This module is browser compatible.

import { createElement } from "react";
import { useTabAttribute } from "./use_attribute.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `button`
   */
  as?: As;

  isActive: boolean;
};
export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function PureTab<As extends keyof JSX.IntrinsicElements>(
  { as, isActive, ...rest }: Props<As>,
): JSX.Element {
  const _as = as ?? "button";
  const attribute = useTabAttribute({ selected: isActive });

  return createElement(_as, { ...attribute, ...rest });
}
