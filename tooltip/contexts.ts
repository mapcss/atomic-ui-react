import { IsShowProps } from "./types.ts";
import { createContext } from "react";

export const IsShowContexts = createContext<IsShowProps | undefined>(undefined);
