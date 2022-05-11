import { HTMLAttributes, useMemo } from "react";
import { StateMap } from "./types.ts";

export type ReturnValue = Pick<
  HTMLAttributes<Element>,
  "aria-controls" | "aria-expanded" | "role"
>;

export default function useAria(
  { id, isOpen }: Readonly<Partial<StateMap>>,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      "aria-controls": id,
      "aria-expanded": isOpen,
      role: "button",
    };
  }, [id, isOpen]);

  return aria;
}
