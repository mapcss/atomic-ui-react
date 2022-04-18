// This module is browser compatible.

import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import { isFunction } from "../deps.ts";
import {
  hasChildren,
  isTab,
  isTabElement,
  isTabList,
  isTabPanel,
} from "./assert.ts";
import { TabElement } from "./types.ts";

export type VisitOn = {
  tab: (tabElement: TabElement) => ReactElement | undefined;
  tabPanel: (tabElement: TabElement) => ReactElement | undefined;
  tabList: (tabElement: TabElement) => ReactElement | undefined;
};

export function visit(
  children: Readonly<ReactNode>,
  { tab, tabPanel, tabList }: Readonly<Partial<VisitOn>>,
): ReactNode {
  const applyVisit = (child: TabElement): ReactElement | undefined => {
    if (isTab(child.type)) {
      if (!isFunction(tab)) return child;
      return tab(child);
    }
    if (isTabPanel(child.type)) {
      if (!isFunction(tabPanel)) return child;
      return tabPanel(child);
    }
    if (isTabList(child.type)) {
      if (!isFunction(tabList)) return child;
      return tabList(child);
    }

    return child;
  };

  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const isTabComponentParent = isTabElement(child);
    const parent = isTabComponentParent ? applyVisit(child) : child;

    if (!parent) {
      return;
    }

    const element = hasChildren(parent)
      ? (() => {
        const children = visit(child.props.children, {
          tab,
          tabPanel,
          tabList,
        });
        return cloneElement(parent, {}, children);
      })()
      : parent;

    return element;
  });
}
