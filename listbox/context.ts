import { createContext } from "react";
import { CommonContexts } from "./types.ts";

export const IdContext = createContext<string | undefined>(undefined);
export const CommonContextsContext = createContext<CommonContexts | undefined>(
  undefined,
);
