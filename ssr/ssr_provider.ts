// This module is browser compatible.

import { createElement, ReactNode, useContext, useMemo } from "react";
import Context from "./context.ts";
import { _DEFAULT_CONTEXT } from "./constant.ts";
import { _ContextValue } from "./types.ts";

export type Props = {
  children: ReactNode;
};

export default function SSRProvider({ children }: Props): JSX.Element {
  const ctx = useContext(Context);
  const value = useMemo<_ContextValue>(() => ({
    // If this is the first SSRProvider, start with an empty string prefix, otherwise
    // append and increment the counter.
    prefix: ctx === _DEFAULT_CONTEXT ? "" : `${ctx.prefix}-${++ctx.current}`,
    current: -1,
  }), [ctx]);

  return createElement(Context.Provider, { value }, children);
}
