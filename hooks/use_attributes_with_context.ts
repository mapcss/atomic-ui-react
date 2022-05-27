import { AllHTMLAttributes, useMemo } from "react";
import { filterKeys, isFunction, mapValues, not } from "../deps.ts";
import { isEventHandlerName } from "../util.ts";
import useEventHandlersWithContext from "../_shared/use_event_handlers_with_context.ts";

export type Params<Context, E> = {
  attributes: E;

  context: Context;
};

export default function useAttributesWithContext<
  Context extends Record<PropertyKey, unknown>,
  T extends Record<PropertyKey, unknown> = AllAttributesWithContext<
    Context,
    Element
  >,
>(
  { attributes, context }: Params<Context, T>,
): AllHTMLAttributes<Element> {
  const serialized = Object.entries(attributes).flat();
  const eventHandlers = useMemo<AllCallbacks<Element>>(() => {
    return filterKeys(
      attributes,
      isEventHandlerName,
    ) as AllCallbacks<
      Element
    >;
  }, [filterKeys, isEventHandlerName, ...serialized]);

  const { style, ...rest } = useMemo(() => {
    return filterKeys(
      attributes,
      not(isEventHandlerName),
    ) as WithContextCallback<AllAttributesWithoutCallback<T>, Context>;
  }, [filterKeys, isEventHandlerName, ...serialized]);

  const attrs = useMemo(() => {
    return mapValues(
      { style, ...rest },
      (attr) => isFunction(attr) ? attr(context) : attr,
    );
  }, [
    mapValues,
    isFunction,
    JSON.stringify(style),
    ...Object.entries(rest).flat(),
    ...Object.entries(context).flat(),
  ]);

  const handlers = useEventHandlersWithContext({
    handlers: eventHandlers,
    context,
  });

  return { ...attrs, ...handlers };
}

type PickBy<T, U> = {
  [k in keyof T as T[k] extends U ? k : never]: T[k];
};

type AllCallbackNames<T> = keyof Omit<
  // deno-lint-ignore ban-types
  PickBy<AllHTMLAttributes<T>, Function | undefined>,
  "download" | "inlist"
>;

type AllAttributesWithoutCallback<T> = Omit<
  AllHTMLAttributes<T>,
  AllCallbackNames<T>
>;

type AllCallbacks<T> = Pick<AllHTMLAttributes<T>, AllCallbackNames<T>>;

type AllCallbackWithContext<
  T extends Record<PropertyKey, (...args: never) => unknown>,
  Context,
> = {
  [k in keyof T]: (
    event: Parameters<T[k]>[0],
    context: Context,
  ) => ReturnType<T[k]>;
};

type WithContextCallback<T, Context> = {
  [k in keyof T]: T[k] | ((context: Context) => T[k]);
};

export type AllAttributesWithContext<Contexts, T> =
  & AllCallbackWithContext<AllCallbacks<T>, Contexts>
  & WithContextCallback<AllAttributesWithoutCallback<T>, Contexts>;

export type AttributesHandler<
  Contexts,
  K extends keyof AllHTMLAttributes<Element>,
> = AllAttributesWithContext<Contexts, Element>[K];
