// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { CommonContexts } from "./types.ts";
import useAttributesWith, {
  AllAttributesWith,
} from "../hooks/use_attributes_with.ts";
import { Returns as UseIdReturns } from "../hooks/use_id.ts";

export type Params =
  & {
    tabId: string;
  }
  & UseIdReturns
  & CommonContexts;

export type Contexts = Params & {
  isSelect: boolean;
};

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useTabPanel(
  {
    id,
    index,
    selectIndex,
    setSelectIndex,
    tabId,
    activeIndex,
    setActiveIndex,
    tabPanelsRef,
    tabsRef,
  }: Readonly<
    Params
  >,
): Returns {
  const isSelect = useMemo<boolean>(() => index === selectIndex, [
    index,
    selectIndex,
  ]);

  const contexts = useMemo<Contexts>(
    () => ({
      id,
      index,
      selectIndex,
      setSelectIndex,
      tabId,
      isSelect,
      activeIndex,
      setActiveIndex,
      tabPanelsRef,
      tabsRef,
    }),
    [
      id,
      index,
      selectIndex,
      setSelectIndex,
      tabId,
      isSelect,
      activeIndex,
      setActiveIndex,
      tabPanelsRef,
      tabsRef,
    ],
  );

  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
  });

  return [attributes, contexts];
}

const defaultAttributes: Partial<AllAttributesWith<[Contexts]>> = {
  role: "tabpanel",
  id: ({ id }) => id,
  "aria-labelledby": ({ tabId }) => tabId,
  hidden: ({ isSelect }) => !isSelect,
};
