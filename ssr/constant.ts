// This module is browser compatible.

import { _ContextValue } from "./types.ts";
export const _DEFAULT_CONTEXT: _ContextValue = {
  prefix: String(Math.round(Math.random() * 10000000000)),
  current: -1,
};
