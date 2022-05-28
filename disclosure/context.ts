import { createContext } from "react";
import { SharedContexts } from "./types.ts";

export const IdContext = createContext<SharedContexts["id"] | undefined>(
  undefined,
);
export const OpenContext = createContext<
  [SharedContexts["isOpen"], SharedContexts["setIsOpen"]] | undefined
>(
  undefined,
);
