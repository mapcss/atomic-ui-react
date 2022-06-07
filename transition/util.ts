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
import { TransitionsLifecycle } from "./use_transition_lifecycle.ts";

const ENTER_TRANSITION_MAP: TransitionsLifecycle = {
  [INIT]: [ENTER_FROM],
  [START]: [ENTER_FROM, ENTER],
  [WAIT]: [ENTER, ENTER_TO],
  [END]: [ENTERED],
};

const LEAVE_TRANSITION_MAP: TransitionsLifecycle = {
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

export function getTransitionMap(isEnter: boolean): TransitionsLifecycle {
  return isEnter ? ENTER_TRANSITION_MAP : LEAVE_TRANSITION_MAP;
}
