// This module is browser compatible.

import { createElement, ReactNode } from "react";
import {
  ActiveIndexStateSetContext,
  FocusStrategyContext,
  IdContext,
  ItemsRefContext,
} from "./context.ts";
import useToolbarState, { Options, Params } from "./use_toolbar_state.ts";
import useId from "../hooks/use_id.ts";
import { FocusStrategyProps } from "../focus/types.ts";
import RovingTabIndex from "../focus/roving_tabindex.ts";

export type Props =
  & {
    children: ReactNode;
  }
  & Params
  & Partial<Options>
  & Partial<FocusStrategyProps>;

export default function ToolbarProvider(
  {
    children,
    initialActiveIndex,
    setActiveIndex,
    activeIndex,
    onChangeActive,
    focusStrategy = RovingTabIndex,
  }: Props,
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
    createElement(
      ActiveIndexStateSetContext.Provider,
      {
        value: [states.activeIndex, dispatches.setActiveIndex],
      },
      createElement(
        IdContext.Provider,
        { value: idReturns },
        createElement(
          FocusStrategyContext.Provider,
          { value: focusStrategy },
          children,
        ),
      ),
    ),
  );
}
