import { AllHTMLAttributes, useMemo } from "react";

export type Attributes = Pick<AllHTMLAttributes<Element>, "role">;

export default function useToolbar(): Attributes {
  const attributes = useMemo<Attributes>(() => ({
    role: "toolbar",
  }), []);

  return attributes;
}
