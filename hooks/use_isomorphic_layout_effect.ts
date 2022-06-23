// This module is browser compatible.

import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "../util.ts";

/** `useLayoutEffect` that that works on server.
 * @param effect Imperative function that can return a cleanup function.
 * @param deps If present, effect will only activate if the values in the list change.
 * ```tsx
 * import { useIsomorphicLayoutEffect } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   useIsomorphicLayoutEffect(() => {
 *     // effect
 *   }, []);
 * };
 * ```
 */
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
