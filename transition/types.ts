// This module is browser compatible.

import {
  AFTER_MOUNT,
  BEFORE_MOUNT,
  COMPLETE,
  END,
  ENTER,
  ENTER_FROM,
  ENTER_TO,
  INIT,
  LEAVE,
  LEAVE_FROM,
  LEAVE_TO,
  MIDDLE,
  MOUNT,
  START,
} from "./constant.ts";
export type Transition =
  | typeof ENTER
  | typeof ENTER_FROM
  | typeof ENTER_TO
  | typeof LEAVE
  | typeof LEAVE_TO
  | typeof LEAVE_FROM;
export type TransitionLifecycle =
  | typeof INIT
  | typeof START
  | typeof MIDDLE
  | typeof END;
export type TransitionLifecycleMap = Record<TransitionLifecycle, Transition[]>;
export type TransitionStage = 0 | 1 | 2 | 3;
export type TransitionTiming =
  | typeof BEFORE_MOUNT
  | typeof MOUNT
  | typeof COMPLETE
  | typeof AFTER_MOUNT;
