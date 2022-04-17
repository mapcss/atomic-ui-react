// This module is browser compatible.

export {
  isBoolean,
  isFunction,
  isLength0,
  isNil,
  isNumber,
  isObject,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
import { isUndefined } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export type VFn = () => void;
export const isBrowser = !("Deno" in globalThis);

// deno-lint-ignore no-explicit-any
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

// deno-lint-ignore no-explicit-any
export function not<T extends (...args: any[]) => any>(fn: T) {
  return (...args: Parameters<T>): boolean => !fn(...args);
}

export function cleanCharacter(value: string): string {
  return value.trim().replaceAll(/\s+/g, " ");
}
