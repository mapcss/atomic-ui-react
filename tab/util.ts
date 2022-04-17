import { isLength0, not } from "../deps.ts";

export function getNextIndex(currentIndex: number, matrix: boolean[]): number {
  if (isLength0(matrix) || matrix.every(not(Boolean))) return currentIndex;
  const _next = currentIndex + 1;
  if (matrix[_next]) return _next;
  if (matrix[_next] === false) {
    return getNextIndex(_next, matrix);
  }

  // if overflow from array, check from start.
  return getNextIndex(-1, matrix);
}

export function getPrevIndex(currentIndex: number, matrix: boolean[]): number {
  if (isLength0(matrix) || matrix.every(not(Boolean))) return currentIndex;
  const _prev = currentIndex - 1;
  if (matrix[_prev]) return _prev;
  if (matrix[_prev] === false) {
    return getPrevIndex(_prev, matrix);
  }
  return getPrevIndex(matrix.length, matrix);
}

export function getFirstIndex(): number {
  return 0;
}

export function getLastIndex(_: number, sumCount: number): number {
  return sumCount - 1;
}
