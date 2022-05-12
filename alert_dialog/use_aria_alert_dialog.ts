// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";

export type Param = {
  titleId?: string;

  describeId?: string;
};
export type ReturnValue = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-modal" | "aria-labelledby" | "aria-describedby"
>;

export default function useAriaAlertDialog(
  { titleId, describeId }: Param,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => ({
    role: "alertdialog",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    "aria-describedby": describeId,
  }), [titleId, describeId]);

  return aria;
}
