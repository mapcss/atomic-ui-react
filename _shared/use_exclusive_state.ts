import { Dispatch, SetStateAction, useState } from "react";

export default function useExclusiveState<T>(
  { initialState, setState, state }: Partial<{
    initialState: T | (() => T);
    setState: Dispatch<SetStateAction<T>>;
    state: T;
  }>,
): [T, Dispatch<SetStateAction<T>>] {
  const stateSet = useState<T | undefined>(initialState);

  if (setState) return [state as never, setState];
  return stateSet as never;
}
