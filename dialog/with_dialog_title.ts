// This module is browser compatible.

import { AllHTMLAttributes, ReactElement, useContext } from "react";
import { IdsContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

export type Attributes = Pick<AllHTMLAttributes<Element>, "id">;

export type Props = {
  children: (attributes: Attributes) => ReactElement;
};

export default function WithDialogTitle(
  { children }: Readonly<Props>,
): JSX.Element | never {
  const ids = useContext(IdsContext);

  if (!ids) throw Error(ERROR_MSG);
  const { titleId } = ids;

  return children({ id: titleId });
}
