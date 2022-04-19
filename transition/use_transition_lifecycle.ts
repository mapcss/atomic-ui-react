import { DependencyList, useMemo, useState } from "react";
import { isNumber } from "../deps.ts";
import { Lazyable, lazyEval } from "../util.ts";
import useOnMount from "../hooks/use_on_mount.ts";
import { END, INIT, START, WAIT } from "./constant.ts";
import { Transition } from "./types.ts";

export type TransitionLifecycleMap = {
  [INIT]: Transition[];
  [START]: Transition[];
  [WAIT]: Transition[];
  [END]: Transition[];
};

/** Transition lifecycle named
 * - `init`: Initializing
 * - `start`: Starting
 * - `wait`: Waiting for end
 * - `end`: Ended
 */
export type TransitionLifecycle = keyof TransitionLifecycleMap;

type TransitionPhase = 0 | 1 | 2 | 3;

const TRANSITION_PHASE_MAP: Record<TransitionPhase, TransitionLifecycle> = {
  0: INIT,
  1: START,
  2: WAIT,
  3: END,
} as const;

/** Reactive state that records the current status of the transaction lifecycle
 * ```tsx
 * import { useTransitionLifecycle, getDuration } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   const lifeCycle = useTransitionLifecycle(() => {
 *   const el = globalThis.document.getElementById("target")
 *   return el ? getDuration(el): 0
 * }, []);
 *   console.log(lifeCycle) // 'init'
 * };
 * ```
 */
export default function useTransitionLifecycle(
  /** Specifies the transition duration */
  duration: Lazyable<number>,
  /** If present, effect will only activate if the values in the list change.
   * Must be specified to monitor component lifecycle. Otherwise, loops may occur.
   */
  deps: DependencyList,
): TransitionLifecycle {
  const [state, setState] = useState<TransitionPhase>(0);

  useOnMount({
    onBeforeMount: () => setState(0),
    onAfterMount: () => {
      setState(1);

      let tid: number;

      const rid = requestAnimationFrame(() => {
        setState(2);
        const ms = lazyEval(duration);
        tid = setTimeout(() => setState(3), ms);
      });

      return () => {
        cancelAnimationFrame(rid);
        if (isNumber(tid)) {
          clearTimeout(tid);
        }
      };
    },
  }, { deps });

  const transitionLifeCycle = useMemo<TransitionLifecycle>(() => {
    return TRANSITION_PHASE_MAP[state];
  }, [state]);

  return transitionLifeCycle;
}
