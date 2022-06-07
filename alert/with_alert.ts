// This module is browser compatible.

import { ReactElement } from "react";
import useAlert, { AllAttributesWithContexts, Returns } from "./use_alert.ts";

export type Props = {
  children: (attributes: Returns[0]) => ReactElement;
} & Partial<AllAttributesWithContexts>;

export default function WithAlert(
  { children, ...allAttributes }: Readonly<Props>,
): JSX.Element {
  const returns = useAlert(allAttributes);

  return children(...returns);
}
