// This module is browser compatible.

import { createContext } from "react";
import { ReturnValue } from "./use_disclosure.ts";

const Context = createContext<ReturnValue | undefined>(undefined);
export default Context;
