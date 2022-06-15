// This module is browser compatible.

import { createElement, ReactNode, RefObject, useRef } from "react";
import { CommonContextsContext, IdContext } from "./context.ts";
import {
  ExclusiveActiveIndex,
  ExclusiveSelectIndex,
} from "../_shared/types.ts";
import { useId, useStateSet } from "../hooks/mod.ts";

export type Props =
  & {
    /** When `true`, the orientation of the `TabList` will be `horizontal`, otherwise `vertical`
     * @default true
     */
    isHorizontal?: boolean;

    children: ReactNode;
  }
  & ExclusiveActiveIndex
  & ExclusiveSelectIndex;

export default function TabProvider(
  {
    children,
    initialSelectIndex = 0,
    initialActiveIndex = initialSelectIndex ?? 0,
    selectIndexSet,
    activeIndexSet,
  }: Readonly<Props>,
): JSX.Element {
  const { id } = useId();
  const [activeIndex, setActiveIndex] = useStateSet(
    initialActiveIndex,
    activeIndexSet,
  );
  const [selectIndex, setSelectIndex] = useStateSet(
    initialSelectIndex,
    selectIndexSet,
  );

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
