// This module is browser compatible.

export function isAriaDisabled(el: Element | undefined | null): boolean {
  return el?.ariaDisabled === "true";
}
