// This module is browser compatible.

import { DependencyList, useState } from "react";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";

/** Observe mutation of deps
 * ```tsx
 * import { useState } from "react"
 * import { useMutated } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default ()=> {
 *   const [state ] = useState(false)
 *   const hasMutated = useMutated([state])
 * }
 * ```
 */
export default function useMutated(deps: DependencyList): boolean {
  const [state, setState] = useState(false);
  const { isFirstMount } = useIsFirstMount();

  useIsomorphicLayoutEffect(() => {
    if (isFirstMount || state) return;
    setState(true);
  }, deps);

  return state;
}
