// This module is browser compatible.

import { createElement, forwardRef, ReactNode, Ref } from "react";
import { StateSet, Tag } from "../types.ts";
import { Exclusive } from "../util.ts";
import { IsCheckedProps } from "./types.ts";
import WithSwitch, { Props as WithSwitchProps } from "./with_switch.ts";
import { useAlterState } from "../hooks/mod.ts";

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
  & Exclusive<{
    /** `isChecked` and dispatch it set. */
    isCheckedSet: StateSet<boolean>;
  }, {
    /** Initial `isChecked` state.
     * @default false
     */
    initialIsChecked?: boolean;
  }>;

export type Props<As extends Tag> = _Props<As>;

function _Switch<As extends Tag = "button">(
  {
    as = "button" as As,
    children,
    initialIsChecked = false,
    isCheckedSet,
    onIsCheckChange,
    ...allAttributes
  }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  const [isChecked, setIsChecked] = useAlterState<boolean>(
    initialIsChecked,
    isCheckedSet,
  );
  return WithSwitch({
    children: (attrs) => {
      return createElement(as, { ref, ...attrs }, children);
    },
    isChecked,
    setIsChecked,
    onIsCheckChange,
    ...allAttributes,
  });
}

/**
 * ```tsx
 * import { Switch } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   return <Switch />;
 * };
 * ```
 */
const Switch = forwardRef(_Switch);

export default Switch;
