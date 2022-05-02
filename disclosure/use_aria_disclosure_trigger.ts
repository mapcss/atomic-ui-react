import { AriaAttributes, useMemo } from "react";
import { StateMap } from "./use_disclosure.ts";

export type ReturnValue = Pick<
  AriaAttributes,
  "aria-controls" | "aria-expanded"
>;

export default function useAria(
  { id, isOpen }: Readonly<Partial<StateMap>>,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      "aria-controls": id,
      "aria-expanded": isOpen,
    };
  }, [id, isOpen]);

  return aria;
}
