import { createContext } from "react";
import { ReturnValue as UseBooleanReturnValue } from "../hooks/use_boolean.ts";
import { TempIdReturnValue } from "./util.ts";

export const IdContext = createContext<string>("");
export const BooleanContext = createContext<UseBooleanReturnValue | undefined>(
  undefined,
);
export const TempIdContext = createContext<TempIdReturnValue>({
  current: 0,
  next: 0,
});
