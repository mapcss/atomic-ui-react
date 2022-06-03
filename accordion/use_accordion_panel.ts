// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import {
  AllAttributesWith,
  useAttributesWith,
  UseIdReturns,
} from "../hooks/mod.ts";
import { OpenIndexProps } from "./types.ts";

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Params =
  & {
    headerId: string | undefined;
  }
  & OpenIndexProps
  & UseIdReturns;

export type Contexts = Params & {
  isOpen: boolean;
};

export type Returns = [AllHTMLAttributes<Element>, Contexts];
export default function useAccordionPanel(
  { id, index, openIndex, setOpenIndex, headerId }: Readonly<Params>,
): Returns {
  const isOpen = useMemo<boolean>(() => index === openIndex, [
    index,
    openIndex,
  ]);
  const contexts = useMemo<Contexts>(() => ({
    id,
    index,
    openIndex,
    setOpenIndex,
    headerId,
    isOpen,
  }), [
    id,
    index,
    openIndex,
    setOpenIndex,
    headerId,
    isOpen,
  ]);

  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
  });

  return [attributes, contexts];
}

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  "aria-labelledby": ({ headerId }) => headerId!,
  id: ({ id }) => id,
  hidden: ({ isOpen }) => !isOpen,
};
