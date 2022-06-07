import { useState } from "react";

export default function useAlterState<T>(
  initialState: T | (() => T),
  stateSet?: [T, (state: T) => void],
): [T, (state: T) => void] {
  const _stateSet = useState(initialState);

  return stateSet ? stateSet : _stateSet;
}
