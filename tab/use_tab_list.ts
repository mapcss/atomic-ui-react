// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { onNotNullable } from "../util.ts";

export type Options = {
  /** When `true`, the orientation of the `TabList` will be `horizontal`, When `false` will be `vertical` */
  isHorizontal: boolean;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-orientation"
>;

export default function useTabList(
  { isHorizontal }: Readonly<Partial<Options>> = {},
): Attributes {
  const attributes = useMemo<Attributes>(() => ({
    role: "tablist",
    "aria-orientation": onNotNullable(isHorizontal, getAriaOrientation),
  }), [isHorizontal]);
  return attributes;
}

function getAriaOrientation(
  value: boolean,
): Attributes["aria-orientation"] {
  return value ? "horizontal" : "vertical";
}
