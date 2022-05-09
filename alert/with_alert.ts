// This module is browser compatible.

import { cloneElement, ReactElement } from "react";
import { isFunction } from "../deps.ts";
import ariaAlert, { AriaAlert } from "./aria_alert.ts";

export type Props = {
  children: ReactElement | ((attributes: AriaAlert) => ReactElement);
};

export default function WithAlert({ children }: Props): JSX.Element {
  if (isFunction(children)) {
    return children(ariaAlert);
  }
  return cloneElement(children, ariaAlert);
}
