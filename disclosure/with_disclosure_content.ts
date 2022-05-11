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

type RenderAttributes = Required<Pick<AllHTMLAttributes<Element>, "id">>;

type Render = (
  root: ReactElement,
  attributes: RenderAttributes,
  context: StateMap,
) => ReactElement;

export const defaultRender: Render = (root, attributes, { isOpen }) => {
  return isOpen ? cloneElement(root, attributes) : cloneElement(
    root,
    mergeProps(root.props, { ...attributes, style: { display: "none" } }),
  );
};

export type Props = {
  children:
    | ReactElement
    | ((
      attributes: RenderAttributes,
      context: StateMap & DispatchMap,
    ) => ReactElement);

  render?: Render;
};

export default function WithDisclosureContent(
  {
    children,
    render = defaultRender,
  }: Props,
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
