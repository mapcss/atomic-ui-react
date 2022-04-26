// This module is browser compatible.

// deno-lint-ignore-file no-explicit-any
import {
  DependencyList,
  EffectCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { isString } from "../deps.ts";

type Useable = {
  /** Whether enable this hooks or not.
   * @default true
   */
  use: boolean;
};

export type Handler = EffectCallback | TimerHandler;
export type Option = {
  /** The time, in milliseconds that the timer should wait before the specified function or code is executed.
   * If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle. */
  ms: number;

  /** Additional arguments which are passed through to the function specified by `function`. */
  args: any[];
} & Useable;

/** Safe `setTimeout` with effect */
export default function useTimeout(
  handler: Handler,
  { ms, use = true, args }: Readonly<Partial<Option>> = {},
  deps?: DependencyList,
): void {
  const callback = useRef<ReturnType<EffectCallback>>();

  const _handler = useMemo<Handler>(() => {
    return isString(handler) ? handler : (...args: any[]) => {
      // deno-lint-ignore ban-types
      callback.current = (handler as Function).call(null, ...args);
    };
  }, [handler]);
  useEffect(() => {
    if (!use) return;

    const id = setTimeout(_handler, ms, args);

    return () => {
      clearTimeout(id);
      if (callback.current) {
        callback.current();
        callback.current = undefined;
      }
    };
  }, [_handler, ms, use, JSON.stringify(args), JSON.stringify(deps)]);
}
