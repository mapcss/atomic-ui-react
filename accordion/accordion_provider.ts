// This module is browser compatible.

import { createElement, ReactNode } from "react";
import useId from "../hooks/use_id.ts";
import { CommonContextsContext, IdContext, RefsContext } from "./context.ts";
import { OpenIndexProps } from "./types.ts";
import { Exclusive } from "../util.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";

export type Props =
  & {
    children: ReactNode;
  }
  & Exclusive<OpenIndexProps, {
    /** Initial open index.
     * @default 0
     */
    initialOpenIndex?: number;
  }>;

export default function AccordionProvider(
  {
    children,
    initialOpenIndex = 0,
    setOpenIndex: _setOpenIndex,
    openIndex: _openIndex,
  }: Readonly<Props>,
): JSX.Element {
  const { id } = useId();

  const [openIndex, setOpenIndex] = useExclusiveState({
    initialState: initialOpenIndex,
    state: _openIndex,
    setState: _setOpenIndex,
  });

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
