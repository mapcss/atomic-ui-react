// This module is browser compatible.

import { useCallback } from "react";
import { isLength0 } from "../deps.ts";
import {
  filterFocusable,
  getNextIndex,
  getPrevIndex,
} from "../_shared/util.ts";

export type Param = () => Element | undefined | null;
export type ReturnValue = {
  focusPrev: (ev: KeyboardEvent) => void;
  focusNext: (ev: KeyboardEvent) => void;
};

export default function useFocusCallback(
  target: Param,
): ReturnValue {
  const focusNext = useCallback((ev: KeyboardEvent) => {
    const el = target();
    if (!el) return;
    ev.preventDefault();
    const focusableElements = filterFocusable(el);
    if (isLength0(focusableElements)) {
      return;
    }
    const activeEl = el.ownerDocument.activeElement;

    const activeIndex = focusableElements.findIndex((el) =>
      el.isSameNode(activeEl)
    );
    const index = activeIndex < 0 ? 0 : getNextIndex(
      activeIndex,
      focusableElements.map(Boolean),
    );
    focusableElements[index]?.focus();
  }, [target]);
  const focusPrev = useCallback((ev: KeyboardEvent) => {
    const el = target();
    if (!el) return;
    ev.preventDefault();

    const focusableElements = filterFocusable(el);
    if (isLength0(focusableElements)) {
      return;
    }
    const activeEl = el.ownerDocument.activeElement;

    const activeIndex = focusableElements.findIndex((el) =>
      el.isSameNode(activeEl)
    );
    const index = activeIndex < 0 ? quantity(focusableElements) : getPrevIndex(
      activeIndex,
      focusableElements.map(Boolean),
    );
    focusableElements[index]?.focus();
  }, [target]);

  return {
    focusNext,
    focusPrev,
  };
}

function quantity({ length }: { length: number }): number {
  return length - 1;
}
