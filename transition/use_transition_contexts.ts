// This module is browser compatible.

import { useCallback, useMemo } from "react";
import { isNumber } from "../deps.ts";
import { ElementLike, resolveElementLike } from "../util.ts";
import { TransitionName } from "./types.ts";
import useTransitionLifeCycle, {
  TransitionLifecycle,
  TransitionsLifecycle,
} from "./use_transition_lifecycle.ts";
import { getDuration, getTransitionMap } from "./util.ts";
import { END, ENTER, INACTIVE, LEAVE } from "./constant.ts";
import { useIsFirstMount, usePrevious } from "../hooks/mod.ts";

export type TransitionStatus = TransitionLifecycle | typeof INACTIVE;

export type DurationLike<E extends Element = Element> = number | ElementLike<E>;

export type Params<E extends Element = Element> = {
  /** Transition duration itself or it reference.
   * Specify `Element` or equivalent.
   * The duration and delay of the transition are taken from the actual DOM and used to calculate the length of the transition.
   */
  duration: DurationLike<E>;

  /** Whether transitions are enter phase or leave phase.
   * `true` - enter phase.
   * `false` - leave phase.
   */
  isEnter: boolean;

  /** Whether do transitions immediately(on first mount) or not.
   * - `true` - do transition on first mount.
   * - `false` - do not transition on first mount.
   * @default false
   */
  immediate?: boolean;
};

export type Contexts =
  & {
    /** Whether transition lifecycle is completed or not. */
    isCompleted: boolean;

    /** List of currently adapted transition. */
    currentTransitions: TransitionName[];

    /** Current transition lifecycle. */
    status: TransitionStatus;

    /** Whether transition is completed and `isShow` state is `false` or not. */
    isShowable: boolean;
  }
  & ({
    /** Whether transitions are activated or not. */
    isActivated: true;

    /** Named transition lifecycle */
    lifecycle: TransitionLifecycle;

    /** Current transition mode.
     * If it is not activated, return `undefined`.
     */
    mode: typeof ENTER | typeof LEAVE;
  } | {
    /** Whether transitions are activated or not. */
    isActivated: false;

    lifecycle: undefined;
    mode: undefined;
  });

/** Monitors the mount lifecycle and returns the appropriate transition status.
 * ```tsx
 * import { useRef, useState } from "react"
 * import { useTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 *
 * export default () => {
 *   const [isShow] = useState(true)
 *   const ref = useRef<HTMLDivElement>(null)
 *   const { className } = useTransition({ isShow, duration: ref }, {
 *     enter: "transition duration-300",
 *     enterFrom: "opacity-0",
 *   }, [isShow]);
 *
 *   return <div ref={ref} className={className}></div>
 *   };
 * ```
 */
export default function useTransitionContexts<T extends Element>(
  { duration, isEnter, immediate = false }: Readonly<Params<T>>,
): Contexts {
  const isFirst = useIsFirstMount();

  const use = useMemo<boolean>(() => {
    if (immediate) return true;
    if (isFirst) return false;

    return true;
  }, [isEnter]);

  const preUse = usePrevious(use, use);
  const preIsEnter = usePrevious(isEnter, isEnter);
  const lazyIsEnter = useMemo<boolean>(
    () => preUse ? preIsEnter : !preIsEnter,
    [preUse, preIsEnter],
  );

  const durationCallback = useCallback(() => resolveDurationLike(duration), [
    duration,
  ]);

  const [isActivated, transitionLifecycle] = useTransitionLifeCycle(
    { duration: durationCallback, use },
    [use, isEnter],
  );

  const isCompleted = useMemo<boolean>(() => transitionLifecycle === END, [
    transitionLifecycle,
  ]);

  const transitionsLifecycle = useMemo<TransitionsLifecycle>(
    () => getTransitionMap(lazyIsEnter),
    [lazyIsEnter],
  );

  const currentTransitions = useMemo<TransitionName[]>(
    () => isActivated ? transitionsLifecycle[transitionLifecycle] : [],
    [isActivated, transitionLifecycle, JSON.stringify(transitionsLifecycle)],
  );

  const status = useMemo<TransitionStatus>(
    () => isActivated ? transitionLifecycle : INACTIVE,
    [isActivated, transitionLifecycle],
  );

  const mode = useMemo<typeof LEAVE | typeof ENTER | undefined>(
    () => use ? lazyIsEnter ? ENTER : LEAVE : undefined,
    [use, lazyIsEnter],
  );

  const isShowable = useMemo<boolean>(
    () => {
      if (!isActivated) return isEnter;
      return !isCompleted || mode !== "leave";
    },
    [isCompleted, mode, isActivated, isEnter],
  );

  const contexts = useMemo<Contexts>(() => ({
    isCompleted,
    isActivated,
    status,
    currentTransitions,
    lifecycle: transitionLifecycle as never, // for conditional types
    mode: mode as never, // for conditional types
    isShowable,
  }), [
    isCompleted,
    isActivated,
    status,
    currentTransitions,
    transitionLifecycle,
    mode,
    isShowable,
  ]);

  return contexts;
}

export function resolveDurationLike<E extends Element = Element>(
  durationLike: DurationLike<E>,
): number {
  if (isNumber(durationLike)) {
    return Number.isFinite(durationLike) ? durationLike : 0;
  }
  const maybeElement = resolveElementLike(durationLike);
  return maybeElement ? getDuration(maybeElement) : 0;
}
