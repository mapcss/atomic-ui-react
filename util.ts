// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import { isFunction } from "./deps.ts";

export type Lazyable<T, U extends (...args: any[]) => T = () => T> = T | U;
export const isBrowser = !("Deno" in globalThis);

export function lazyEval<T, U extends (...args: any[]) => T = () => T>(
  lazyable: Lazyable<T, U>,
): T {
  return isFunction(lazyable) ? lazyable() : lazyable;
}
