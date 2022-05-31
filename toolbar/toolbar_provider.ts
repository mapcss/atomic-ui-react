// This module is browser compatible.

import { createElement, ReactNode } from "react";
import {
  ActiveIndexStateSetContext,
  IdContext,
  ItemsRefContext,
} from "./context.ts";
import useToolbarState, { Options, Params } from "./use_toolbar_state.ts";
import useId from "../hooks/use_id.ts";

export type Props =
  & {
    children: ReactNode;
  }
  & Params
  & Partial<Options>;

export default function ToolbarProvider(
  { children, initialActiveIndex, setActiveIndex, activeIndex, onChangeActive }:
    Props,
): JSX.Element {
  const [states, dispatches] = useToolbarState({
    initialActiveIndex,
    setActiveIndex: setActiveIndex as never,
    activeIndex: activeIndex as never,
  }, { onChangeActive });
  const idReturns = useId();

  return createElement(
    ItemsRefContext.Provider,
    { value: states.itemsRef },
    createElement(ActiveIndexStateSetContext.Provider, {
      value: [states.activeIndex, dispatches.setActiveIndex],
    }, createElement(IdContext.Provider, { value: idReturns }, children)),
  );
}
