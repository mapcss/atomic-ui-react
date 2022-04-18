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
