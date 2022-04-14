import { useMemo, useState } from "react";

export type InitialState = boolean | (() => boolean);

export type ReturnValue = [boolean, {
  on: () => void;
  off: () => void;
  toggle: () => void;
}];

/** Manage boolean (on - off) states */
export default function useBoolean(
  initialState: InitialState = false,
): ReturnValue {
  const [state, setState] = useState(initialState);
  const callbacks = useMemo(
    () => ({
      on: () => setState(true),
      off: () => setState(false),
      toggle: () => setState((prev) => !prev),
    }),
    [],
  );
  return [state, callbacks];
}
