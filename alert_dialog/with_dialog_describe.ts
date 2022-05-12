// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { ContextContext, IdMapContext } from "./context.ts";
import { Context } from "./types.ts";

type Attributes = Pick<AllHTMLAttributes<Element>, "id">;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: Context) => ReactElement);
};

export default function WithDialogDescribe({ children }: Props): JSX.Element {
  const { describe: id } = useContext(IdMapContext);
  const renderContext = useContext(ContextContext);

  if (isFunction(children)) {
    return children({ id }, renderContext);
  }

  return cloneElement(children, { id });
}
