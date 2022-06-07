// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import useAttributesWith, {
  AllAttributesWith,
} from "../hooks/use_attributes_with.ts";
import { Returns as UseIdReturns } from "../hooks/use_id.ts";
import { CommonContexts } from "./types.ts";
import { FocusStrategyProps } from "../focus/types.ts";
import RovingTabIndex from "../focus/roving_tabindex.ts";
import useFocusStrategy from "../focus/use_focus_strategy.ts";

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Params = CommonContexts & UseIdReturns & {
  tabPanelId: string;
};

export type Options = {
  /** Whether or not the tab is disabled. */
  isDisabled: boolean;

  isHorizontal: boolean;
} & FocusStrategyProps;

export type Contexts = Params & {
  isHorizontal: boolean;

  /** Whether or not the tab is selected. */
  isSelect: boolean;

  isActive: boolean;
};

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useTab(
  {
    index,
    id,
    tabPanelId,
    selectIndex,
    setSelectIndex,
    activeIndex,
    setActiveIndex,
    tabPanelsRef,
    tabsRef,
  }: Readonly<Params>,
  {
    isHorizontal = true,
    focusStrategy = RovingTabIndex,
  }: Readonly<Partial<Options>> = {},
): Returns {
  const isSelect = useMemo<boolean>(() => index === selectIndex, [
    index,
    selectIndex,
  ]);
  const isActive = useMemo<boolean>(() => index === activeIndex, [
    index,
    activeIndex,
  ]);
  const contexts = useMemo<Contexts>(() => ({
    isHorizontal,
    isSelect,
    selectIndex,
    index,
    setSelectIndex,
    id,
    tabPanelId,
    tabPanelsRef,
    tabsRef,
    activeIndex,
    setActiveIndex,
    isActive,
  }), [
    isHorizontal,
    isSelect,
    selectIndex,
    index,
    setSelectIndex,
    id,
    tabPanelId,
    tabPanelsRef,
    tabsRef,
    activeIndex,
    setActiveIndex,
    isActive,
  ]);

  const focusAttributes = useFocusStrategy({
    strategy: focusStrategy,
    type: "child",
    payload: {
      id,
      isActive,
    },
  });

  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
    ...focusAttributes,
  });

  return [attributes, contexts];
}

const defaultAttributes: Partial<AllAttributesWith<[Contexts]>> = {
  role: "tab",
  id: ({ id }) => id,
  "aria-selected": ({ isSelect }) => isSelect,
  "aria-controls": ({ tabPanelId }) => tabPanelId,
  onClick: (_, { setSelectIndex, setActiveIndex, index }) => {
    setActiveIndex(index);
    setSelectIndex(index);
  },
};
