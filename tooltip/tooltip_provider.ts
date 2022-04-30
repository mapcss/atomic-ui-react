// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import {
  createElement,
  forwardRef,
  Ref,
  RefObject,
  useMemo,
  useRef,
} from "react";
import useTooltipState, { Param } from "./use_tooltip_state.ts";

export type Props<
  As extends keyof JSX.IntrinsicElements,
  R extends Element = any,
> =
  & {
    /**
     * @default `div`
     */
    as?: As;
    children: (
      context: {
        isShow: boolean;
        ref: RefObject<R>;
      },
    ) => JSX.Element;
  }
  & JSX.IntrinsicElements[As]
  & Partial<Omit<Param, "target">>;

function _TooltipProvider<As extends keyof JSX.IntrinsicElements>(
  {
    as: _as,
    children,
    enterEvents = ["mouseenter"],
    leaveEvents = ["mouseleave"],
    ...props
  }: Readonly<Props<As>>,
  ref: Ref<any>,
): JSX.Element {
  const as = useMemo(() => _as ?? "div", [_as]);
  const target = useRef<Element>(null);
  const [isShow] = useTooltipState(
    { target, enterEvents, leaveEvents },
    undefined,
    [],
  );

  return createElement(as, {
    ref,
    style: {
      position: "relative",
    },
    ...props,
    children: children({ isShow, ref: target }),
  });
}

const TooltipProvider = forwardRef(_TooltipProvider);

export default TooltipProvider;
