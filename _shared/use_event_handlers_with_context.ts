import { useMemo } from "react";
import { AllHandlerMap, HandlersWithContext } from "../types.ts";
import { mapValues } from "../deps.ts";

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
  { serializeContext }: Readonly<
    Partial<
      Options<Context>
    >
  > = {},
): AllHandlerMap {
  const _serializeContext = useMemo(
    () => serializeContext ?? defaultSerializeContext,
    [serializeContext],
  );

  const memorized = useMemo<AllHandlerMap>(() => {
    // deno-lint-ignore no-explicit-any
    return mapValues(handlers, (handler) => (ev: any) => handler(ev, context));
  }, [...Object.entries(handlers).flat(), ..._serializeContext(context)]);

  return memorized;
}

const defaultSerializeContext = <Context>(context: Context) => {
  return Object.entries(context).flat();
};
