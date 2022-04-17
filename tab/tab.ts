// This module is browser compatible.

import { createElement, useEffect, useMemo, useRef } from "react";
import { TAB, TYPE } from "./constant.ts";
import useTabAria, { Param } from "./use_tab_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  as?: As;

  focus?: boolean;

  /** Dynamic rendering props with context. */
  renderProps?: (
    context: { isSelected: boolean },
  ) => Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;
} & Partial<Param>;

export type Props<As extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function Tab<As extends keyof JSX.IntrinsicElements = "button">(
  { as, isSelected, tabPanelId, focus, renderProps, ...rest }: Props<As>,
): JSX.Element {
  const ref = useRef<HTMLElement>(null);

  const props = useMemo(
    () => renderProps?.({ isSelected: isSelected ?? false }) ?? {},
    [isSelected],
  );

  const tabIndexProps = useMemo(() => ({ tabIndex: isSelected ? 0 : -1 }), [
    isSelected,
  ]);

  useEffect(() => {
    if (!ref.current || !isSelected || !focus) return;
    ref.current.focus();
  }, [isSelected, focus]);
  const aria = useTabAria({ isSelected, tabPanelId });

  return createElement(as ?? "button", {
    ref,
    ...aria,
    ...tabIndexProps,
    ...rest,
    ...props,
  });
}

Tab[TYPE] = TAB;
