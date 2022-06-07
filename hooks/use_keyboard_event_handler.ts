// This module is browser compatible.

import { useMemo } from "react";
import { isString } from "../deps.ts";
import { KeyEntries } from "../util.ts";
import { KeyboardEventHandler } from "../types.ts";

export type KeyOrCodeOrKeyboardEvent = string | Partial<KeyboardEvent>;

export type Option = {
  beforeAll: KeyboardEventHandler;

  afterAll: KeyboardEventHandler;
};

/** Hooks for mapping keyboard event and callback */
export default function useKeyboardEventHandler(
  keyEntries: Readonly<KeyEntries>,
  option: Readonly<Partial<Option>> = {},
): KeyboardEventHandler {
  const callback = useMemo<KeyboardEventHandler>(
    () => mappingKey(keyEntries, option),
    [
      ...Array.from(keyEntries).flat(1),
      option.afterAll,
      option.beforeAll,
    ],
  );

  return callback;
}

export function mappingKey(
  keyEntries: Readonly<KeyEntries>,
  { beforeAll, afterAll }: Readonly<Partial<Option>> = {},
): KeyboardEventHandler {
  let beforeAllDone = false;

  const callback: KeyboardEventHandler = (ev) => {
    function callBeforeAll(): void {
      if (!beforeAllDone) {
        beforeAllDone = true;
        beforeAll?.(ev);
      }
    }
    for (const [maybeCode, callback] of keyEntries) {
      if (isString(maybeCode)) {
        if ([ev.code, ev.key].includes(maybeCode)) {
          callBeforeAll();
          callback(ev);
          break;
        }
        continue;
      }

      const match = Object.entries(maybeCode).every(([key, value]) => {
        return ev[key as keyof globalThis.KeyboardEvent] === value;
      });
      if (match) {
        callBeforeAll();
        callback(ev);
        break;
      }
    }

    afterAll?.(ev);
  };

  return callback;
}
