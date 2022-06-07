// This module is browser compatible.

import { AllHTMLAttributes } from "react";
import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";

export type Returns = [AllHTMLAttributes<Element>];

export type AllAttributesWithContexts = AllAttributesWith<[]>;

export default function useAlert(
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const attributes = useAttributesWith([], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes];
}

const defaultAttributes: Partial<AllAttributesWith<[]>> = {
  role: "alert",
};
