// This module is browser compatible.

import {
  ENTER,
  ENTER_FROM,
  ENTER_TO,
  ENTERED,
  LEAVE,
  LEAVE_FROM,
  LEAVE_TO,
  LEAVED,
} from "./constant.ts";

export type Transitions = {
  /** Classes during the entire enter phase. */
  [ENTER]: string;

  /** Classes before the enter phase starts. */
  [ENTER_FROM]: string;

  /** Classes immediately after the enter phase starts. */
  [ENTER_TO]: string;

  /** Classes the enter phase is ended. */
  [ENTERED]: string;

  /** Classes during the entire leave phase. */
  [LEAVE]: string;

  /** Classes before the leave phase starts. */
  [LEAVE_TO]: string;

  /** Classes to immediately after the leave phase starts. */
  [LEAVE_FROM]: string;

  /** Classes the leave phase is ended. */
  [LEAVED]: string;
};
export type TransitionName = keyof Transitions;
