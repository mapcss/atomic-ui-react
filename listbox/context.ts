import {
  createContext,
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
} from "react";
import { Memorized } from "./types.ts";

export const RefsRefContext = createContext<
  | MutableRefObject<RefObject<HTMLElement | SVGElement | MathMLElement>[]>
  | undefined
>(undefined);
export const SelectedIndexContext = createContext<
  [number | undefined, Dispatch<SetStateAction<number | undefined>>] | undefined
>(undefined);
export const ActivatedIndexContext = createContext<
  [number | undefined, Dispatch<SetStateAction<number | undefined>>] | undefined
>(undefined);

export const MemorizedContext = createContext<Memorized | undefined>(
  undefined,
);

export const IdContext = createContext<string | undefined>(undefined);
