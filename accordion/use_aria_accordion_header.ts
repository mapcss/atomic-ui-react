// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";

export type Param =
  & Pick<AllHTMLAttributes<Element>, "id">
  & {
    isOpen: boolean;
    panelId?: string;
  };
export type ReturnValue = Pick<
  AllHTMLAttributes<Element>,
  "aria-expanded" | "aria-controls" | "id"
>;
export default function useAriaAccordionHeader(
  { isOpen, id, panelId }: Param,
): ReturnValue {
  return useMemo<ReturnValue>(() => ({
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    id,
  }), [isOpen, panelId, id]);
}
