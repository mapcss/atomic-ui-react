import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import { FocusStrategyProps, useFocusStrategy } from "../focus/mod.ts";
import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { ActiveIndexProps } from "../_shared/types.ts";
import { CommonContexts } from "./types.ts";
import { isNumber } from "../deps.ts";
import { first, last, mappingKey, next, prev } from "../util.ts";

export type Params =
  & CommonContexts
  & { id: string | undefined; buttonId: string | undefined }
  & ActiveIndexProps;

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Contexts = Params & FocusStrategyProps;

export type Options = FocusStrategyProps;

export default function useMenu(
  { activeIndex, focusStrategy, menuItemsRef, ...rest }: Readonly<
    Contexts
  >,
  allAttributes: Partial<AllAttributesWith<[Contexts]>> = {},
): AllHTMLAttributes<Element> {
  const activeElement = useMemo(() => {
    if (!isNumber(activeIndex)) return;
    return menuItemsRef.current[activeIndex]?.current;
  }, [activeIndex, menuItemsRef]);

  const focusAttributes = useFocusStrategy({
    strategy: focusStrategy,
    type: "parent",
    payload: {
      activeElement,
    },
  });

  const attributes = useAttributesWith<[Contexts]>([{
    activeIndex,
    focusStrategy,
    menuItemsRef,
    ...rest,
  }], {
    ...defaultAttributes,
    ...focusAttributes,
    ...allAttributes,
  });

  return attributes;
}

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  role: "menu",
  hidden: ({ isOpen }) => !isOpen,
  onKeyDown: (
    ev,
    { setIsOpen, setActiveIndex, activeIndex, menuItemsRef },
  ) => {
    const size = menuItemsRef.current.length - 1;

    const runner = mappingKey<KeyboardEvent>([
      ["Escape", (ev) => {
        ev.preventDefault();
        setIsOpen(false);
      }],
      ["ArrowDown", (ev) => {
        ev.preventDefault();

        const featureIndex = next(activeIndex, size);
        setActiveIndex(featureIndex);
      }],
      ["ArrowUp", (ev) => {
        ev.preventDefault();

        const featureIndex = prev(activeIndex, size);
        setActiveIndex(featureIndex);
      }],
      ["Home", (ev) => {
        ev.preventDefault();

        const featureIndex = first(activeIndex, size);
        setActiveIndex(featureIndex);
      }],
      ["End", (ev) => {
        ev.preventDefault();

        const featureIndex = last(activeIndex, size);
        setActiveIndex(featureIndex);
      }],
    ]);

    runner(ev);
  },
  id: ({ id }) => id!,
  "aria-labelledby": ({ buttonId }) => buttonId!,
};
