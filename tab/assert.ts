// This module is browser compatible.

import { ReactElement, ReactNode } from "react";
import { isFunction, isNil, isObject } from "../deps.ts";
import { TAB, TAB_LIST, TAB_PANEL, TYPE } from "./constant.ts";
import { TabElement, TabFC } from "./types.ts";

export function isTab(functionComponent: TabFC): functionComponent is TabFC {
  return functionComponent[TYPE] === TAB;
}

export function isTabPanel(
  functionComponent: TabFC,
): functionComponent is TabFC {
  return functionComponent[TYPE] === TAB_PANEL;
}

export function isTabList(
  functionComponent: TabFC,
): functionComponent is TabFC {
  return functionComponent[TYPE] === TAB_LIST;
}

export function isTabElement(
  reactElement: JSX.Element,
): reactElement is TabElement {
  return isFunction(reactElement.type) && TYPE in reactElement.type;
}

export function hasChildren(
  reactElement: JSX.Element,
): reactElement is ReactElement<{ children: ReactNode }> {
  return "children" in reactElement.props;
}

export function isValidChildren(
  value: unknown,
): value is Record<never, never> | undefined | null {
  return isObject(value) || isNil(value);
}
