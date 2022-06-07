import { createElement, ReactNode, RefObject, useMemo, useRef } from "react";
import { CommonContextsContext, GroupIdContext } from "./contexts.ts";
import { CommonContexts, IsOpenProps } from "./types.ts";
import {
  current,
  Exclusive,
  filterTruthy,
  safeFocus,
  sortTabOrder,
} from "../util.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";
import { useId, useUpdateEffect } from "../hooks/mod.ts";
import { ExclusiveActiveIndexProps } from "../_shared/types.ts";

export type Props =
  & {
    children?: ReactNode;
  }
  & Exclusive<IsOpenProps, {
    /**
     * @default false
     */
    initialIsOpen?: boolean;
  }>
  & ExclusiveActiveIndexProps;

export default function MenuProvider(
  {
    children,
    initialIsOpen = false,
    isOpen: _isOpen,
    setIsOpen: _setIsOpen,
    activeIndex: _activeIndex,
    setActiveIndex: _setActiveIndex,
    initialActiveIndex = 0,
  }: Readonly<Props>,
): JSX.Element {
  const [isOpen, setIsOpen] = useExclusiveState({
    initialState: initialIsOpen,
    state: _isOpen,
    setState: _setIsOpen,
  });
  const [activeIndex, setActiveIndex] = useExclusiveState<number | undefined>({
    initialState: initialActiveIndex,
    state: _activeIndex,
    setState: _setActiveIndex,
  });
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
