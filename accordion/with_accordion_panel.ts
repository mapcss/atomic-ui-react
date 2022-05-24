// This module is browser compatible.

import {
  cloneElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import { current, filterTruthy } from "../util.ts";
import {
  IdContext,
  IndexContext,
  PanelCountContext,
  RefsContext,
} from "./context.ts";
import useAccordionPanel, {
  Attributes,
  Contexts,
  Params,
} from "./use_accordion_panel.ts";
import { Targets } from "../hooks/use_focus_callback.ts";
import { ERROR_MSG } from "./constant.ts";

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, contexts: Contexts & Params) => ReactElement);
};

export default function WithAccordionPanel({ children }: Props): JSX.Element {
  const id = useContext(IdContext);
  const tempId = useContext(
    PanelCountContext,
  );
  const selectedIndexStateSet = useContext(IndexContext);
  const refs = useContext(RefsContext);

  if (!id || !tempId || !selectedIndexStateSet) throw Error(ERROR_MSG);

  const index = tempId.next;
  const [selectedIndex] = selectedIndexStateSet;
  const isOpen = useMemo<boolean>(() => index === selectedIndex, [
    index,
    selectedIndex,
  ]);

  const targets = useCallback<Targets>(
    () => filterTruthy(refs.map(current)),
    [],
  );

  const params: Params = {
    id,
    index,
    targets,
    isOpen,
  };

  const [attributes, contexts] = useAccordionPanel({
    id,
    index,
    targets,
    isOpen,
  });

  const child = isFunction(children)
    ? children(attributes, { ...contexts, ...params })
    : cloneElement(children, attributes);

  return child;
}
