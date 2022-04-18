import { useMemo } from "react";

export type Param = {
  /** Whether or not the tab is selected. */
  isSelected: boolean;

  /** Whether or not the tab is disabled. */
  isDisabled: boolean;

  tabPanelId: string;
};

export type ReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-selected" | "tabIndex" | "aria-controls" | "aria-disabled"
>;
export default function useTabAria(
  { isSelected, isDisabled, tabPanelId }: Readonly<Partial<Param>>,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: "tab",
      "aria-selected": isSelected ? "true" : "false",
      "aria-disabled": isDisabled ? "true" : "false",
      "aria-controls": tabPanelId,
    };
  }, [isSelected, isDisabled, tabPanelId]);

  return aria;
}
