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

export type TransitionProps = {
  /** Classes during the entire enter phase. */
  [ENTER]: string;

  /** Classes before the enter phase starts. */
  [ENTER_FROM]: string;

  /** Classes immediately after the enter phase starts. */
  [ENTER_TO]: string;

  /** Classes during the entire leave phase. */
  [LEAVE]: string;

  /** Classes before the leave phase starts. */
  [LEAVE_TO]: string;

  /** Classes to immediately after the leave phase starts. */
  [LEAVE_FROM]: string;
};
export type Transition = keyof TransitionProps;
export type TransitionLifecycle =
  | typeof INIT
  | typeof START
  | typeof MIDDLE
  | typeof END;
export type TransitionLifecycleMap = Record<
  TransitionLifecycle,
  Transition[]
>;
export type TransitionStage = 0 | 1 | 2 | 3;
export type TransitionTiming =
  | typeof BEFORE_MOUNT
  | typeof MOUNT
  | typeof COMPLETE
  | typeof AFTER_MOUNT;
