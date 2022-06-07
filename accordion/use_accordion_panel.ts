// This module is browser compatible.

import { AllHTMLAttributes } from "react";
import {
  AllAttributesWith,
  useAttributesWith,
  UseIdReturns,
} from "../hooks/mod.ts";
import { OpenIndexProps } from "./types.ts";

export type AttributesWithContexts = AllAttributesWith<[ContextsWithDynamic]>;

export type Params =
  & {
    headerId: string | undefined;
  }
  & OpenIndexProps
  & UseIdReturns;

export type ContextsWithDynamic = Params & {
  isOpen: boolean;
};

export default function useAccordionPanel(
  contexts: Readonly<ContextsWithDynamic>,
  allAttributes: Partial<AttributesWithContexts> = {},
): AllHTMLAttributes<Element> {
  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return attributes;
}

const defaultAttributes: Partial<AttributesWithContexts> = {
  "aria-labelledby": ({ headerId }) => headerId!,
  id: ({ id }) => id,
  hidden: ({ isOpen }) => !isOpen,
};
