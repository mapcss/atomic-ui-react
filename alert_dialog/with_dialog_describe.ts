// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { IdMapContext, RenderContextContext } from "./context.ts";
import { RenderContext } from "./types.ts";

type Attributes = Pick<AllHTMLAttributes<Element>, "id">;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: RenderContext) => ReactElement);
};

export default function WithDialogDescribe({ children }: Props): JSX.Element {
  const { describe: id } = useContext(IdMapContext);
  const renderContext = useContext(RenderContextContext);

  if (isFunction(children)) {
    return children({ id }, renderContext);
  }

  return cloneElement(children, { id });
}
