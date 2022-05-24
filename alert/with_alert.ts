// This module is browser compatible.

import { cloneElement, ReactElement } from "react";
import { isFunction } from "../deps.ts";
import useAlert, { Attributes } from "./use_alert.ts";

export type Props = {
  children: ReactElement | ((attributes: Attributes) => ReactElement);
};

export default function WithAlert({ children }: Readonly<Props>): JSX.Element {
  const attributes = useAlert();
  const child = isFunction(children)
    ? children(attributes)
    : cloneElement(children, attributes);

  return child;
}
