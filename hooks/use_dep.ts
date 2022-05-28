// This module is browser compatible.

import { useRef } from "react";
import usePrevious from "./use_previous.ts";

export type Compare<D> = (prev: D, current: D) => boolean;

/** Hooks for `deps` that define custom equivalence function.
 * Custom equivalent functions can suppress re-execution of hooks. This is useful when `deps` contains objects.
 * @remark
 * If the object's properties are obvious, it is recommended to enumerate the values in `deps`.
 * ```tsx
 * import { equal, useDep } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * import { useEffect } from "react"
 * export default () => {
 *   const object: Record<PropertyKey, unknown> = {};
 *   const $object = useDep(object, (prev, current) => equal(prev, current));
 *
 *   useEffect(() => {
 *     console.log(object);
 *   }, [$object]);
 * };
 * ```
 */
export default function useDep<D>(
  /** Value to which the custom comparison function is adapted.
   * This specifies the value that should be the argument of `deps`. */
  dep: D,
  /** Comparison function.
   * The first argument is the value at the last rendering, the second argument is the current value. */
  compare: Compare<D>,
): boolean {
  const ref = useRef<boolean>(false);
  const prevDeps = usePrevious(dep);

  if (prevDeps && !compare(prevDeps, dep)) {
    ref.current = !ref.current;
  }

  return ref.current;
}
