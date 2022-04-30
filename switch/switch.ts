// This module is browser compatible.

import {
  createElement,
  ForwardedRef,
  forwardRef,
  MouseEventHandler,
  useMemo,
} from "react";
import useAria, { Param } from "./use_switch_aria.ts";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element the Switch should render as.
   * @default `button`
   */
  as?: As;

  /** The function to call when the switch is toggled. */
  onChange: (isChecked: boolean) => void;
} & Partial<Param>;

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

function _Switch<As extends keyof JSX.IntrinsicElements>(
  { isChecked, onChange, onClick, as, ...rest }: Props<As>,
  ref: ForwardedRef<As>,
): JSX.Element {
  const _as = as ?? "button";

  const ariaProps = useAria({ isChecked });
  const handleClick = useMemo<MouseEventHandler>(() => {
    return (ev) => {
      onClick?.(ev as never);
      onChange(!isChecked);
    };
  }, [isChecked, onClick, onChange]);
  const props = useMemo(() => ({
    ref,
    ...ariaProps,
    tabIndex: 0,
    onClick: handleClick,
  }), [ariaProps, handleClick]);

  return createElement(
    _as,
    {
      ...props,
      ...rest,
    },
  );
}

const Switch = forwardRef(_Switch);

export default Switch;
