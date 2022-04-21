// This module is browser compatible.

import { createElement, ForwardedRef, forwardRef as _forwardRef } from "react";
import { TAB_PANEL, TYPE } from "./constant.ts";
import useTabPanelAria, { Param } from "./use_tab_panel_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `div`
   */
  as?: As;
} & Partial<Param>;

export type Props<As extends keyof JSX.IntrinsicElements = "div"> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

function _TabPanel<As extends keyof JSX.IntrinsicElements>(
  { as, tabId, ...rest }: Props<As>,
  ref: ForwardedRef<As>,
): JSX.Element {
  const _as = as ?? "div";
  const aria = useTabPanelAria({ tabId });

  return createElement(_as, { ref, ...aria, ...rest });
}

const TabPanel = _forwardRef(_TabPanel);

// deno-lint-ignore no-explicit-any
(TabPanel as any)[TYPE] = TAB_PANEL;
export default TabPanel;
