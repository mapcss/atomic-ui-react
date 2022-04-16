import { Children, isValidElement, ReactElement, ReactNode } from "react";
import { isFunction } from "../deps.ts";
import { isTab, isTabElement, isTabPanel } from "./assert.ts";
import { TabElement } from "./types.ts";

export type VisitOn = {
  tab: (tabElement: TabElement) => ReactNode | undefined;
  tabPanel: (tabElement: TabElement) => ReactNode | undefined;
};

export function visit(
  children: Readonly<ReactNode>,
  { tab, tabPanel }: Readonly<Partial<VisitOn>>,
): ReactNode {
  const parent = (child: ReactElement) => {
    if (isTabElement(child)) {
      if (isTab(child.type)) {
        if (!isFunction(tab)) return child;
        return tab(child);
      } else if (isTabPanel(child.type)) {
        if (!isFunction(tabPanel)) return child;
        return tabPanel(child);
      } else {
        return child;
      }
    } else child;
  };

  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    return parent(child);
  });
}
