import { AllHTMLAttributes, useMemo } from "react";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { CommonContexts } from "./types.ts";
import useFocusStrategy from "../focus/use_focus_strategy.ts";
import RovingTabIndex from "../focus/roving_tabindex.ts";
import { FocusStrategyProps } from "../focus/types.ts";

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Params = {
  id: string;

  index: number;
} & CommonContexts;

export type Options = FocusStrategyProps;

export type Contexts = Params & {
  isActive: boolean;
};

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useToolbarItem(
  { activeIndex, setActiveIndex, index, id, itemsRef }: Readonly<
    Params
  >,
  { focusStrategy = RovingTabIndex }: Readonly<Partial<Options>> = {},
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const isActive = useMemo<boolean>(
    () => index === activeIndex,
    [index, activeIndex],
  );

  const contexts = useMemo<Contexts>(() => ({
    isActive,
    activeIndex,
    setActiveIndex,
    index,
    id,
    itemsRef,
  }), [
    isActive,
    activeIndex,
    setActiveIndex,
    index,
    id,
  ]);

  const focusAttributes = useFocusStrategy({
    strategy: focusStrategy,
    type: "child",
    payload: {
      isActive,
      id,
    },
  });

  const attributes = useAttributesWith([contexts], {
    ...focusAttributes,
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes, contexts];
}

const defaultOnClick: AttributesHandler<[Contexts], "onClick"> = (
  _,
  { setActiveIndex, index },
) => {
  setActiveIndex(index);
};

const defaultAttributes: Partial<AllAttributesWith<[Contexts]>> = {
  onClick: defaultOnClick,
};
