import { createElement, ReactNode, RefObject, useMemo, useRef } from "react";
import { CommonContextsContext, GroupIdContext } from "./contexts.ts";
import { CommonContexts } from "./types.ts";
import {
  current,
  Exclusive,
  filterTruthy,
  safeFocus,
  sortTabOrder,
} from "../util.ts";
import { useId, useStateSet, useUpdateEffect } from "../hooks/mod.ts";
import { ExclusiveActiveIndex } from "../_shared/types.ts";
import { StateSet } from "../types.ts";

export type Props =
  & {
    children?: ReactNode;
  }
  & Exclusive<{
    isOpenSet: StateSet<boolean>;
  }, {
    /**
     * @default false
     */
    initialIsOpen: boolean;
  }>
  & ExclusiveActiveIndex;

export default function MenuProvider(
  {
    children,
    initialIsOpen = false,
    isOpenSet,
    initialActiveIndex = 0,
    activeIndexSet,
  }: Readonly<Props>,
): JSX.Element {
  const [isOpen, setIsOpen] = useStateSet<boolean>(initialIsOpen, isOpenSet);
  const [activeIndex, setActiveIndex] = useStateSet<number | undefined>(
    initialActiveIndex,
    activeIndexSet,
  );
  const { id } = useId();
  const menuRef = useRef<Element>(null);
  const menuTriggerRef = useRef<Element>(null);
  const menuItemsRef = useRef<RefObject<Element>[]>([]);

  useUpdateEffect(() => {
    if (isOpen) {
      const els = filterTruthy([
        menuRef.current,
        ...menuItemsRef.current.map(current),
      ]);
      const tab = sortTabOrder(els);

      safeFocus(tab[0]);
    } else {
      safeFocus(menuTriggerRef.current);
    }
  }, [isOpen]);

  const commonContexts = useMemo<CommonContexts>(() => ({
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    menuItemsRef,
    menuTriggerRef,
    menuRef,
  }), [
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    menuItemsRef,
    menuTriggerRef,
    menuRef,
  ]);

  return createElement(
    GroupIdContext.Provider,
    { value: id },
    createElement(
      CommonContextsContext.Provider,
      {
        value: commonContexts,
      },
      children,
    ),
  );
}
