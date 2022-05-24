import { DependencyList, useEffect } from "react";
import { Useable } from "./types.ts";

export type Target = () =>
  | HTMLElement
  | SVGElement
  | MathMLElement
  | undefined
  | null;

export default function useFocus(
  target: Target,
  { use = true }: Readonly<Partial<Useable>> = {},
  deps?: DependencyList,
) {
  useEffect(() => {
    if (!use) return;

    const el = target();
    el?.focus();
  }, deps);
}
