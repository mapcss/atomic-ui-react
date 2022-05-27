// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

export {
  isBoolean,
  isFunction,
  isIterable,
  isLength0,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export { distinct } from "https://deno.land/std@0.136.0/collections/distinct.ts";
export { mapValues } from "https://deno.land/std@0.136.0/collections/map_values.ts";
export { filterKeys } from "https://deno.land/std@0.136.0/collections/filter_keys.ts";
export { filterValues } from "https://deno.land/std@0.136.0/collections/filter_values.ts";
export { associateWith } from "https://deno.land/std@0.138.0/collections/mod.ts";
export type VFn = () => void;
export type ValueOf<T> = T[keyof T];

export function wrap<T>(val: T): T extends any[] ? T : T[] {
  return Array.isArray(val) ? val as never : [val] as never;
}

export function not<T extends (...args: any[]) => any>(fn: T) {
  return (...args: Parameters<T>): boolean => !fn(...args);
}

export function noop(): void {}
