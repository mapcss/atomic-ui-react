// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { PANEL, TAB } from "./constant.ts";

export type Param = {
  tabId: string;
  tabPanelId: string;
};

export type ReturnValue = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-labelledby" | "id"
>;

export default function useTabPanelAttribute(
  { tabId, tabPanelId }: Readonly<Partial<Param>> = {},
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: `${TAB}${PANEL}`,
      id: tabPanelId,
      "aria-labelledby": tabId,
    };
  }, [tabId, tabPanelId]);

  return aria;
}
