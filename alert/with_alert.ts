// This module is browser compatible.

import { ReactElement } from "react";
import useAlert, { Attributes } from "./use_alert.ts";

export type Props = {
  children: (attributes: Attributes) => ReactElement;
};

export default function WithAlert({ children }: Readonly<Props>): JSX.Element {
  const attributes = useAlert();

  return children(attributes);
}
