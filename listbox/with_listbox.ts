import {
  createElement,
  ReactElement,
  RefAttributes,
  RefObject,
  useRef,
} from "react";
import useListbox, { Options, Returns } from "./use_listbox.ts";
import useId from "../hooks/use_id.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";
import { ActiveIndexes, SelectIndexes } from "./types.ts";
import { Exclusive } from "../util.ts";
import FocusStrategyContext from "../focus/context.ts";
import ActiveDescendant from "../focus/active_descendant.ts";

type X = Exclusive<ActiveIndexes, {
  initialActiveIndex?: number;
}>;
type Y = Exclusive<SelectIndexes, {
  initialSelectIndex?: number;
}>;

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: Returns[0] & RefAttributes<any>,
      contexts: Returns[1],
    ) => ReactElement;
  }
  & Partial<Options>
  & X
  & Y;

export default function WithListbox(
  {
    children,
    initialActiveIndex: initialState = 0,
    setActiveIndex: setState,
    activeIndex: state,
    focusStrategy = ActiveDescendant,
    onChangeActive,
    selectIndex: _selectIndex,
    setSelectIndex: _setSelectIndex,
    initialSelectIndex,
    onChangeSelect,
  }: Props,
): JSX.Element {
  const childrenRef = useRef<
    RefObject<HTMLElement | SVGElement | MathMLElement>[]
  >([]);
  const { id } = useId();
  const [activeIndex, setActiveIndex] = useExclusiveState({
    state,
    setState,
    initialState,
  });
  const [selectIndex, setSelectIndex] = useExclusiveState<number | undefined>({
    state: _selectIndex,
    setState: _setSelectIndex,
    initialState: initialSelectIndex,
  });
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
