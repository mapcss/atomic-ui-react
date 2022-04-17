// This module is browser compatible.

import { useMemo } from "react";

export type Param = {
  /** Whether or not the switch is checked. */
  isChecked: boolean;
};

export type ReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-checked"
>;

export default function useSwitchAria(
  { isChecked }: Readonly<Partial<Param>>,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: "switch" as const,
      "aria-checked": isChecked,
    };
  }, [isChecked]);

  return aria;
}
