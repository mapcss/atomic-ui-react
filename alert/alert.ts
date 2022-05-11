// This module is browser compatible.

import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import ariaAlert from "./aria_alert.ts";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

type _Props<As extends Tag> = {
  /**
   * @default `div`
   */
  as?: As;
};

export type Props<As extends Tag> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

function _Alert<As extends Tag = "div">(
  { as, ...rest }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  const tag = useAs(as, "div");

  return createElement(tag, { ref, ...ariaAlert, ...rest });
}

const Alert = _forwardRef(_Alert);
export default Alert;
