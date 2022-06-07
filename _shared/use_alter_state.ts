import { useMemo, useState } from "react";

export default function useAlterState<T>(
  initialValue: T | (() => T),
  [state, setState]: [T | undefined, ((state: T) => void) | undefined],
): [T, (state: T) => void] {
  const _stateSet = useState(initialValue);

  return useMemo<[T, (state: T) => void]>(() => {
    if (setState) {
      return [state, setState] as [T, (state: T) => void];
    } else {
      return _stateSet;
    }
  }, [_stateSet[0], _stateSet[1], state, setState]);
}
