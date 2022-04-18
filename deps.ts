// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

export {
  isBoolean,
  isFunction,
  isLength0,
  isNil,
  isNumber,
  isObject,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
import {
  isFunction,
  isUndefined,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export type VFn = () => void;

export const isBrowser = !("Deno" in globalThis);

export function wrap<T>(val: T): T extends any[] ? T : T[] {
  return Array.isArray(val) ? val as never : [val] as never;
}

export function filterTruthy<T>(value: T[]): (Exclude<T, undefined | null>)[] {
  return value.filter(Boolean) as never;
}
export function joinChars(
  characters: (string | number | undefined)[],
  separator: string,
): string {
  return (characters.filter((v) => !isUndefined(v))).map(
    String,
  )
    .map(cleanCharacter).filter(Boolean)
    .join(separator);
}

export function not<T extends (...args: any[]) => any>(fn: T) {
  return (...args: Parameters<T>): boolean => !fn(...args);
}

export function cleanCharacter(value: string): string {
  return value.trim().replaceAll(/\s+/g, " ");
}

export type Callable<T, U extends (...args: any[]) => T = () => T> = T | U;

export function evaluate<T, U extends (...args: any[]) => T = () => T>(
  callable: Callable<T, U>,
): T {
  return isFunction(callable) ? callable() : callable;
}
