import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { first, last, next, prev } from "../hooks/use_range_counter.ts";
import { mappingKey } from "../util.ts";
import { CommonContexts } from "./types.ts";

export type AllAttributesWithContexts = AllAttributesWith<[CommonContexts]>;

export type Returns = [AllHTMLAttributes<Element>, CommonContexts];

export default function useToolbar(
  {
    activeIndex,
    setActiveIndex,
    itemsRef,
  }: Readonly<CommonContexts>,
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const contexts = useMemo<CommonContexts>(
    () => ({ itemsRef, activeIndex, setActiveIndex }),
    [
      activeIndex,
      setActiveIndex,
    ],
  );

  const attributes = useAttributesWith([contexts], {
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
