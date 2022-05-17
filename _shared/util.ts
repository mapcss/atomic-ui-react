// This module is browser compatible.

import { isLength0, not } from "../deps.ts";
import { HasFocusElement } from "./types.ts";
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

const selector =
  'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

export function filterFocusable(
  root: ParentNode | null | undefined,
): HasFocusElement[] {
  if (!root) return [];
  const els = [...root.querySelectorAll(selector)];

  return els.filter(hasNotInvalidAttribute).filter(hasFocusElement);
}

function hasFocusElement(el: Element): el is HasFocusElement {
  return el instanceof HTMLElement || el instanceof SVGElement ||
    el instanceof MathMLElement;
}

function hasNotInvalidAttribute(el: Element): boolean {
  return !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden");
}
