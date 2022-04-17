// This module is browser compatible.

import { createContext } from "react";
import { _DEFAULT_CONTEXT } from "./constant.ts";
import { _ContextValue } from "./types.ts";

const _Context = createContext<_ContextValue>(_DEFAULT_CONTEXT);
export default _Context;
