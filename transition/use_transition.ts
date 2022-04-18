// This module is browser compatible.

import { useEffect } from "react";
import { RefObject, useMemo, useState } from "react";
import { joinChars } from "../deps.ts";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";
import { Transition, TransitionLifecycleMap } from "./types.ts";
import useTransitionTiming from "./use_transition_timing.ts";
import {
  getDuration,
  getTransitionMap,
  mapTiming2TransitionLifecycle,
} from "./util.ts";
import { BEFORE_MOUNT, COMPLETE } from "./constant.ts";

export type Param<T extends Element> = {
  target: RefObject<T | undefined>;
  isShow: boolean;
};

export type ReturnValue = {
  /** The className from adapted currently transition. */
  className: string;

  /** Whether rendering of the transition is finished or not. */
  isRendered: boolean;

  /** List of currently adapted transition. */
  currentTransitions: Transition[];
};

export type TransitionProps = Record<Transition, string>;

/** Monitors the mount lifecycle and returns the appropriate transition status.
 * ```tsx
 * import { useRef, useState } from "react"
 * import { useTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 *
 * export default () => {
 *   const [isShow] = useState(true)
 *   const ref = useRef<HTMLDivElement>(null)
 *   const { className } = useTransition({ isShow, target: ref }, {
 *     enter: "transition duration-300",
 *     enterFrom: "opacity-0",
 *   });
 *
 *   return <div ref={ref} className={className}></div>
 *   };
 * ```
 */
export default function useTransition<T extends Element>(
  { target, isShow }: Readonly<Param<T>>,
  transitionProps: Readonly<
    Partial<TransitionProps>
  >,
): ReturnValue {
  const [state, setState] = useState<boolean>(isShow);

  const timing = useTransitionTiming(
    () => {
      return target.current ? getDuration(target.current) : 0;
    },
    [isShow],
  );

  useEffect(() => {
    if (timing === BEFORE_MOUNT && isShow) {
      setState(true);
    }
  }, [timing]);

  useIsomorphicLayoutEffect(() => {
    if (timing === COMPLETE && !isShow) {
      setState(false);
    }
  }, [timing]);

  const transitionLifecycleMap = useMemo<TransitionLifecycleMap>(
    () => getTransitionMap(isShow),
    [isShow],
  );

  const currentTransitions = useMemo<Transition[]>(
    () => mapTiming2TransitionLifecycle(timing, transitionLifecycleMap),
    [timing, transitionLifecycleMap],
  );

  const className = useMemo<string>(() => {
    const transitions = currentTransitions.map((key) => transitionProps[key]);
    return joinChars(transitions, " ");
  }, [currentTransitions]);

  return {
    className,
    isRendered: state,
    currentTransitions,
  };
}
