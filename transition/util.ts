// This module is browser compatible.

import {
  END,
  ENTER,
  ENTER_FROM,
  ENTER_TO,
  ENTERED,
  INIT,
  LEAVE,
  LEAVE_FROM,
  LEAVE_TO,
  LEAVED,
  START,
  WAIT,
} from "./constant.ts";
import { ReturnValue } from "./use_transition.ts";
import { TransitionLifecycleMap } from "./use_transition_lifecycle.ts";

const ENTER_TRANSITION_MAP: TransitionLifecycleMap = {
  [INIT]: [ENTER_FROM],
  [START]: [ENTER_FROM, ENTER],
  [WAIT]: [ENTER, ENTER_TO],
  [END]: [ENTERED],
};

const LEAVE_TRANSITION_MAP: TransitionLifecycleMap = {
  [INIT]: [LEAVE_FROM],
  [START]: [LEAVE_FROM, LEAVE],
  [WAIT]: [LEAVE, LEAVE_TO],
  [END]: [LEAVED],
};

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

/** It takes two `boolean` values and determines if it can be rendered to the DOM.
 * This can be used to determine rendering of components with transitions applied.
 * @param isShow - Whether visible or not.
 * @param isCompleted - Whether the transition is completed or not.
 *
 * ```ts
 * import { isShowable } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * isShowable(true, {isActivated: false, isCompleted: false })
 * ```
 */
export function isShowable(
  isShow: boolean,
  { isActivated, isCompleted }: Pick<
    ReturnValue,
    "isActivated" | "isCompleted"
  >,
): boolean {
  if (!isActivated) return isShow;
  return isShow || !isCompleted;
}
