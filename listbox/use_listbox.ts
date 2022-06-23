import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import { CommonContexts } from "./types.ts";
import {
  AllAttributesWith,
  AttributesHandler,
  useAttributesWith,
  useUpdateEffect,
} from "../hooks/mod.ts";
import { mappingKey, next, prev } from "../util.ts";
import {
  ActiveDescendant,
  FocusStrategyProps,
  useFocusStrategy,
} from "../focus/mod.ts";
import { isNumber } from "../deps.ts";

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
    () =>
      isNumber(activeIndex)
        ? childrenRef.current[activeIndex]?.current
        : undefined,
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
      const featureIndex = prev(activeIndex, count);
      setActiveIndex(featureIndex);
    },
  ], ["ArrowDown", (ev) => {
    ev.preventDefault();
    const count = childrenRef.current.length - 1;
    const featureIndex = next(activeIndex, count);
    setActiveIndex(featureIndex);
  }]]);

  run(ev);
};

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  role: "listbox",
  onKeyDown: defaultOnKeyDown,
};
