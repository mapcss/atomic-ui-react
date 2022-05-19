// deno-lint-ignore-file no-explicit-any
import { LegacyRef, ReactElement, RefCallback, RefObject, useRef } from "react";
import { isFunction, isNil, isObject, isString } from "../deps.ts";
import { getRef } from "../util.ts";
import { ATOMIC_UI } from "../_shared/constant.ts";

const ERROR_MSG = `${ATOMIC_UI} String ref is not supported.`;

export type ReturnValue<E> = [
  RefObject<E>,
  RefObject<E> | RefCallback<E>,
];

export default function useMergedRef<E = HTMLElement | SVGElement>(
  ref: LegacyRef<E> | ReactElement,
): ReturnValue<E> {
  const _ref = useRef<E>(null);

  const childRef = isObject(ref) && "type" in ref ? getRef<E>(ref) : ref;

  if (isNil(childRef)) {
    return [_ref, _ref];
  }

  if (isString(childRef)) {
    throw Error(ERROR_MSG);
  }

  if (isFunction(childRef)) {
    const fn = (instance: any) => {
      if (isFunction(childRef)) {
        childRef(instance);
        (_ref as any).current = instance;
      }
    };
    return [_ref, fn];
  }

  return [childRef, childRef];
}
