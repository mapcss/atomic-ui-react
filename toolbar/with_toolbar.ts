// This module is browser compatible.

import { cloneElement, ReactElement } from "react";
import { isFunction } from "../deps.ts";
import useToolbar, { Attributes } from "./use_toolbar.ts";

export type Props = {
  children: ReactElement | ((attributes: Attributes) => ReactElement);
};

export default function WithToolbar(
  { children }: Readonly<Props>,
): JSX.Element {
  const attributes = useToolbar();

  const child = isFunction(children) ? children(attributes) : cloneElement(
    children,
    attributes,
  );

  return child;
}
