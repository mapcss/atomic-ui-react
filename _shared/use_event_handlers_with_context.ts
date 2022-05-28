import { useMemo } from "react";
import { AllHandlerMap, HandlersWithContext } from "../types.ts";
import { equal } from "../util.ts";
import { mapValues } from "../deps.ts";
import useDep from "../hooks/use_dep.ts";

export type Params<Context> = {
  handlers: HandlersWithContext<Context>;
  context: Context;
};

export type Options<Context, T = unknown> = {
  serializeContext: (context: Context) => Iterable<T>;
};

export default function useEventHandlersWithContext<
  Context extends Record<PropertyKey, unknown>,
>(
  { handlers, context }: Readonly<Params<Context>>,
): AllHandlerMap {
  const d = useDep(handlers, equal);
  const e = useDep(context, equal);

  const memorized = useMemo<AllHandlerMap>(() => {
    return mapValues(
      handlers,
      // deno-lint-ignore no-explicit-any
      (handler) => handler ? (ev: any) => handler(ev, context) : undefined,
    );
  }, [d, e]);

  return memorized;
}
