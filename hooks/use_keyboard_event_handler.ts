// This module is browser compatible.
import { useCallback } from "react";
import { isString } from "../deps.ts";

export type Param = Iterable<[
  string | Partial<KeyboardEvent>,
  ReturnValue,
]>;
export type Option = {
  beforeAll: ReturnValue;

  afterAll: ReturnValue;
};

export type ReturnValue = (ev: KeyboardEvent) => void;

/** Hooks for mapping keyboard event and callback */
export default function useKeyboardEventHandler(
  keyEntries: Readonly<Param>,
  option: Readonly<Partial<Option>> = {},
): (ev: KeyboardEvent) => void {
  const callback = useCallback<(ev: KeyboardEvent) => void>(
    mappingKey(keyEntries, option),
    [JSON.stringify(keyEntries), option.beforeAll, option.afterAll],
  );

  return callback;
}

export function mappingKey(
  keyEntries: Readonly<Param>,
  { beforeAll, afterAll }: Readonly<Partial<Option>> = {},
): ReturnValue {
  const callback = (ev: KeyboardEvent) => {
    beforeAll?.(ev);

    for (const [maybeCode, callback] of keyEntries) {
      if (isString(maybeCode)) {
        if (ev.code === maybeCode || ev.key === maybeCode) {
          callback(ev);
          break;
        }
        continue;
      }

      const match = Object.entries(maybeCode).every(([key, value]) => {
        return ev[key as keyof globalThis.KeyboardEvent] === value;
      });
      if (match) {
        callback(ev);
        break;
      }
    }

    afterAll?.(ev);
  };

  return callback;
}
