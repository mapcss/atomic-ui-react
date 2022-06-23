// This module is browser compatible.

import { createElement, ReactNode, RefObject, useMemo, useRef } from "react";
import {
  CommonContextsContext,
  FocusStrategyContext,
  IdContext,
} from "./context.ts";
import { useId, useStateSet, useUpdateEffect } from "../hooks/mod.ts";
import { FocusStrategyProps, RovingTabIndex } from "../focus/mod.ts";
import { ExclusiveActiveIndex } from "../_shared/types.ts";
import { CommonContexts } from "./types.ts";

export type Props =
  & {
    children?: ReactNode;

    onChangeActive?: (contexts: CommonContexts) => void;
  }
  & Partial<FocusStrategyProps>
  & ExclusiveActiveIndex;

export default function ToolbarProvider(
  {
    children,
    initialActiveIndex = 0,
    activeIndexSet,
    onChangeActive,
    focusStrategy = RovingTabIndex,
  }: Readonly<Props>,
): JSX.Element {
  const idReturns = useId();
  const [activeIndex, setActiveIndex] = useStateSet<number | undefined>(
    initialActiveIndex,
    activeIndexSet,
  );

  useUpdateEffect(() => {
    onChangeActive?.({ activeIndex, setActiveIndex, itemsRef });
  }, [activeIndex]);

  const itemsRef = useRef<RefObject<HTMLElement | SVGElement>[]>([]);

  const commonContexts = useMemo<CommonContexts>(
    () => ({ activeIndex, setActiveIndex, itemsRef }),
    [activeIndex, setActiveIndex, itemsRef],
  );

  return createElement(
    CommonContextsContext.Provider,
    { value: commonContexts },
    createElement(
      IdContext.Provider,
      { value: idReturns },
      createElement(
        FocusStrategyContext.Provider,
        { value: focusStrategy },
        children,
      ),
    ),
  );
}
