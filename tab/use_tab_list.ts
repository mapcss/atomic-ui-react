// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { isNumber } from "../deps.ts";
import {
  ActiveThenSelectProps,
  FocusStrategyProps,
  RovingTabIndex,
  useFocusStrategy,
} from "../focus/mod.ts";
import { CommonContexts } from "./types.ts";
import {
  defineSync,
  first,
  KeyEntries,
  last,
  mappingKey,
  next,
  prev,
} from "../util.ts";

export type Options =
  & {
    /** When `true`, the orientation of the `TabList` will be `horizontal`, When `false` will be `vertical`
     * @default true
     */
    isHorizontal: boolean;
  }
  & FocusStrategyProps
  & ActiveThenSelectProps;

export type Contexts = CommonContexts & Options;

export type AttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useTabList(
  {
    selectIndex,
    setActiveIndex,
    setSelectIndex,
    activeIndex,
    tabPanelsRef,
    tabsRef,
  }: Readonly<CommonContexts>,
  {
    isHorizontal = true,
    focusStrategy = RovingTabIndex,
    activeThenSelect = true,
  }: Readonly<
    Partial<Options>
  > = {},
  allAttributes: AttributesWithContexts = {},
): Returns {
  const contexts = useMemo<Contexts>(
    () => ({
      isHorizontal,
      selectIndex,
      setActiveIndex,
      setSelectIndex,
      activeIndex,
      focusStrategy,
      tabPanelsRef,
      tabsRef,
      activeThenSelect,
    }),
    [
      isHorizontal,
      selectIndex,
      setActiveIndex,
      setSelectIndex,
      activeIndex,
      focusStrategy,
      tabPanelsRef,
      tabsRef,
      activeThenSelect,
    ],
  );

  const activeElement = useMemo(() => {
    if (!isNumber(activeIndex)) return;
    return tabsRef.current[activeIndex]?.current;
  }, [activeIndex]);

  const focusAttributes = useFocusStrategy({
    strategy: focusStrategy,
    type: "parent",
    payload: {
      activeElement,
    },
  });
  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
    ...focusAttributes,
    ...allAttributes,
  });

  return [attributes, contexts];
}

const defaultAttributes: Partial<AllAttributesWith<[Contexts]>> = {
  role: "tablist",
  "aria-orientation": ({ isHorizontal }) =>
    isHorizontal ? "horizontal" : "vertical",
  onKeyDown: (
    ev,
    {
      isHorizontal,
      tabsRef,
      activeIndex,
      setActiveIndex,
      setSelectIndex,
      activeThenSelect,
    },
  ) => {
    const size = tabsRef.current.length - 1;

    const mutate = activeThenSelect
      ? defineSync(setActiveIndex, setSelectIndex)
      : setActiveIndex;

    const statics: KeyEntries<KeyboardEvent> = [
      ["Home", (ev) => {
        ev.preventDefault();
        const index = first(activeIndex, size);
        mutate(index);
      }],
      ["PageUp", (ev) => {
        ev.preventDefault();
        const index = first(activeIndex, size);

        mutate(index);
      }],
      ["End", (ev) => {
        ev.preventDefault();
        const index = last(activeIndex, size);

        mutate(index);
      }],
      ["PageDown", (ev) => {
        ev.preventDefault();
        const index = last(activeIndex, size);

        mutate(index);
      }],
      ["Space", (ev) => {
        ev.preventDefault();
        setSelectIndex(activeIndex);
      }],
      ["Enter", (ev) => {
        ev.preventDefault();
        setSelectIndex(activeIndex);
      }],
    ];
    const dynamics: KeyEntries<KeyboardEvent> = isHorizontal
      ? [["ArrowLeft", (ev) => {
        ev.preventDefault();
        const index = prev(activeIndex, size);

        mutate(index);
      }], ["ArrowRight", (ev) => {
        ev.preventDefault();
        const index = next(activeIndex, size);

        mutate(index);
      }]]
      : [["ArrowUp", (ev) => {
        ev.preventDefault();
        const index = prev(activeIndex, size);

        mutate(index);
      }], ["ArrowDown", (ev) => {
        ev.preventDefault();
        const index = next(activeIndex, size);

        mutate(index);
      }]];

    const run = mappingKey<KeyboardEvent>([
      ...statics,
      ...dynamics,
    ]);

    run(ev);
  },
};
