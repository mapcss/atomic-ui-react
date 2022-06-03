// This module is browser compatible.

import { ReactElement, RefAttributes } from "react";
import useAccordionHeader, { Params, Returns } from "./use_accordion_header.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: Returns[0] & RefAttributes<any>,
    contexts: Returns[1],
  ) => ReactElement;
} & Params;

export default function WithAccordionHeader(
  {
    children,
    id,
    index,
    openIndex,
    setOpenIndex,
    panelId,
  }: Readonly<Props>,
): JSX.Element {
  const [attributes, contexts] = useAccordionHeader({
    id,
    index,
    openIndex,
    setOpenIndex,
    panelId,
  });

  return children({ ...attributes }, contexts);
}
