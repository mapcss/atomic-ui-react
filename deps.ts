// This module is browser compatible.

export { isFunction } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export type VFn = () => void;
export const isBrowser = !("Deno" in globalThis);
