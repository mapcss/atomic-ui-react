// This module is browser compatible.

import { createElement, ReactNode, RefObject, useRef } from "react";
import useId from "../hooks/use_id.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import {
  ExclusiveActiveIndexProps,
  ExclusiveSelectIndexProps,
} from "../_shared/types.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";

export type Props =
  & {
    /** When `true`, the orientation of the `TabList` will be `horizontal`, otherwise `vertical`
     * @default true
     */
    isHorizontal?: boolean;

    children: ReactNode;
  }
  & ExclusiveActiveIndexProps
  & ExclusiveSelectIndexProps;

export default function TabProvider(
  {
    children,
    initialActiveIndex,
    initialSelectIndex: _initialSelectIndex,
    selectIndex: _selectIndex,
    activeIndex: _activeIndex,
    setActiveIndex: _setActiveIndex,
    setSelectIndex: _setSelectIndex,
  }: Readonly<Props>,
): JSX.Element {
  const { id } = useId();
  const [activeIndex, setActiveIndex] = useExclusiveState<number | undefined>({
    initialState: initialActiveIndex,
    setState: _setActiveIndex,
    state: _activeIndex,
  });
  const [selectIndex, setSelectIndex] = useExclusiveState<number | undefined>({
    initialState: _initialSelectIndex,
    setState: _setSelectIndex,
    state: _selectIndex,
  });

  const tabsRef = useRef<RefObject<Element>[]>([]);
  const tabPanelsRef = useRef<RefObject<Element>[]>([]);

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(CommonContextsContext.Provider, {
      value: {
        activeIndex,
        setActiveIndex,
        selectIndex,
        setSelectIndex,
        tabsRef,
        tabPanelsRef,
      },
    }, children),
  );
}
