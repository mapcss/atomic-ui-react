// This module is browser compatible.
import { KeyboardEventHandler, useCallback } from "react";
import { isString } from "../deps.ts";
import { EventHandler, KeyboardEvent } from "react";

export type Param = Iterable<[
  string | Partial<KeyboardEvent<Element>>,
  EventHandler<KeyboardEvent<Element>>,
]>;
export type Option = {
  beforeAll: EventHandler<KeyboardEvent<Element>>;

  afterAll: EventHandler<KeyboardEvent<Element>>;
};

export type ReturnValue = KeyboardEventHandler<Element>;

/** Hooks for mapping keyboard event and callback */
export default function useKeyboardEventHandler(
  keyEntries: Readonly<Param>,
  option: Readonly<Partial<Option>> = {},
): ReturnValue {
  const callback = useCallback<ReturnValue>(
    mappingKey(keyEntries, option),
    [JSON.stringify(keyEntries), option.beforeAll, option.afterAll],
  );

  return callback;
}

export function mappingKey(
  keyEntries: Readonly<Param>,
  { beforeAll, afterAll }: Readonly<Partial<Option>> = {},
): KeyboardEventHandler<Element> {
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
        return ev[key as keyof KeyboardEvent] === value;
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
