// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import {
  ComponentProps,
  createElement,
  ElementType,
  forwardRef,
  Ref,
  RefObject,
  useMemo,
  useRef,
} from "react";
import useTooltipState, { Param } from "./use_tooltip_state.ts";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

type _Props<
  As extends ElementType,
  R extends Element = any,
> = {
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
};

export type Props<
  As extends keyof JSX.IntrinsicElements,
  R extends Element = any,
> =
  & _Props<As, R>
  & Omit<ComponentProps<As>, keyof _Props<As, R>>
  & Partial<Omit<Param, "target">>;

function _TooltipProvider<As extends keyof JSX.IntrinsicElements>(
  {
    as: _as,
    children,
    enterEvent = ["mouseenter"],
    leaveEvent = ["mouseleave"],
    ...props
  }: Readonly<Props<As>>,
  ref: Ref<any>,
): JSX.Element {
  const as = useMemo(() => _as ?? "div", [_as]);
  const target = useRef<Element>(null);
  const [isShow] = useTooltipState(
    { target, enterEvent, leaveEvent },
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
