// This module is browser compatible.

import { cloneElement, ReactElement, useContext, useMemo } from "react";
import { IdContext, IndexContext, PanelCountContext } from "./context.ts";
import { joinChars } from "../util.ts";
import useAriaAccordionPanel from "./use_aria_accordion_panel.ts";

export type Props = {
  children: ReactElement;
};
export default function WithAccordionPanel({ children }: Props): JSX.Element {
  const id = useContext(IdContext);
  const { next: index } = useContext(
    PanelCountContext,
  );
  const [currentIndex] = useContext(IndexContext);

  const isOpen = useMemo<boolean>(() => index === currentIndex, [
    index,
    currentIndex,
  ]);

  const headerId = joinChars([id, "accordion", "header", index], "-");
  const panelId = joinChars([id, "accordion", "panel", index], "-");

  const aria = useAriaAccordionPanel({ id: panelId, headerId });

  return cloneElement(children, { ...aria, hidden: !isOpen });
}
