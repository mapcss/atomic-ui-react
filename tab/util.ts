export function getNextIndex(currentIndex: number, sumCount: number): number {
  const _next = currentIndex + 1;

  if (_next < sumCount) {
    return _next;
  }
  return 0;
}

export function getPrevIndex(currentIndex: number, sumCount: number): number {
  const _prev = currentIndex - 1;
  if (0 <= _prev) {
    return _prev;
  }
  return sumCount - 1;
}

export function getFirstIndex(): number {
  return 0;
}

export function getLastIndex(_: number, sumCount: number): number {
  return sumCount - 1;
}
