// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { IdsContext } from "./context.ts";
import { ALERT_DIALOG_DESCRIBE, ERROR_MSG } from "./constant.ts";

type Attributes = Pick<AllHTMLAttributes<Element>, "id">;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes) => ReactElement);
};

export default function WithDialogDescribe(
  { children }: Readonly<Props>,
): JSX.Element | never {
  const ids = useContext(IdsContext);

  if (!ids) throw Error(ERROR_MSG);
  const { describeId } = ids;

  const attributes = { id: describeId };
  const child = isFunction(children)
    ? children(attributes)
    : cloneElement(children, attributes);

  return child;
}

WithDialogDescribe.displayName = ALERT_DIALOG_DESCRIBE;
