import { createContext } from "react";
import { ReturnValue as UseBooleanReturnValue } from "../hooks/use_boolean.ts";

export const IdContext = createContext<string>("");
export const BooleanContext = createContext<UseBooleanReturnValue | undefined>(
  undefined,
);
