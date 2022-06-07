import { useCallback } from "react";
import { Fn } from "../deps.ts";

/** Create a conditional callable function.
 * @param callback The callback function.
 * @param callable condition.
 * - `true` callback is called and returns its return value.
 * - `false` callback will not be called and will return early.
 *
 * ```tsx
 * import { useCallable } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   const callback = useCallable(() => {
 *     console.log("This will not call");
 *   }, false);
 * };
 * ```
 */
// deno-lint-ignore no-explicit-any
export default function useCallable<F extends Fn<readonly any[]>>(
  callback: F,
  callable = true,
): (...args: Parameters<F>) => ReturnType<F> | undefined {
  return useCallback<(...args: Parameters<F>) => ReturnType<F> | undefined>(
    (...args) => {
      if (!callable) return;

      return callback.apply(null, args);
    },
    [callback, callable],
  );
}
