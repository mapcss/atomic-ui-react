// This module is browser compatible.

import { useRef } from "react";

/** Hooks that return values from previous rendering value.
 * @param value Current value.
 * ```tsx
 * import { usePrevious } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *    const prev = usePrevious(false) // undefined
 *    // rerender
 *    prev // false
 * }
 * ```
 */
export default function usePrevious<T>(
  value: T,
): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  const previous = ref.current;
  ref.current = value;
  return previous;
}
