// This module is browser compatible.

import { createElement, ReactNode, useMemo, useRef } from "react";
import useTransition, {
  joinCharacters,
  TransitionProps,
} from "./use_transition.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = TransitionProps & {
  /** The element the Wrapper should render as.
   * @default `div`
   */
  as?: As;

  /** Whether the children should be shown or hidden. */
  show: boolean;

  children: ReactNode;
};

export type Props<As extends keyof JSX.IntrinsicElements> =
  & Readonly<_Props<As>>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As> | "ref">;

export default function Transition<
  As extends keyof JSX.IntrinsicElements = "div",
>(
  {
    show,
    children,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    as,
    className: _className,
    ...props
  }: Props<As>,
): JSX.Element {
  const ref = useRef<HTMLElement>();
  const _as = as ?? "div";

  const { className: __className, show: isShow } = useTransition(
    { ref, show },
    {
      enter,
      enterFrom,
      enterTo,
      leave,
      leaveFrom,
      leaveTo,
    },
  );
  const className = useMemo<string>(
    () => joinCharacters([_className, __className]),
    [_className, __className],
  );

  return createElement(
    _as,
    { ref, className, ...props },
    isShow ? children : undefined,
  );
}
