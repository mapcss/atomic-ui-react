// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import { Attributes, ReactElement, Ref, RefAttributes, RefObject } from "react";
import { isFunction, isLength0, isNil, isObject, isString } from "./deps.ts";

export type Lazyable<T, U extends (...args: any[]) => T = () => T> = T | U;

/** Whether this environment is Browser or not.
 * This is compatible with Node.js
 */
export const isBrowser = !("Deno" in globalThis) && !("process" in globalThis);
export function lazyEval<T, U extends (...args: any[]) => T = () => T>(
  lazyable: Lazyable<T, U>,
): T {
  return isFunction(lazyable) ? lazyable() : lazyable;
}

export function isRefObject<T>(value: unknown): value is RefObject<T> {
  return isObject(value) && "current" in value;
}

export function hasRef<T>(
  element: ReactElement,
): element is ReactElement & RefAttributes<T> {
  return "ref" in element;
}

interface RefObjectAttributes<T> extends Attributes {
  ref?: RefObject<T>;
}

export function hasRefObject<T>(
  element: ReactElement & RefAttributes<T>,
): element is ReactElement & RefObjectAttributes<T> {
  return isObject(element.ref);
}

/** Utility for checking the child is under the parent or not. */
export function containElement(
  parent: Element | null | undefined | RefObject<Element>,
  maybeChild: Element,
): boolean {
  const el = isRefObject(parent) ? parent.current : parent;
  return el?.contains(maybeChild) ?? false;
}

/** `Element` or `Element` like */
export type ElementLike<T extends Element = Element> =
  | Lazyable<T | undefined | null>
  | RefObject<T | undefined>;

export function resolveElementLike<E extends Element>(
  elementLike: ElementLike<E>,
): E | undefined | null {
  if (isRefObject(elementLike)) {
    return elementLike.current;
  }

  return lazyEval(elementLike);
}

export type EventLike<E extends string> = E | Iterable<E>;

export function resolveEventType<T extends string>(
  value: T | Iterable<T>,
): T[] {
  const events = isString(value) ? [value] : Array.from(value);
  return events;
}

export function resolveRef<E>(
  children: ReactElement,
): RefObject<E> | undefined | never {
  if (!hasRef<E>(children) || isNil(children.ref)) return;

  if (hasRefObject(children)) return children.ref;
  throw Error(ERROR_MSG);
}

export function cleanCharacter(value: string): string {
  return value.trim().replaceAll(/\s+/g, " ");
}

export function joinChars(
  characters: (string | number | undefined | null)[],
  separator: string,
): string | undefined {
  const joined = (characters.filter((v) => !isNil(v))).map(
    String,
  )
    .map(cleanCharacter).filter(Boolean)
    .join(separator);

  return isLength0(joined) ? undefined : joined;
}

export function getRef<E>(
  el: ReactElement,
): Ref<E> | undefined {
  if (hasRef<E>(el)) {
    return el.ref;
  }
}

const ERROR_MSG = "[atomic-ui] Supported ref is only RefObject.";

export function resolveRefObject<T>(
  ...args: (Ref<T> | undefined)[]
): RefObject<T> | undefined | null | never {
  for (const arg of args) {
    if (!arg) continue;

    if (isRefObject(arg)) {
      return arg;
    } else {
      throw Error(ERROR_MSG);
    }
  }
}
