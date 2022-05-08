// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { TAB } from "./constant.ts";

export type Param = {
  /** Whether or not the tab is selected. */
  isSelected: boolean;

  /** Whether or not the tab is disabled. */
  isDisabled: boolean;

  tabId: string;

  tabPanelId: string;
};

export type ReturnValue = Pick<
  AllHTMLAttributes<Element>,
  | "role"
  | "id"
  | "aria-selected"
  | "aria-disabled"
  | "aria-controls"
>;

export default function useTabAria(
  { isSelected, isDisabled, tabId, tabPanelId }: Readonly<Partial<Param>>,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: TAB,
      id: tabId,
      "aria-selected": isSelected ? "true" : "false",
      "aria-disabled": isDisabled ? "true" : "false",
      "aria-controls": tabPanelId,
    };
  }, [isSelected, isDisabled, tabId, , tabPanelId]);

  return aria;
}
