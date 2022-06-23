// This module is browser compatible.

// deno-lint-ignore-file no-explicit-any
import {
  DependencyList,
  EffectCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { isFunction, isString } from "../deps.ts";

export type Params = {
  /** A function to be executed after the timer expires. */
  callback: EffectCallback | TimerHandler;

  /** The time, in milliseconds that the timer should wait before the specified function or code is executed.
   * If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle. */
  ms: number | undefined;

  /** Additional arguments which are passed through to the function specified by `function`. */
  args?: Iterable<unknown>;
};

/** Safe `setTimeout` that automatically clear on unmount or `deps` is updated.
 * @param params useTimeout parameters.
 * @param deps If present, effect will only activate if the values in the list change.
 * ```tsx
 * import { useTimeout } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   useTimeout({
 *     callback: () => {
 *       console.log("call after 2s");
 *     },
 *     ms: 2000,
 *   }, []);
 * };
 * ```
 */
export default function useTimeout(
  {
    callback,
    ms,
    args = [],
  }: Readonly<Params>,
  deps?: DependencyList,
) {
  const destructor = useRef<ReturnType<EffectCallback>>();
  const handler = useMemo<TimerHandler>(
    () =>
      isString(callback) ? callback : ((...args: readonly any[]) => {
        // deno-lint-ignore ban-types
        destructor.current = (callback as Function).apply(null, args);
      }),
    [callback],
  );
  useEffect(() => {
    const id = setTimeout(handler, ms, ...args);

    return () => {
      clearTimeout(id);
      if (isFunction(destructor.current)) {
        destructor.current();
        destructor.current = undefined;
      }
    };
  }, deps);
}
