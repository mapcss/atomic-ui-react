// This module is browser compatible.

import { createElement } from "react";
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

export default function TabPanel<As extends keyof JSX.IntrinsicElements>(
  { as, tabId, ...rest }: Props<As>,
): JSX.Element {
  const _as = as ?? "div";
  const aria = useTabPanelAria({ tabId });

  return createElement(_as, { ...aria, ...rest });
}

TabPanel[TYPE] = TAB_PANEL;