import { useState } from "react";

export default function useExclusiveState<T>(
  { initialState, setState, state }: Partial<{
    initialState: T | (() => T);
    setState: (state: T) => void;
    state: T;
  }>,
): [T, (state: T) => void] {
  const stateSet = useState<T | undefined>(initialState);

  if (setState) return [state as never, setState];
  return stateSet as never;
}
