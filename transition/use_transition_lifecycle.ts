import { DependencyList, useMemo, useState } from "react";
import { Lazyable, lazyEval } from "../util.ts";
import { Useable } from "../hooks/types.ts";
import useLifecycle from "../hooks/use_lifecycle.ts";
import { END, INIT, START, WAIT } from "./constant.ts";
import { Transition } from "./types.ts";

export type TransitionLifecycleMap = {
  [INIT]: Transition[];
  [START]: Transition[];
  [WAIT]: Transition[];
  [END]: Transition[];
};

/** Named transition lifecycle
 * - `init`: Initializing
 * - `start`: Starting
 * - `wait`: Waiting for end
 * - `end`: Ended
 */
export type TransitionLifecycle = keyof TransitionLifecycleMap;

/** When `use` is `true`, first element is `true`, otherwise `false` */
export type ReturnValue = [true, TransitionLifecycle] | [false];

type TransitionPhase = 0 | 1 | 2 | 3;

const TRANSITION_PHASE_MAP: Record<
  TransitionPhase,
  TransitionLifecycle
> = {
  0: INIT,
  1: START,
  2: WAIT,
  3: END,
} as const;

export type Param = {
  /** Specifies the transition duration */
  duration: Lazyable<number>;
} & Partial<Useable>;

/** Reactive state that records the current status of the transaction lifecycle
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
  { duration, use = true }: Readonly<Param>,
  /** Effect will only activate if the values in the list change.
   * Must be specified to monitor component lifecycle. Otherwise, loops may occur.
   */
  deps: DependencyList,
): ReturnValue {
  const [state, setState] = useState<TransitionPhase>(0);

  useLifecycle(
    {
      onBeforeMount: () => setState(0),
      onAfterMounted: () => {
        setState(1);

        let tid: number;

        const rid = requestAnimationFrame(() => {
          setState(2);
          const ms = lazyEval(duration);
          tid = setTimeout(() => setState(3), ms);
        });

        return () => {
          cancelAnimationFrame(rid);
          if (tid) {
            clearTimeout(tid);
          }
        };
      },
    },
    { use },
    deps,
  );

  const returnValue = useMemo<ReturnValue>(() => {
    if (!use) return [false];
    return [true, TRANSITION_PHASE_MAP[state]];
  }, [use, state]);

  return returnValue;
}
