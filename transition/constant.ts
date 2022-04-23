// This module is browser compatible.

const FROM = "From";
const TO = "To";
export const ENTER = "enter";
export const ENTER_FROM = `${ENTER}${FROM}` as const;
export const ENTER_TO = `${ENTER}${TO}` as const;
export const ENTERED = `${ENTER}ed` as const;
export const LEAVE = "leave";
export const LEAVE_FROM = `${LEAVE}${FROM}` as const;
export const LEAVE_TO = `${LEAVE}${TO}` as const;
export const LEAVED = `${LEAVE}d` as const;
export const INIT = "init";
export const START = "start";
export const WAIT = "wait";
export const END = "end";
