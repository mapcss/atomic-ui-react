// deno-lint-ignore-file no-explicit-any
import { AllHTMLAttributes, ReactEventHandler, useMemo } from "react";
import { Fn, isFunction, mapEntries, mapValues } from "../deps.ts";
import { equal, isEventHandlerName } from "../util.ts";
import useDep from "./use_dep.ts";

export default function useAttributesWith<
  Args extends readonly unknown[],
  Attributes extends Readonly<Record<any, any>> = Partial<
    AllAttributesWith<Args>
  >,
  Return extends Record<string, any> = AllHTMLAttributes<Element>,
>(
  args: Args,
  attributes: Attributes,
): Return {
  const $args = useDep(args, equal);
  const $attributes = useDep(attributes, equal);

  const attrs = useMemo<Return>(() => {
    const props = propsWith(attributes, args);
    const result = mapEntries(props, applyNotEventHandler);

    return result as Return;
  }, [$args, $attributes]);

  return attrs;
}

function applyNotEventHandler<T, O>([key, value]: [string, T]): [string, O] {
  if (!isFunction(value) || isEventHandlerName(key)) return [key, value as any];
  return [key, value.call(null)];
}

type PropsWith<
  T extends Record<any, any>,
  Args extends readonly unknown[],
  Predict = Fn,
  Or = void,
> = {
  [k in keyof T]: T[k] extends Predict
    ? CompositeArgs<T[k], Args, ReturnType<T[k]> | Or>
    : T[k];
};

type LazyablePropsWith<
  T,
  Args extends readonly unknown[] = [],
  ExclusivePredict = Fn,
> = {
  [k in keyof T]: T[k] extends ExclusivePredict ? T[k]
    : CompositeArgs<Lazyable<T[k]>, Args> | T[k];
};

export type AllAttributesWith<
  Args extends readonly unknown[],
  Attributes extends Readonly<Omit<AllHTMLAttributes<Element>, "children">> =
    Readonly<
      Required<
        Omit<AllHTMLAttributes<Element>, "children">
      >
    >,
> = PropsWith<
  LazyablePropsWith<Attributes, Args, ReactEventHandler | Fn>,
  Args,
  ReactEventHandler
>;

export type AttributesHandler<
  Args extends readonly unknown[],
  Key extends keyof AllHTMLAttributes<Element>,
  Attributes extends Readonly<AllHTMLAttributes<Element>> = Readonly<
    Required<AllHTMLAttributes<Element>>
  >,
> = AllAttributesWith<Args, Attributes>[Key];

type Lazyable<T> = T extends Fn ? T
  : () => T;

function compositeArgs<T extends (...args: any) => unknown>(
  value: T,
  ...args: any
) {
  return (...originalArgs: Parameters<T>): ReturnType<T> => {
    return value.apply(null, originalArgs.concat(...args)) as ReturnType<T>;
  };
}

type CompositeArgs<
  T extends Fn,
  Args extends readonly unknown[],
  Return = ReturnType<T>,
> = (...args: [...Parameters<T>, ...Args]) => Return;

function propsWith<T extends Record<PropertyKey, unknown>>(
  value: Readonly<T>,
  ...args: any
): T {
  return mapValues(
    value,
    (v) =>
      isFunction(v)
        ? compositeArgs(v as (...args: any) => unknown, ...args)
        : v,
  ) as T;
}
