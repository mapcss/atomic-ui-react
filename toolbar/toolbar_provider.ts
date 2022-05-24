// This module is browser compatible.

import { createElement, ReactNode } from "react";
import { ActiveElementContext, RefsContext } from "./context.ts";
import useActiveElement from "../hooks/use_active_element.ts";

export type Props = {
  children: ReactNode;
};

export default function ToolbarProvider({ children }: Props): JSX.Element {
  const [activeElement, setActiveElement] = useActiveElement();

  return createElement(
    RefsContext.Provider,
    { value: [] },
    createElement(
      ActiveElementContext.Provider,
      { value: [activeElement, setActiveElement] },
      children,
    ),
  );
}
