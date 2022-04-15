// This module is browser compatible.

import { useMemo } from "react";

export type Param = {
  /** Whether or not the switch is checked. */
  checked: boolean;

  /** The function to call when the switch is toggled. */
  onChange: (value: boolean) => void;
};

export type ReturnValue = {
  role: "switch";
  "aria-checked": boolean;
  tabIndex: 0;
  onClick: () => void;
};

export default function useAttribute(
  { checked, onChange }: Param,
): ReturnValue {
  const attribute = useMemo<ReturnValue>(() => {
    return {
      role: "switch" as const,
      "aria-checked": checked,
      tabIndex: 0,
      onClick: () => onChange(!checked),
    };
  }, [checked, onChange]);

  return attribute;
}
