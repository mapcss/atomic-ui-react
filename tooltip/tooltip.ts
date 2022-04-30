// This module is browser compatible.

import { createElement, ForwardedRef, forwardRef, useMemo } from "react";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

export type Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `span`
   */
  as?: As;
} & JSX.IntrinsicElements[As];

function _Tooltip<As extends keyof JSX.IntrinsicElements = "span">(
  { as: _as, ...props }: Props<As>,
  ref: ForwardedRef<As>,
) {
  const as = useMemo<string>(() => _as ?? "span", [_as]);
  return createElement(as, { role: "tooltip", ref, ...props });
}

const Tooltip = forwardRef(_Tooltip);

export default Tooltip;
