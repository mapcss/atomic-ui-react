// This module is browser compatible.

import { useMemo } from "react";

export type Param = {
  tabId: string;
};

export type ReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-labelledby"
>;

export default function useTabPanelAttribute(
  { tabId }: Readonly<Partial<Param>> = {},
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: "tabpanel",
      "aria-labelledby": tabId,
    };
  }, [tabId]);

  return aria;
}
