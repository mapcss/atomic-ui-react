// This module is browser compatible.

import { createElement, ReactNode, useState } from "react";
import useId from "../hooks/use_id.ts";
import {
  HeaderCountContext,
  IdContext,
  IndexContext,
  PanelCountContext,
  RefsContext,
} from "./context.ts";
import { tempId } from "../_shared/util.ts";

export type Props = {
  children: ReactNode;
};

export default function AccordionProvider({ children }: Props): JSX.Element {
  const stateSet = useState<number>(0);
  const id = useId();
  const headerCount = tempId();
  const panelCount = tempId();

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(
      HeaderCountContext.Provider,
      { value: headerCount },
      createElement(
        PanelCountContext.Provider,
        { value: panelCount },
        createElement(
          IndexContext.Provider,
          { value: stateSet },
          createElement(RefsContext.Provider, { value: [] }, children),
        ),
      ),
    ),
  );
}
