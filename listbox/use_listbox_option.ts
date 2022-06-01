import { AllHTMLAttributes, useMemo } from "react";
import { Returns as UseIdReturns } from "../hooks/use_id.ts";
import { CommonContexts } from "./types.ts";
import useAttributesWith, {
  AllAttributesWith,
} from "../hooks/use_attributes_with.ts";
import useFocusStrategy from "../focus/use_focus_strategy.ts";
import { FocusStrategyProps } from "../focus/types.ts";
import ActiveDescendant from "../focus/active_descendant.ts";

export type Params = CommonContexts & UseIdReturns;

export type Contexts = {
  isSelect: boolean;

  isActive: boolean;
} & Params;

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Options = FocusStrategyProps;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useListboxOption(
  {
    id,
    index,
    selectIndex,
    activeIndex,
    setActiveIndex,
    setSelectIndex,
    childrenRef,
  }: Readonly<Params>,
  { focusStrategy = ActiveDescendant }: Readonly<
    Partial<Options>
  >,
): Returns {
  const isActive = useMemo<boolean>(() => index === activeIndex, [
    index,
    activeIndex,
  ]);
  const isSelect = useMemo<boolean>(() => index === selectIndex, [
    index,
    selectIndex,
  ]);

  const contexts = useMemo<Contexts>(
    () => ({
      isActive,
      isSelect,
      selectIndex,
      activeIndex,
      setActiveIndex,
      setSelectIndex,
      childrenRef,
      id,
      index,
    }),
    [
      isActive,
      isSelect,
      selectIndex,
      activeIndex,
      setActiveIndex,
      setSelectIndex,
      id,
      index,
    ],
  );

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
  role: "option",
  "aria-selected": ({ isSelect }) => isSelect,
  onClick: (ev, { setSelectIndex, index, setActiveIndex }) => {
    ev.preventDefault();
    setActiveIndex(index);
    setSelectIndex(index);
  },
};
