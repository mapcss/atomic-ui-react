import { useMemo } from "react";
import { ReturnValue as UseTransitionReturnValue } from "./use_transition.ts";

export type ReturnValue = {
  isReady: boolean;
};

export default function useGroupTransition(
  root: UseTransitionReturnValue,
  child: UseTransitionReturnValue | undefined,
): ReturnValue {
  const isReady = useMemo<boolean>(() => {
    if (!child) return root.isShowable;

    return ![root, child].every(({ isShowable }) => !isShowable);
  }, [
    JSON.stringify(root),
    JSON.stringify(child),
  ]);

  return { isReady };
}
