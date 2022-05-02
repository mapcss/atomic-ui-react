// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
  Ref,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { DispatchMap, StateMap } from "./use_disclosure.ts";
import Context from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

type RenderAttributes<T> = Required<Pick<AllHTMLAttributes<T>, "id">>;
type RenderContext = StateMap & DispatchMap;

export type Props<T> = {
  children:
    | ReactElement
    | ((
      attributes: RenderAttributes<T>,
      context: RenderContext,
    ) => JSX.Element);

  /**
   * @default { display: "none"}
   */
  closedStyle?: CSSProperties;
};

function _WithDisclosureTarget<
  E extends Element,
>(
  {
    closedStyle = { display: "none" },
    children,
  }: Props<E>,
  ref: Ref<E>,
): JSX.Element {
  const context = useContext(Context);
  if (!context) throw Error(ERROR_MSG);

  const [{ isOpen, id }, dispatchMap] = context;

  if (isFunction(children)) {
    return children({ id }, { isOpen, id, ...dispatchMap });
  }

  if (isOpen) {
    return cloneElement(children, { id, ref });
  }

  const style = { ...children.props.style, ...closedStyle };
  return cloneElement(children, { id, style, ref });
}

const WithDisclosureTarget = forwardRef(_WithDisclosureTarget);
export default WithDisclosureTarget;
