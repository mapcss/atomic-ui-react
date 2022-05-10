// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { mergeProps } from "../util.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap, StateMap } from "./types.ts";

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

export default function WithDisclosureContent<
  E extends Element,
>(
  {
    children,
    render = defaultRender,
  }: Props<E>,
): JSX.Element {
  const id = useContext(IdContext);
  const stateSet = useContext(BooleanContext);
  if (!stateSet) throw Error(ERROR_MSG);

  const [isOpen, { on: open, off: close, toggle }] = stateSet;
  const stateMap: StateMap = { isOpen, id };
  const dispatchMap: DispatchMap = { open, close, toggle };

  if (isFunction(children)) {
    return children({ id }, { ...stateMap, ...dispatchMap });
  }

  return render(children, { id }, stateMap);
}
