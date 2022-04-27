// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

export {
  isBoolean,
  isFunction,
  isLength0,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
import { isNil } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export { distinct } from "https://deno.land/std@0.136.0/collections/distinct.ts";
export { mapValues } from "https://deno.land/std@0.136.0/collections/map_values.ts";
export type VFn = () => void;
export type ValueOf<T> = T[keyof T];

export function wrap<T>(val: T): T extends any[] ? T : T[] {
  return Array.isArray(val) ? val as never : [val] as never;
}

export function filterTruthy<T>(value: T[]): (Exclude<T, undefined | null>)[] {
  return value.filter(Boolean) as never;
}
export function joinChars(
  characters: (string | number | undefined | null)[],
  separator: string,
): string {
  return (characters.filter((v) => !isNil(v))).map(
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
