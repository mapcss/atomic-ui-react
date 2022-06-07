// This module is browser compatible.

import { useMemo, useState } from "react";

export type Callbacks = {
  /** Update to `true`. */
  on: () => void;

  /** Update to `false`. */
  off: () => void;

  /** Toggle state. */
  toggle: () => void;
};

export type Returns = [boolean, Callbacks];

/** Manage boolean (on - off) states.
 * @param initialState Initial state or function that return the initial state.
 * ```tsx
 * import { useBoolean } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   const [state, { on, off, toggle }] = useBoolean();
 * };
 * ```
 */
export default function useBoolean(
  initialState: boolean | (() => boolean) = false,
): Returns {
  const [state, setState] = useState(initialState);
  const callbacks = useMemo<Callbacks>(
    () => ({
      on: () => setState(true),
      off: () => setState(false),
      toggle: () => setState((prev) => !prev),
    }),
    [],
  );
  return [state, callbacks];
}
