// This module is browser compatible.

export function calcTabIndex(
  { isActive, hasActivated, isFirst }: {
    isActive: boolean;
    hasActivated: boolean;
    isFirst: boolean;
  },
): number {
  if (isActive || (!hasActivated && isFirst)) return 0;
  return -1;
}
