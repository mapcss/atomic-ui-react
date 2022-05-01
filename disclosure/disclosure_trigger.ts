// This module is browser compatible.

import {
  AriaAttributes,
  ComponentProps,
  createElement,
  forwardRef,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { isFunction } from "../deps.ts";
import Context from "./context.ts";
import { EventLike, isRefObject, resolveEventType } from "../util.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap, StateMap } from "./use_disclosure.ts";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

type _Props<As extends keyof JSX.IntrinsicElements> = {
  as?: As;
  event?: EventLike<keyof HTMLElementEventMap>;

  children: ReactNode | ((context: StateMap & DispatchMap) => ReactNode);
};

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<ComponentProps<As>, keyof _Props<As>>;

function _DisclosureTrigger<
  R extends HTMLElement,
  As extends keyof JSX.IntrinsicElements,
>(
  { event = "click", as: _as, children: _children, ...props }: Props<As>,
  _ref: Ref<R>,
): JSX.Element {
  const context = useContext(Context);
  if (!context) throw Error(ERROR_MSG);

  const ref = useRef(_ref);
  const as = useMemo<As>(() => _as ?? "button" as As, [_as]);
  const [{ id, isOpen }, { toggle, ...rest }] = context;
  const aria = useMemo<AriaAttributes>(() => {
    return {
      "aria-controls": id,
      "aria-expanded": isOpen,
    };
  }, [isOpen, id]);

  const events = useMemo<(keyof HTMLElementEventMap)[]>(
    () => resolveEventType(event),
    [JSON.stringify(event)],
  );

  useEffect(() => {
    if (!isRefObject<R>(ref) || !ref.current) return;

    events.forEach((type) => {
      ref.current?.addEventListener(type, toggle);
    });

    return () => {
      events.forEach((type) => {
        ref.current?.removeEventListener(type, toggle);
      });
    };
  }, [JSON.stringify(events)]);

  const children = isFunction(_children)
    ? _children({ id, isOpen, toggle, ...rest })
    : _children;

  return createElement(as, { ...aria, ...props, ref, children });
}

const DisclosureTrigger = forwardRef(_DisclosureTrigger);
export default DisclosureTrigger;
