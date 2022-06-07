// This module is browser compatible.

import { createContext, MutableRefObject } from "react";
import { defaultStore } from "./constant.ts";
import { Store } from "../hooks/use_key_id.ts";

const Context = createContext<MutableRefObject<Store>>(defaultStore);
export default Context;
