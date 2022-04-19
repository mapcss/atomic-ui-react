// This module is browser compatible.

import { RefObject, useMemo } from "react";
import { joinChars } from "../deps.ts";
import { Transition, TransitionProps } from "./types.ts";
import useTransitionLifeCycle, {
  TransitionLifecycleMap,
} from "./use_transition_lifecycle.ts";
import { getDuration, getTransitionMap } from "./util.ts";
import { END } from "./constant.ts";

export type Param<T extends Element = Element> = {
  /** Target to monitor end of transitions.
   * Specify `Element` or equivalent.
   * The duration and delay of the transition are taken from the actual DOM and used to calculate the length of the transition.
   */
  target: RefObject<T | undefined>;

  /** Whether the target should be shown or hidden. */
  isShow: boolean;
};

export type ReturnValue = {
  /** The className from adapted currently transition. */
  className: string;

  /** Whether transition lifecycle is completed or not. */
  isCompleted: boolean;

  /** List of currently adapted transition. */
  currentTransitions: Transition[];
};

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
  const transitionLifeCycle = useTransitionLifeCycle(
    () => {
      return target.current ? getDuration(target.current) : 0;
    },
    [isShow],
  );

  const isCompleted = useMemo<boolean>(() => transitionLifeCycle === END, [
    transitionLifeCycle,
  ]);

  const transitionLifecycleMap = useMemo<TransitionLifecycleMap>(
    () => getTransitionMap(isShow),
    [isShow],
  );

  const currentTransitions = useMemo<Transition[]>(
    () => transitionLifecycleMap[transitionLifeCycle],
    [transitionLifeCycle, transitionLifecycleMap],
  );

  const className = useMemo<string>(() => {
    const transitions = currentTransitions.map((key) => transitionProps[key]);
    return joinChars(transitions, " ");
  }, [currentTransitions]);

  return {
    className,
    isCompleted,
    currentTransitions,
  };
}
