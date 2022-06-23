import {
  createElement,
  ReactElement,
  RefAttributes,
  RefObject,
  useRef,
} from "react";
import useListbox, { Options, Returns } from "./use_listbox.ts";
import { useId, useStateSet } from "../hooks/mod.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import {
  ExclusiveActiveIndex,
  ExclusiveSelectIndex,
} from "../_shared/types.ts";
import { ActiveDescendant, FocusStrategyContext } from "../focus/mod.ts";

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: Returns[0] & RefAttributes<any>,
      contexts: Returns[1],
    ) => ReactElement;
  }
  & Partial<Options>
  & ExclusiveActiveIndex
  & ExclusiveSelectIndex;

export default function WithListbox(
  {
    children,
    initialActiveIndex = 0,
    activeIndexSet,
    focusStrategy = ActiveDescendant,
    onChangeActive,
    initialSelectIndex,
    selectIndexSet,
    onChangeSelect,
  }: Props,
): JSX.Element {
  const childrenRef = useRef<
    RefObject<HTMLElement | SVGElement | MathMLElement>[]
  >([]);
  const { id } = useId();
  const [activeIndex, setActiveIndex] = useStateSet<number | undefined>(
    initialActiveIndex,
    activeIndexSet,
  );
  const [selectIndex, setSelectIndex] = useStateSet<number | undefined>(
    initialSelectIndex,
    selectIndexSet,
  );

  const ref = useRef<HTMLElement | SVGElement>(null);

  const [attributes, contexts] = useListbox({
    setActiveIndex,
    activeIndex,
    childrenRef,
    selectIndex,
    setSelectIndex,
  }, { focusStrategy, onChangeActive, onChangeSelect });

  const child = children({ ref, ...attributes }, contexts);

  return createElement(
    FocusStrategyContext.Provider,
    { value: focusStrategy },
    createElement(
      CommonContextsContext.Provider,
      { value: contexts },
      createElement(IdContext.Provider, { value: id }, child),
    ),
  );
}
