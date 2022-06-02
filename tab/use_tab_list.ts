// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent, useMemo } from "react";
import useAttributesWith, {
  AllAttributesWith,
} from "../hooks/use_attributes_with.ts";
import { isNumber } from "../deps.ts";
import { ActiveThenSelectProps, FocusStrategyProps } from "../focus/mod.ts";
import RovingTabIndex from "../focus/roving_tabindex.ts";
import useFocusStrategy from "../focus/use_focus_strategy.ts";
import { CommonContexts } from "./types.ts";
import { defineSync, KeyEntries, mappingKey } from "../util.ts";
import { first, last, next, prev } from "../hooks/use_range_counter.ts";

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

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useTabList(
  {
    selectIndex,
    setActiveIndex,
    setSelectIndex,
    activeIndex,
    tabPanelsRef,
    tabsRef,
  }: Readonly<
    CommonContexts
  >,
  {
    isHorizontal = true,
    focusStrategy = RovingTabIndex,
    activeThenSelect = true,
  }: Readonly<
    Partial<Options>
  > = {},
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
        const index = first({ current: activeIndex, max: size });
        mutate(index);
      }],
      ["PageUp", (ev) => {
        ev.preventDefault();
        const index = first({ current: activeIndex, max: size });

        mutate(index);
      }],
      ["End", (ev) => {
        ev.preventDefault();
        const index = last({ current: activeIndex, max: size });

        mutate(index);
      }],
      ["PageDown", (ev) => {
        ev.preventDefault();
        const index = last({ current: activeIndex, max: size });

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
        const index = prev({ current: activeIndex, max: size });

        mutate(index);
      }], ["ArrowRight", (ev) => {
        ev.preventDefault();
        const index = next({ current: activeIndex, max: size });

        mutate(index);
      }]]
      : [["ArrowUp", (ev) => {
        ev.preventDefault();
        const index = prev({ current: activeIndex, max: size });

        mutate(index);
      }], ["ArrowDown", (ev) => {
        ev.preventDefault();
        const index = next({ current: activeIndex, max: size });

        mutate(index);
      }]];

    const run = mappingKey<KeyboardEvent>([
      ...statics,
      ...dynamics,
    ]);

    run(ev);
  },
};
