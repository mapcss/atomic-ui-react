// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { mergeProps } from "../util.ts";
import { DispatchMap, StateMap } from "./use_disclosure.ts";
import Context from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

type RenderAttributes<T> = Required<Pick<AllHTMLAttributes<T>, "id">>;

type Render<T = unknown> = (
  root: ReactElement,
  attributes: RenderAttributes<T>,
  context: StateMap,
) => ReactElement;

const defaultRender: Render = (root, attributes, { isOpen }) => {
  return isOpen ? cloneElement(root, attributes) : cloneElement(
    root,
    mergeProps(root.props, { ...attributes, style: { display: "none" } }),
  );
};

export type Props<T> = {
  children:
    | ReactElement
    | ((
      attributes: RenderAttributes<T>,
      context: StateMap & DispatchMap,
    ) => ReactElement);

  render?: Render<T>;
};

export default function WithDisclosureTarget<
  E extends Element,
>(
  {
    children,
    render = defaultRender,
  }: Props<E>,
): JSX.Element {
  const context = useContext(Context);
  if (!context) throw Error(ERROR_MSG);

  const [{ isOpen, id }, dispatchMap] = context;

  if (isFunction(children)) {
    return children({ id }, { isOpen, id, ...dispatchMap });
  }

  return render(children, { id }, { isOpen, id });
}
