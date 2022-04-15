// This module is browser compatible.

import { useMemo } from "react";

type UseTabListAttributeReturnValue =
  & Pick<JSX.IntrinsicElements[keyof JSX.IntrinsicElements], "aria-orientation">
  & {
    role: "tablist";
  };

export function useTabListAttribute(): UseTabListAttributeReturnValue {
  const attribute = useMemo<UseTabListAttributeReturnValue>(() => {
    return {
      role: "tablist",
      "aria-orientation": "horizontal",
    };
  }, []);

  return attribute;
}

type UseTabPanelAttributeReturnValue = {
  role: "tabpanel";
};

export function useTabPanelAttribute(): UseTabPanelAttributeReturnValue {
  const attribute = useMemo<UseTabPanelAttributeReturnValue>(() => {
    return {
      role: "tabpanel",
    };
  }, []);

  return attribute;
}

type UseTabAttributeParam = {
  selected: boolean;
};

type UseTabAttributeReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-selected" | "tabIndex"
>;
export function useTabAttribute(
  { selected }: UseTabAttributeParam,
): UseTabAttributeReturnValue {
  const attribute = useMemo<UseTabAttributeReturnValue>(() => {
    return {
      role: "tab",
      "aria-selected": selected ? "true" : "false",
      // "aria-controls": "",
      tabIndex: selected ? 0 : -1,
    };
  }, [selected]);

  return attribute;
}
