// This module is browser compatible.

import { createElement, ReactNode } from "react";
import { useId, useStateSet } from "../hooks/mod.ts";
import { CommonContextsContext, IdContext, RefsContext } from "./context.ts";
import { StateSet } from "../types.ts";
import { Exclusive } from "../util.ts";

export type Props =
  & {
    children: ReactNode;
  }
  & Exclusive<{ openIndexSet: StateSet<number> }, {
    /** Initial open index.
     * @default 0
     */
    initialOpenIndex: number;
  }>;

export default function AccordionProvider(
  {
    children,
    initialOpenIndex = 0,
    openIndexSet,
  }: Readonly<Props>,
): JSX.Element {
  const { id } = useId();

  const [openIndex, setOpenIndex] = useStateSet<number>(
    initialOpenIndex,
    openIndexSet,
  );

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(
      CommonContextsContext.Provider,
      { value: { openIndex, setOpenIndex } },
      createElement(RefsContext.Provider, { value: [] }, children),
    ),
  );
}
