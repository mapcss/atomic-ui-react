// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
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

export type Contexts = { isOpen: boolean } & Params;

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "aria-expanded" | "aria-controls" | "id" | "tabIndex"
>;

export type Returns = [Attributes, Contexts];

export default function useAccordionHeader(
  { openIndex, setOpenIndex, id, index, panelId }: Readonly<Params>,
): Returns {
  const isOpen = useMemo<boolean>(() => index === openIndex, [
    index,
    openIndex,
  ]);
  const contexts = useMemo<Contexts>(
    () => ({
      openIndex,
      setOpenIndex,
      id,
      index,
      panelId,
      isOpen,
    }),
    [
      openIndex,
      setOpenIndex,
      id,
      index,
      panelId,
      isOpen,
    ],
  );

  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
  });

  return [attributes, contexts];
}

const defaultAttributes: Partial<AllAttributesWithContexts> = {
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
