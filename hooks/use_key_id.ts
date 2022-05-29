// This module is browser compatible.

import { useRef } from "react";
import { isNumber } from "../deps.ts";
import useIsFirstMount from "./use_is_first_mount.ts";

export type Store = Record<PropertyKey, number>;

export type Params = {
  /** Id is unique in the key */
  key: string;

  /** Store that references a key. This is subject to destructive change. */
  store: Store;
};

export type Options = {
  /** Incremental step.
   * @default 1
   */
  step: number;

  /** Initial Id.
   * If the store does not have an ID associated with the key, this is the default value.
   * @default 0
   */
  init: number;
};

/** Returns an incremental ID unique in the key.
 * ```tsx
 * import { useKeyId } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   const store = { "atomic-ui": 4 };
 *   const id = useKeyId({ key: "atomic-ui", store }); // 5
 * };
 * ```
 */
export default function useKeyId(
  { key, store }: Readonly<Params>,
  { step = 1, init = 0 }: Readonly<Partial<Options>> = {},
): number {
  const isFirstMount = useIsFirstMount();
  const id = useRef<number>(init);

  if (isFirstMount) {
    const value = store[key];
    const current = isNumber(value) ? value + step : init;
    id.current = current;
    store[key] = current;
  }

  return id.current;
}
