// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { IdsContext } from "./context.ts";
import { ALERT_DIALOG_TITLE, ERROR_MSG } from "./constant.ts";

type Attributes = Pick<AllHTMLAttributes<Element>, "id">;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes) => ReactElement);
};

export default function WithDialogTitle(
  { children }: Readonly<Props>,
): JSX.Element | never {
  const ids = useContext(IdsContext);

  if (!ids) throw Error(ERROR_MSG);
  const { titleId } = ids;

  if (isFunction(children)) {
    return children({ id: titleId });
  }

  return cloneElement(children, { id: titleId });
}

WithDialogTitle.displayName = ALERT_DIALOG_TITLE;
