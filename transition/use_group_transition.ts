import { useMemo } from "react";
import { Returns as UseTransitionReturns } from "./use_transition.ts";

export type ReturnValue = {
  isReady: boolean;
};

export default function useGroupTransition(
  root: UseTransitionReturns,
  child: UseTransitionReturns | undefined,
): ReturnValue {
  const isReady = useMemo<boolean>(() => {
    if (!child) return root[1].isShowable;

    return ![root, child].every(([_, { isShowable }]) => !isShowable);
  }, [
    JSON.stringify(root),
    JSON.stringify(child),
  ]);

  return { isReady };
}
