import { Dispatch, useMemo, useState } from "react";

/** Return `useState` return value or custom state and dispatch set.
 * @param initialState Initial state.
 * @param stateSet Custom state and dispatch set.
 * ```tsx
 * import { useStateSet } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * import { useState } from "react";
 * export default () => {
 *   const [state, setState] = useStateSet(false);
 *   const states = useState(true);
 *   const stateSet = useStateSet(undefined, states);
 * };
 * ```
 */
export default function useStateSet<S>(
  initialState: S | (() => S),
  stateSet?: [S, Dispatch<S>],
): [S, Dispatch<S>] {
  const _stateSet = useState<S>(initialState);

  const memoed = useMemo<[S, Dispatch<S>] | undefined>(
    () => stateSet ? [stateSet[0], stateSet[1]] : undefined,
    [stateSet],
  );

  return useMemo<[S, Dispatch<S>]>(() => memoed ?? _stateSet, [
    memoed,
    _stateSet,
  ]);
}
