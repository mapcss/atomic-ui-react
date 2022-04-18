import { TransitionLifecycleMap } from "./types.ts";

export const BEFORE_MOUNT = "beforeMount";
export const MOUNT = "mount";
export const AFTER_MOUNT = "afterMount";
export const COMPLETE = "complete";

const FROM = "From";
const TO = "To";
export const ENTER = "enter";
export const ENTER_FROM = `${ENTER}${FROM}` as const;
export const ENTER_TO = `${ENTER}${TO}` as const;
export const LEAVE = "leave";
export const LEAVE_FROM = `${LEAVE}${FROM}` as const;
export const LEAVE_TO = `${LEAVE}${TO}` as const;
export const INIT = "init";
export const START = "start";
export const MIDDLE = "middle";
export const END = "end";

export const TRANSITION_TIMING_MAP = {
  0: BEFORE_MOUNT,
  1: MOUNT,
  2: AFTER_MOUNT,
  3: COMPLETE,
} as const;

export const ENTER_TRANSITION_MAP: TransitionLifecycleMap = {
  [INIT]: [ENTER_FROM],
  [START]: [ENTER_FROM, ENTER],
  [MIDDLE]: [ENTER, ENTER_TO],
  [END]: [],
};

export const LEAVE_TRANSITION_MAP: TransitionLifecycleMap = {
  [INIT]: [LEAVE_FROM],
  [START]: [LEAVE_FROM, LEAVE],
  [MIDDLE]: [LEAVE, LEAVE_TO],
  [END]: [],
};
