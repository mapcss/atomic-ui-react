import { createContext } from "react";
import { Returns } from "./use_transition.ts";

const noop = () => {};

export type StateSet = [
  Returns | undefined,
  ((value: Returns) => void),
];

export const Context = createContext<StateSet>([undefined, noop]);
export const RootContext = createContext<
  {
    isShow: boolean;
    isRoot: boolean;
  } & Returns | undefined
>(undefined);
