// This module is browser compatible.

import { AllHTMLAttributes, ReactElement, useMemo } from "react";

import useAccordionPanel, {
  AttributesWithContexts,
  ContextsWithDynamic,
  Params,
} from "./use_accordion_panel.ts";

export type Props = {
  children: (
    attributes: AllHTMLAttributes<Element>,
    contexts: ContextsWithDynamic,
  ) => ReactElement;
  contexts: Params;
} & Partial<AttributesWithContexts>;

export default function WithAccordionPanel(
  { children, contexts: { index, openIndex, ...rest }, ...allAttributes }:
    Props,
): JSX.Element {
  const isOpen = useMemo<boolean>(() => index === openIndex, [
    index,
    openIndex,
  ]);

  const contextsWithDynamic = useMemo<ContextsWithDynamic>(
    () => ({ isOpen, index, openIndex, ...rest }),
    [isOpen, index, openIndex, rest],
  );

  const attributes = useAccordionPanel(
    contextsWithDynamic,
    allAttributes,
  );

  return children(attributes, contextsWithDynamic);
}
