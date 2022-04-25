// This module is browser compatible.

import { DependencyList, RefObject, useMemo } from "react";
import { joinChars } from "../deps.ts";
import { isRefObject, Lazyable, lazyEval } from "../util.ts";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import useMutated from "../hooks/use_mutated.ts";
import { Transition, TransitionProps } from "./types.ts";
import useTransitionLifeCycle, {
  TransitionLifecycle,
  TransitionLifecycleMap,
} from "./use_transition_lifecycle.ts";
import { getDuration, getTransitionMap } from "./util.ts";
import { END, INACTIVE } from "./constant.ts";

export type TransitionStatus = TransitionLifecycle | typeof INACTIVE;

export type ElementLike<T extends Element = Element> =
  | Lazyable<T | undefined | null>
  | RefObject<T | undefined>;

export type Param<T extends Element = Element> = {
  /** Target to monitor end of transitions.
   * Specify `Element` or equivalent.
   * The duration and delay of the transition are taken from the actual DOM and used to calculate the length of the transition.
   */
  target: ElementLike<T>;

  /** Whether the target should be shown or hidden. */
  isShow: boolean;

  /** Whether do transitions immediately(on first mount) or not.
   * - `true` - do transition on first mount.
   * - `false` - do not transition on first mount.
   * @default false
   */
  immediate?: boolean;
};

export type ReturnValue =
  & {
    /** The className from adapted currently transition. */
    className: string;

    /** Whether transition lifecycle is completed or not. */
    isCompleted: boolean;

    /** List of currently adapted transition. */
    currentTransitions: Transition[];
    /** Current transition lifecycle */

    status: TransitionStatus;
  }
  & ({ isActivated: true; lifecycle: TransitionLifecycle } | {
    isActivated: false;
    lifecycle: undefined;
  });

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
 *   }, [isShow]);
 *
 *   return <div ref={ref} className={className}></div>
 *   };
 * ```
 */
export default function useTransition<T extends Element>(
  { target, isShow, immediate = false }: Readonly<Param<T>>,
  transitionProps: Readonly<
    Partial<TransitionProps>
  >,
  deps: DependencyList,
): ReturnValue {
  const { isFirstMount } = useIsFirstMount();
  const hasMutate = useMutated([
    isShow,
    immediate,
    JSON.stringify(transitionProps),
  ]);

  const use = useMemo<boolean>(() => {
    if (immediate) return true;
    if (isFirstMount) return false;

    return hasMutate;
  }, [hasMutate]);

  const [isActivated, transitionLifecycle] = useTransitionLifeCycle(
    {
      duration: () => {
        const maybeElement = resolveElement(target);
        return maybeElement ? getDuration(maybeElement) : 0;
      },
      use,
    },
    [use, JSON.stringify(deps)],
  );

  const isCompleted = useMemo<boolean>(() => transitionLifecycle === END, [
    transitionLifecycle,
  ]);

  const transitionLifecycleMap = useMemo<TransitionLifecycleMap>(
    () => getTransitionMap(isShow),
    [isShow],
  );

  const currentTransitions = useMemo<Transition[]>(
    () =>
      isActivated === false ? [] : transitionLifecycleMap[transitionLifecycle],
    [isActivated, transitionLifecycle, JSON.stringify(transitionLifecycleMap)],
  );

  const status = useMemo<TransitionStatus>(
    () => isActivated ? transitionLifecycle : INACTIVE,
    [isActivated, transitionLifecycle],
  );

  const className = useMemo<string>(() => {
    const transitions = currentTransitions.map((key) => transitionProps[key]);
    return joinChars(transitions, " ");
  }, [currentTransitions]);

  return {
    className,
    isCompleted,
    isActivated,
    status,
    currentTransitions,
    lifecycle: transitionLifecycle as never, // for conditional types,
  };
}

export function resolveElement<E extends Element>(
  elementLike: ElementLike<E>,
): E | undefined | null {
  if (isRefObject(elementLike)) {
    return elementLike.current;
  }

  return lazyEval(elementLike);
}
