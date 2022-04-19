// This module is browser compatible.

import {
  AFTER_MOUNT,
  BEFORE_MOUNT,
  ENTER_TRANSITION_MAP,
  LEAVE_TRANSITION_MAP,
  MOUNT,
} from "./constant.ts";
import {
  Transition,
  TransitionLifecycleMap,
  TransitionTiming,
} from "./types.ts";

/** Compute transition duration from `CSSStyleDeclaration` */
export function getDuration(el: Element): number {
  try {
    const { transitionDuration, transitionDelay } = globalThis.getComputedStyle(
      el,
    );

    const duration = parseFiniteFloat(transitionDuration);

    if (!duration) {
      return 0;
    }

    const delay = parseFiniteFloat(transitionDelay) ?? 0;
    const extension = 1000 * (duration + delay);

    return Number.isFinite(extension) ? extension : 0;
  } catch {
    return 0;
  }
}

function parseFiniteFloat(value: string): number | undefined {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : undefined;
}

export function getTransitionMap(isEnter: boolean): TransitionLifecycleMap {
  return isEnter ? ENTER_TRANSITION_MAP : LEAVE_TRANSITION_MAP;
}

export function mapTiming2TransitionLifecycle(
  transitionTiming: TransitionTiming,
  { init, start, middle, end }: TransitionLifecycleMap,
): Transition[] {
  switch (transitionTiming) {
    case BEFORE_MOUNT: {
      return init;
    }
    case MOUNT: {
      return start;
    }
    case AFTER_MOUNT: {
      return middle;
    }
    default: {
      return end;
    }
  }
}

/** It takes two `boolean` values and determines if it can be rendered to the DOM.
 * This can be used to determine rendering of components with transitions applied.
 * @param isShow - Whether visible or not.
 * @param isCompleted - Whether the transition is completed or not.
 *
 * ```ts
 * import { isShowable } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * isShowable(true, true) // true
 * isShowable(true, false) // true
 * isShowable(false, true) // false
 * isShowable(false, false) // true
 * ```
 */
export function isShowable(isShow: boolean, isCompleted: boolean): boolean {
  return isShow || !isCompleted;
}
