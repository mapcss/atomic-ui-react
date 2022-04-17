// This module is browser compatible.

import { createElement, MouseEventHandler, useMemo } from "react";
import useAria, { Param } from "./use_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element the Switch should render as.
   * @default `button`
   */
  as?: As;

  /** The function to call when the switch is toggled. */
  onChange: (isChecked: boolean) => void;
} & Param;

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function Switch<
  As extends keyof JSX.IntrinsicElements = "button",
>({ checked, onChange, onClick, as, ...rest }: Props<As>): JSX.Element {
  const _as = as ?? "button";

  const ariaProps = useAria({ checked });
  const handleClick = useMemo<MouseEventHandler>(() => {
    return (ev) => {
      onClick?.(ev as never);
      onChange(!checked);
    };
  }, [checked, onClick, onChange]);
  const props = useMemo(() => ({
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