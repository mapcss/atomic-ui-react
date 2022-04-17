// This module is browser compatible.

import { createElement, RefObject, useMemo } from "react";
import { TAB, TYPE } from "./constant.ts";
import useTabAria, { Param } from "./use_tab_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  as?: As;

  tabRef?: RefObject<HTMLElement>;

  /** Dynamic rendering props with context. */
  renderProps?: (
    context: { isSelected: boolean },
  ) => Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;
} & Partial<Param>;

export type Props<As extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function Tab<As extends keyof JSX.IntrinsicElements = "button">(
  {
    as,
    isSelected,
    isDisabled,
    tabPanelId,
    renderProps,
    tabRef,
    ...rest
  }: Props<As>,
): JSX.Element {
  const props = useMemo(
    () => renderProps?.({ isSelected: isSelected ?? false }) ?? {},
    [isSelected],
  );

  const tabIndexProps = useMemo(() => ({ tabIndex: isSelected ? 0 : -1 }), [
    isSelected,
  ]);

  const aria = useTabAria({ isSelected, tabPanelId, isDisabled });

  return createElement(as ?? "button", {
    ref: tabRef,
    ...aria,
    ...tabIndexProps,
    ...rest,
    ...props,
  });
}

Tab[TYPE] = TAB;
