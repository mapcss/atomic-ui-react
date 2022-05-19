import { AllHTMLAttributes, cloneElement, ReactElement, useMemo } from "react";
import { isFunction } from "../deps.ts";

export type Props = {
  children: ReactElement | ((attributes: Attributes) => ReactElement);
};

export type Attributes = Pick<AllHTMLAttributes<Element>, "role">;

export default function WithToolbar(
  { children }: Readonly<Props>,
): JSX.Element {
  const attributes = useMemo<Attributes>(() => ({
    role: "toolbar",
  }), []);

  const child = isFunction(children) ? children(attributes) : cloneElement(
    children,
    attributes,
  );

  return child;
}
