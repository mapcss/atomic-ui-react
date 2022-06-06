// This module is browser compatible.

import { DependencyList, useCallback, useMemo, useState } from "react";
import { resolveLazy } from "../util.ts";
import { Useable } from "../hooks/types.ts";
import { END, INIT, START, WAIT } from "./constant.ts";
import { VFn } from "../deps.ts";
import { TransitionName } from "./types.ts";
import { useBind, useCallable, useLifecycle } from "../hooks/mod.ts";

export type TransitionsLifecycle = {
  [INIT]: TransitionName[];
  [START]: TransitionName[];
  [WAIT]: TransitionName[];
  [END]: TransitionName[];
};

/** Named transition lifecycle
 * - `init`: Initializing
 * - `start`: Starting
 * - `wait`: Waiting for end
 * - `end`: Ended
 */
export type TransitionLifecycle = keyof TransitionsLifecycle;

/** When `use` is `true`, first element is `true`, otherwise `false` */
export type Returns = [true, TransitionLifecycle] | [false];

type TransitionPhase = 0 | 1 | 2 | 3;

const TRANSITION_PHASES: Record<
  TransitionPhase,
  TransitionLifecycle
> = {
  0: INIT,
  1: START,
  2: WAIT,
  3: END,
} as const;

export type Params = {
  /** Specifies the transition duration */
  duration: number | (() => number);
} & Partial<Useable>;

/** Reactive state that records the current status of the transaction lifecycle.
 * @param deps Effect will only activate if the values in the list change. Must be specified to monitor component lifecycle. Otherwise, loops may occur.
 * ```tsx
 * import { useTransitionLifecycle, getDuration } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   const [isActivated, lifecycle] = useTransitionLifecycle({
 *     duration: () => {
 *       const el = globalThis.document.getElementById("target");
 *       return el ? getDuration(el) : 0;
 *     },
 *   }, []);
 * };
 * ```
 */
export default function useTransitionLifecycle(
  { duration, use = true }: Readonly<Params>,
  deps: DependencyList,
): Returns {
  const [state, setState] = useState<TransitionPhase>(0);

  const callback = useCallback<() => VFn>(() => {
    setState(1);

    let tid: number;

    const rid = requestAnimationFrame(() => {
      setState(2);
      const ms = resolveLazy(duration);
      tid = setTimeout(() => setState(3), ms);
    });

    const callback: VFn = () => {
      cancelAnimationFrame(rid);
      if (tid) {
        clearTimeout(tid);
      }
    };

    return callback;
  }, [setState, duration]);

  const set1 = useBind(setState, 0);
  const onBeforeMount = useCallable(set1, use);
  const onAfterMounted = useCallable(callback, use);

  useLifecycle({ onBeforeMount, onAfterMounted }, deps);

  const returns = useMemo<Returns>(() => {
    if (!use) return [false];
    return [true, TRANSITION_PHASES[state]];
  }, [use, state]);

  return returns;
}
