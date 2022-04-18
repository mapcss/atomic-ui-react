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
    const { transitionDuration } = globalThis.getComputedStyle(el);

    const num = Number.parseFloat(transitionDuration);
    if (!Number.isFinite(num)) return 0;

    return num * 1000;
  } catch {
    return 0;
  }
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
