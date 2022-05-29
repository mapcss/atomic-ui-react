// This module is browser compatible.

import { useRef } from "react";

/** Whether first mount or not.
 * ```tsx
 * import { useIsFirstMount } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   const isFirstMount = useIsFirstMount(); // true
 *   // re-render
 *   isFirstMount; // false
 * };
 * ```
 */
export default function useIsFirstMount(): boolean {
  const ref = useRef<boolean>(true);
  const current = ref.current;

  if (current) {
    ref.current = false;
  }

  return current;
}
