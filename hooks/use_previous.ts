// This module is browser compatible.

import { useRef } from "react";

/** Hooks that return values from previous rendering value.
 * @param state Current state.
 * @param initialValue Initial value as previous. default is `undefined`
 * ```tsx
 * import { usePrevious } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *    const prev = usePrevious(false) // undefined
 *    // rerender
 *    prev // false
 * }
 * ```
 */
export default function usePrevious<T, U = undefined>(
  state: T,
  initialValue?: U,
): T | U {
  const ref = useRef<T | U | undefined>(initialValue);
  const previous = ref.current;
  ref.current = state;
  return previous as T | U;
}
