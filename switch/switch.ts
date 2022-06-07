// This module is browser compatible.

import { createElement, forwardRef, ReactNode, Ref } from "react";
import { Tag } from "../types.ts";
import { Exclusive } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import { IsCheckedProps } from "./types.ts";
import WithSwitch, { Props as WithSwitchProps } from "./with_switch.ts";
import useAlterState from "../_shared/use_alter_state.ts";

type _Props<As extends Tag> =
  & {
    /** The element the Switch should render as.
     * @default `button`
     */
    as?: As;

    /** Children. */
    children?: ReactNode;
  }
  & Omit<WithSwitchProps, "children" | keyof IsCheckedProps>
  & Exclusive<IsCheckedProps, {
    /** Initial `isChecked` state.
     * @default false
     */
    initialIsChecked?: boolean;
  }>;

export type Props<As extends Tag> = _Props<As>;

function _Switch<As extends Tag = "button">(
  {
    as,
    children,
    initialIsChecked = false,
    setIsChecked: setState,
    isChecked: state,
    ...rest
  }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  const [isChecked, setIsChecked] = useAlterState<boolean>(initialIsChecked, [
    state,
    setState,
  ]);
  return WithSwitch({
    children: (attrs) => {
      const tag = useAs(as, "button");
      return createElement(tag, { ref, ...attrs }, children);
    },
    isChecked,
    setIsChecked,
    ...rest,
  });
}

/**
 * ```tsx
 * import { Switch } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   return <Switch />;
 * };
 * ```
 */
const Switch = forwardRef(_Switch);

export default Switch;
