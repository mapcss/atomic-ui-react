// This module is browser compatible.

import { EventHandler, KeyboardEvent, KeyboardEventHandler } from "react";
import { isLength0, isString, not, sortBy } from "../deps.ts";
export type TempIdReturnValue = {
  readonly current: number;
  readonly next: number;
};
export function tempId(initialState = 0): TempIdReturnValue {
  return {
    get current(): number {
      return initialState;
    },
    get next(): number {
      const _id = initialState;
      initialState++;
      return _id;
    },
  };
}
export const DEFAULT_TEMP_ID: TempIdReturnValue = {
  current: 0,
  next: 0,
};

export function getNextIndex(
  currentIndex: number,
  matrix: Readonly<boolean[]>,
): number {
  if (isLength0(matrix) || matrix.every(not(Boolean))) return currentIndex;
  const _next = currentIndex + 1;
  if (matrix[_next]) return _next;
  if (matrix[_next] === false) {
    return getNextIndex(_next, matrix);
  }

  // if overflow from array, check from start.
  return getNextIndex(-1, matrix);
}

export function getPrevIndex(
  currentIndex: number,
  matrix: Readonly<boolean[]>,
): number {
  if (isLength0(matrix) || matrix.every(not(Boolean))) return currentIndex;
  const _prev = currentIndex - 1;
  if (matrix[_prev]) return _prev;
  if (matrix[_prev] === false) {
    return getPrevIndex(_prev, matrix);
  }
  return getPrevIndex(matrix.length, matrix);
}

export function getFirstIndex(
  currentIndex: number,
  matrix: Readonly<boolean[]>,
): number {
  const index = matrix.findIndex(Boolean);
  if (index < 0) {
    return currentIndex;
  } else {
    return index;
  }
}

export function getLastIndex(
  currentIndex: number,
  matrix: Readonly<boolean[]>,
): number {
  // findLastIndex is ES2022 feature. so Not used for a while.
  // const index = matrix.findLastIndex(Boolean);
  const index = matrix.reduceRight((acc, cur, i) => {
    if (0 <= acc) return acc;
    return cur ? i : acc;
  }, -1);
  if (index < 0) {
    return currentIndex;
  } else {
    return index;
  }
}

export type KeyEntries = [
  string | Partial<KeyboardEvent<Element>>,
  EventHandler<KeyboardEvent<Element>>,
][];

export function mappingKey(
  keyEntries: KeyEntries,
): KeyboardEventHandler<Element> {
  const callback: KeyboardEventHandler = (ev) => {
    for (const [maybeCode, callback] of sortKeyEntries(keyEntries)) {
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
  };

  return callback;
}

export function sortKeyEntries(keyEntries: Readonly<KeyEntries>): KeyEntries {
  return sortBy(keyEntries, ([key]) => {
    if (isString(key)) {
      return 1;
    }
    return 0;
  });
}
