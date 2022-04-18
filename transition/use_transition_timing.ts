import { DependencyList } from "react";
import { useMemo, useState } from "react";
import { isNumber } from "../deps.ts";
import { Lazyable, lazyEval } from "../util.ts";
import { TRANSITION_TIMING_MAP } from "./constant.ts";
import useOnMount from "../hooks/use_on_mount.ts";
import { TransitionStage, TransitionTiming } from "./types.ts";

export default function useTransitionTiming(
  extension: Lazyable<number>,
  deps: DependencyList,
): TransitionTiming {
  const [state, setState] = useState<TransitionStage>(0);

  useOnMount({
    onBeforeMount: () => setState(0),
    onAfterMount: () => {
      setState(1);

      let tid: number;

      const rid = requestAnimationFrame(() => {
        setState(2);
        const ms = lazyEval(extension);
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

  const transitionTiming = useMemo<TransitionTiming>(() => {
    return TRANSITION_TIMING_MAP[state];
  }, [state]);

  return transitionTiming;
}
