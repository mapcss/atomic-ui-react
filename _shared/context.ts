import { createContext } from "react";
import { Returns as UseBooleanReturns } from "../hooks/use_boolean.ts";
import { TempIdReturnValue } from "./util.ts";

export const IdContext = createContext<string>("");
export const BooleanContext = createContext<UseBooleanReturns | undefined>(
  undefined,
);
export const TempIdContext = createContext<TempIdReturnValue>({
  current: 0,
  next: 0,
});
