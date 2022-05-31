import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { first, last, next, prev } from "../hooks/use_range_counter.ts";
import { mappingKey } from "../util.ts";
import { CommonContexts } from "./types.ts";
import useFocusStrategy from "../focus/use_focus_strategy.ts";
import RovingTabIndex from "../focus/roving_tabindex.ts";
import { FocusStrategy } from "../focus/types.ts";

export type AllAttributesWithContexts = AllAttributesWith<[CommonContexts]>;

export type Options = { focusStrategy: FocusStrategy };

export type Returns = [AllHTMLAttributes<Element>, CommonContexts];

export default function useToolbar(
  {
    activeIndex,
    setActiveIndex,
    itemsRef,
  }: Readonly<CommonContexts>,
  { focusStrategy = RovingTabIndex }: Readonly<Partial<Options>> = {},
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const contexts = useMemo<CommonContexts>(
    () => ({ itemsRef, activeIndex, setActiveIndex }),
    [
      activeIndex,
      setActiveIndex,
    ],
  );

  const activeElement = useMemo(
    () => itemsRef.current[activeIndex]?.current,
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

const defaultRole: AttributesHandler<[CommonContexts], "role"> = "toolbar";

const defaultOnKeyDown: AttributesHandler<[CommonContexts], "onKeyDown"> = (
  ev,
  { setActiveIndex, itemsRef, activeIndex },
) => {
  const run = mappingKey<KeyboardEvent>([
    ["ArrowLeft", (ev) => {
      const count = itemsRef.current.length - 1;

      ev.preventDefault();
      const featureIndex = prev({ current: activeIndex, max: count });
      setActiveIndex(featureIndex);
    }],
    ["ArrowRight", (ev) => {
      const count = itemsRef.current.length - 1;

      ev.preventDefault();
      const featureIndex = next({ current: activeIndex, max: count });
      setActiveIndex(featureIndex);
    }],
    ["Home", (ev) => {
      const count = itemsRef.current.length - 1;

      ev.preventDefault();
      const featureIndex = first({ current: activeIndex, max: count });
      setActiveIndex(featureIndex);
    }],
    ["End", (ev) => {
      const count = itemsRef.current.length - 1;

      ev.preventDefault();
      const featureIndex = last({ current: activeIndex, max: count });
      setActiveIndex(featureIndex);
    }],
  ]);

  run(ev);
};

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  role: defaultRole,
  onKeyDown: defaultOnKeyDown,
};
