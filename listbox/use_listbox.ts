import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import { CommonContexts } from "./types.ts";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { mappingKey } from "../util.ts";
import { FocusStrategyProps } from "../focus/types.ts";
import useFocusStrategy from "../focus/use_focus_strategy.ts";
import ActiveDescendant from "../focus/active_descendant.ts";
import { next, prev } from "../hooks/use_range_counter.ts";
import useUpdateEffect from "../hooks/use_update_effect.ts";

export type AllAttributesWithContexts = AllAttributesWith<[CommonContexts]>;

export type Params = CommonContexts;

export type Options = {
  onChangeActive: (contexts: CommonContexts) => void;

  onChangeSelect: (contexts: CommonContexts) => void;
} & FocusStrategyProps;

export type Returns = [AllHTMLAttributes<Element>, CommonContexts];

export default function useListbox(
  {
    activeIndex,
    setActiveIndex,
    selectIndex,
    setSelectIndex,
    childrenRef,
  }: Readonly<Params>,
  { onChangeActive, onChangeSelect, focusStrategy = ActiveDescendant }:
    Readonly<
      Partial<Options>
    > = {},
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const contexts = useMemo<CommonContexts>(
    () => ({
      activeIndex,
      setActiveIndex,
      childrenRef,
      selectIndex,
      setSelectIndex,
    }),
    [activeIndex, setActiveIndex, selectIndex, setSelectIndex],
  );

  useUpdateEffect(() => {
    onChangeActive?.(contexts);
  }, [contexts.activeIndex]);

  useUpdateEffect(() => {
    onChangeSelect?.(contexts);
  }, [contexts.selectIndex]);

  const activeElement = useMemo(
    () => childrenRef.current[activeIndex]?.current,
    [activeIndex],
  );

  const focusAttributes = useFocusStrategy({
    strategy: focusStrategy,
    type: "parent",
    payload: {
      activeElement,
    },
  });

  const attributes = useAttributesWith([contexts], {
    ...focusAttributes,
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes, contexts];
}

const defaultOnKeyDown: AttributesHandler<
  [CommonContexts],
  "onKeyDown"
> = (ev, { activeIndex, childrenRef, setActiveIndex }) => {
  const run = mappingKey<KeyboardEvent>([[
    "ArrowUp",
    (ev) => {
      ev.preventDefault();
      const count = childrenRef.current.length - 1;
      const featureIndex = prev({
        current: activeIndex,
        max: count,
      });
      setActiveIndex(featureIndex);
    },
  ], ["ArrowDown", (ev) => {
    ev.preventDefault();
    const count = childrenRef.current.length - 1;
    const featureIndex = next({
      current: activeIndex,
      max: count,
    });
    setActiveIndex(featureIndex);
  }]]);

  run(ev);
};

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  role: "listbox",
  onKeyDown: defaultOnKeyDown,
};
