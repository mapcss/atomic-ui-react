import { createContext } from "react";
import { ReturnValue } from "./use_transition.ts";

const noop = () => {};

export type StateSet = [
  ReturnValue | undefined,
  ((value: ReturnValue) => void),
];

export const Context = createContext<StateSet>([undefined, noop]);
export const RootContext = createContext<
  {
    isShow: boolean;
    isRoot: boolean;
  } & ReturnValue | undefined
>(undefined);
