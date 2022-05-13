// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { joinChars } from "../util.ts";
import useAriaAccordionHeader, {
  ReturnValue as UseAriaAccordionHeaderReturnValue,
} from "./use_aria_accordion_header.ts";

export type Attributes =
  & UseAriaAccordionHeaderReturnValue
  & Pick<AllHTMLAttributes<Element>, "tabIndex">;

export type Param = {
  id: string;
  index: number;
  isOpen: boolean;
};

export default function useAttributesAccordionHeader(
  { id, index, isOpen }: Readonly<Param>,
): Attributes {
  const headerId = joinChars([id, "accordion", "header", index], "-");
  const panelId = joinChars([id, "accordion", "panel", index], "-");
  const aria = useAriaAccordionHeader({ id: headerId, panelId, isOpen });

  return useMemo<Attributes>(() => ({
    ...aria,
    tabIndex: 0,
  }), [JSON.stringify(aria)]);
}
