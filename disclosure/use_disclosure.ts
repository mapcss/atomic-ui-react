// This module is browser compatible.

import useId from "../hooks/use_id.ts";
import useBoolean, { Param as UseBooleanParam } from "../hooks/use_boolean.ts";

export type Param = UseBooleanParam;

export type StateMap = {
  /** The global unique id for disclosure. */
  id: string;

  /** Whether disclosure is open or not. */
  isOpen: boolean;
};

export type DispatchMap = {
  /** Change `isOpen` state to `true` */
  open: () => void;

  /** Change `isOpen` state to `false` */
  close: () => void;

  /** Toggle `isOpen` state */
  toggle: () => void;
};

export type ReturnValue = [StateMap, DispatchMap];

/** Hooks to manage global unique id and disclosure state */
export default function useDisclosure(
  initialState: Param = false,
): ReturnValue {
  const id = useId();

  const [isOpen, { on: open, off: close, toggle }] = useBoolean(initialState);

  return [{ id, isOpen }, { open, close, toggle }];
}
