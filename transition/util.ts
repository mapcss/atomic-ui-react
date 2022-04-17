/** Compute transition duration from `CSSStyleDeclaration` */
export function getDuration(el: Element): number {
  try {
    const { transitionDuration } = globalThis.getComputedStyle(el);

    const num = Number.parseFloat(transitionDuration);
    if (!Number.isFinite(num)) return 0;

    return num * 1000;
  } catch {
    return 0;
  }
}
