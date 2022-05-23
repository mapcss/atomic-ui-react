// This module is browser compatible.

import { cloneElement, ReactElement, useContext } from "react";
import { isFunction } from "../deps.ts";
import {
  DisabledIdsContext,
  IdContext,
  IndexContext,
  TabPanelCountContext,
} from "./context.ts";
import { ERROR_MSG } from "./constant.ts";
import useTabPanel, { Attributes, Contexts } from "./use_tab_panel.ts";

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, contexts: Contexts) => ReactElement);
};

export default function WithTabPanel(
  { children }: Props,
): JSX.Element {
  const id = useContext(IdContext);
  const tabPanelCount = useContext(TabPanelCountContext);
  const indexStateSet = useContext(IndexContext);
  const disabledIds = useContext(DisabledIdsContext);

  if (!id || !indexStateSet || !tabPanelCount) {
    throw Error(ERROR_MSG);
  }
  const [selectedIndex] = indexStateSet;
  const index = tabPanelCount.next;

  const [attributes, contexts] = useTabPanel({
    id,
    index,
    disabledIds,
    selectedIndex,
  });

  if (isFunction(children)) {
    return children(attributes, contexts);
  }

  return cloneElement(children, attributes);
}
