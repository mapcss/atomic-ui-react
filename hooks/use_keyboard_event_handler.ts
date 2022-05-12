// This module is browser compatible.
import { useCallback } from "react";
import { isString } from "../deps.ts";
import { KeyboardEventHandler } from "../types.ts";

export type KeyOrCodeOrKeyboardEvent = string | Partial<KeyboardEvent>;

export type Param = Iterable<[
  KeyOrCodeOrKeyboardEvent,
  KeyboardEventHandler,
]>;
export type Option = {
  beforeAll: KeyboardEventHandler;

  afterAll: KeyboardEventHandler;
};

/** Hooks for mapping keyboard event and callback */
export default function useKeyboardEventHandler(
  keyEntries: Readonly<Param>,
  option: Readonly<Partial<Option>> = {},
): KeyboardEventHandler {
  const callback = useCallback<KeyboardEventHandler>(
    mappingKey(keyEntries, option),
    [JSON.stringify(keyEntries), option.beforeAll, option.afterAll],
  );

  return callback;
}

export function mappingKey(
  keyEntries: Readonly<Param>,
  { beforeAll, afterAll }: Readonly<Partial<Option>> = {},
): KeyboardEventHandler {
  const callback: KeyboardEventHandler = (ev) => {
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
