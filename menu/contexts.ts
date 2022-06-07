import { createContext } from "react";
import { CommonContexts } from "./types.ts";

export const CommonContextsContext = createContext<CommonContexts | undefined>(
  undefined,
);

export const GroupIdContext = createContext<string | undefined>(undefined);
