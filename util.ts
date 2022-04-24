// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import { isFunction, isObject } from "./deps.ts";
import { Attributes, ReactElement, RefAttributes, RefObject } from "react";

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

export function hasRefObject<T>(
  element: ReactElement & RefAttributes<T>,
): element is ReactElement & Attributes & { ref?: RefObject<T> } {
  return isObject(element.ref);
}
