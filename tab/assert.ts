// This module is browser compatible.

import { ReactElement, ReactNode } from "react";
import { isNil, isObject } from "../deps.ts";
import { TAB, TAB_LIST, TAB_PANEL, TYPE } from "./constant.ts";
import { TabElement, TabLikeComponent } from "./types.ts";

export function isTab(
  component: TabLikeComponent,
): component is TabLikeComponent {
  return component[TYPE] === TAB;
}

export function isTabPanel(
  component: TabLikeComponent,
): component is TabLikeComponent {
  return component[TYPE] === TAB_PANEL;
}

export function isTabList(
  component: TabLikeComponent,
): component is TabLikeComponent {
  return component[TYPE] === TAB_LIST;
}

export function isTabElement(
  reactElement: JSX.Element,
): reactElement is TabElement {
  return isObject(reactElement.type) && TYPE in reactElement.type;
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

export function isAriaDisabled(el: Element | undefined | null): boolean {
  return el?.ariaDisabled === "true";
}
