// This module is browser compatible.

// deno-lint-ignore-file no-explicit-any
import { ReactElement, RefCallback, RefObject, useRef } from "react";
import { isFunction, isNil, isObject } from "../deps.ts";
import { hasRef } from "../util.ts";
import { ATOMIC_UI } from "../_shared/constant.ts";

const ERROR_MSG = `${ATOMIC_UI} String ref is not supported.`;

export type ReturnValue<E extends HTMLElement | SVGElement | MathMLElement> = [
  RefObject<E>,
  RefObject<E> | RefCallback<E>,
];

export default function useChildRef<
  E extends HTMLElement | SVGElement | MathMLElement,
>(
  value: Readonly<ReactElement>,
): ReturnValue<E> {
  const ref = useRef<E>(null);

  if (!hasRef(value) || isNil(value.ref)) {
    return [ref, ref];
  }

  if (isFunction(value.ref)) {
    const fn = (instance: any) => {
      if (isFunction(value.ref)) {
        value.ref(instance);
        (ref as any).current = instance;
      }
    };
    return [ref, fn];
  }

  if (isObject(value.ref)) {
    return [value.ref, value.ref] as any;
  }

  throw Error(ERROR_MSG);
}
