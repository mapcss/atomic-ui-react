// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";

export type Param =
  & Pick<AllHTMLAttributes<Element>, "id">
  & {
    headerId?: string;
  };
export type ReturnValue = Pick<
  AllHTMLAttributes<Element>,
  "aria-labelledby" | "id"
>;
export default function useAriaAccordionPanel(
  { id, headerId }: Param,
): ReturnValue {
  return useMemo<ReturnValue>(() => ({
    "aria-labelledby": headerId,
    id,
  }), [id, headerId]);
}
