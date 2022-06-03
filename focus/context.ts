import { createContext } from "react";
import { FocusStrategy } from "./types.ts";
import RovingTabIndex from "./roving_tabindex.ts";

const Context = createContext<FocusStrategy>(RovingTabIndex);

export default Context;
