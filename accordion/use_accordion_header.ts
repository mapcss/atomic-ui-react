// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent } from "react";
import { OpenIndexProps } from "./types.ts";
import {
  AllAttributesWith,
  useAttributesWith,
  UseIdReturns,
} from "../hooks/mod.ts";
import { mappingKey } from "../util.ts";

export type Params =
  & {
    panelId: string | undefined;
  }
  & OpenIndexProps
  & UseIdReturns;

export type ContextsWithDynamic = {
  /** Whether open or not. */
  isOpen: boolean;
} & Params;

export type AttributesWithContexts = AllAttributesWith<
  [ContextsWithDynamic]
>;

export default function useAccordionHeader(
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
  "aria-expanded": ({ isOpen }) => isOpen,
  "aria-controls": ({ panelId }) => panelId!,
  id: ({ id }) => id,
  tabIndex: 0,
  onClick: (_, { setOpenIndex, index }) => {
    setOpenIndex(index);
  },
  onKeyDown: (ev, { setOpenIndex, index }) => {
    const open = (): void => {
      ev.preventDefault();
      setOpenIndex(index);
    };
    const runner = mappingKey<KeyboardEvent>([
      ["Space", open],
      ["Enter", open],
    ]);

    runner(ev);
  },
};
