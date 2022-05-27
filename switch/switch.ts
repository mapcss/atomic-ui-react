// This module is browser compatible.

import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import WithSwitch, { Props as WithSwitchProps } from "./with_switch.ts";

type _Props<As extends Tag> = {
  /** The element the Switch should render as.
   * @default `button`
   */
  as?: As;
} & Omit<WithSwitchProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _Switch<As extends Tag = "button">(
  { as, children, ...rest }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithSwitch({
    children: (attrs) => {
      const tag = useAs(as, "button");
      return createElement(tag, { ref, ...attrs, children });
    },
    ...rest,
  });
}

const Switch = _forwardRef(_Switch);

export default Switch;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
