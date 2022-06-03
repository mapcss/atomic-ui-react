// This module is browser compatible.

import { ReactElement } from "react";

import useAccordionPanel, { Params, Returns } from "./use_accordion_panel.ts";

export type Props = {
  children: (
    attributes: Returns[0],
    contexts: Returns[1],
  ) => ReactElement;
} & Params;

export default function WithAccordionPanel(
  { children, id, index, openIndex, setOpenIndex, headerId }: Props,
): JSX.Element {
  const [attributes, contexts] = useAccordionPanel({
    id,
    index,
    openIndex,
    setOpenIndex,
    headerId,
  });

  return children(attributes, contexts);
}
