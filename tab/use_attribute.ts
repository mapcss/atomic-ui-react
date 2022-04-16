// This module is browser compatible.

import { useMemo } from "react";
import { isBoolean } from "../deps.ts";

export type UseTabListAttributeParam = {
  isHorizontal: boolean;
};

export type UseTabListAttributeReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "aria-orientation" | "role"
>;

export function useTabListAttribute(
  { isHorizontal }: Readonly<Partial<UseTabListAttributeParam>> = {},
): UseTabListAttributeReturnValue {
  const attribute = useMemo<UseTabListAttributeReturnValue>(() => {
    return {
      role: "tablist",
      "aria-orientation": isBoolean(isHorizontal)
        ? isHorizontal ? "horizontal" : "vertical"
        : undefined,
    };
  }, [isHorizontal]);

  return attribute;
}

export type UseTabPanelAttributeParam = {
  tabId: string;
};

export type UseTabPanelAttributeReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-labelledby"
>;

export function useTabPanelAttribute(
  { tabId }: Readonly<Partial<UseTabPanelAttributeParam>> = {},
): UseTabPanelAttributeReturnValue {
  const attribute = useMemo<UseTabPanelAttributeReturnValue>(() => {
    return {
      role: "tabpanel",
      "aria-labelledby": tabId,
    };
  }, [tabId]);

  return attribute;
}

export type UseTabAttributeParam = {
  isSelected: boolean;
  tabPanelId: string;
};

export type UseTabAttributeReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-selected" | "tabIndex" | "aria-controls"
>;
export function useTabAttribute(
  { isSelected, tabPanelId }: Readonly<Partial<UseTabAttributeParam>>,
): UseTabAttributeReturnValue {
  const attribute = useMemo<UseTabAttributeReturnValue>(() => {
    return {
      role: "tab",
      "aria-selected": isSelected ? "true" : "false",
      "aria-controls": tabPanelId,
      tabIndex: isSelected ? 0 : -1,
    };
  }, [isSelected, tabPanelId]);

  return attribute;
}
