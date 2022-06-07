// This module is browser compatible.

import { AllHTMLAttributes, ReactElement, RefAttributes, useMemo } from "react";
import useAccordionHeader, {
  AttributesWithContexts,
  ContextsWithDynamic,
  Params,
} from "./use_accordion_header.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: AllHTMLAttributes<Element> & RefAttributes<any>,
    contexts: ContextsWithDynamic,
  ) => ReactElement;

  contexts: Params;
} & Partial<AttributesWithContexts>;

export default function WithAccordionHeader(
  {
    children,
    contexts: { openIndex, index, panelId, setOpenIndex, id },
    ...allAttributes
  }: Readonly<Props>,
): JSX.Element {
  const isOpen = useMemo<boolean>(() => index === openIndex, [
    index,
    openIndex,
  ]);

  const contextsWithDynamic = useMemo<ContextsWithDynamic>(
    () => ({ isOpen, openIndex, index, panelId, setOpenIndex, id }),
    [isOpen, openIndex, index, panelId, setOpenIndex, id],
  );

  const attributes = useAccordionHeader(contextsWithDynamic, allAttributes);

  return children(attributes, contextsWithDynamic);
}
