// This module is browser compatible.

export {
  isBoolean,
  isFunction,
  isNil,
  isNumber,
  isObject,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export type VFn = () => void;
export const isBrowser = !("Deno" in globalThis);

// deno-lint-ignore no-explicit-any
export function wrap<T>(val: T): T extends any[] ? T : T[] {
  return Array.isArray(val) ? val as never : [val] as never;
}
