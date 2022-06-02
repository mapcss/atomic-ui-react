// This module is browser compatible.

import { AllHTMLAttributes, ReactElement } from "react";

export type Attributes = Pick<AllHTMLAttributes<Element>, "id">;

export type Props = {
  children: (attributes: Attributes) => ReactElement;

  id: string | undefined;
};

export default function WithDialogDescribe(
  { children, id }: Readonly<Props>,
): JSX.Element {
  return children({ id });
}
