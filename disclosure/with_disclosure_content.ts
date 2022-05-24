// This module is browser compatible.

import { cloneElement, ReactElement, useContext } from "react";
import { isFunction } from "../deps.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap, StateMap } from "./types.ts";
import useDisclosureContent, { Attributes } from "./use_disclosure_content.ts";

type Contexts = StateMap & DispatchMap;

export type Props = {
  children:
    | ReactElement
    | ((
      attributes: Attributes,
      contexts: Contexts,
    ) => ReactElement);
};

export default function WithDisclosureContent(
  {
    children,
  }: Readonly<Props>,
): JSX.Element | never {
  const id = useContext(IdContext);
  const stateSet = useContext(BooleanContext);
  if (!stateSet) throw Error(ERROR_MSG);

  const [isOpen, { on: open, off: close, toggle }] = stateSet;
  const attributes = useDisclosureContent({ isOpen, id });
  const contexts: Contexts = {
    open,
    close,
    toggle,
    isOpen,
    id,
  };

  const child = isFunction(children)
    ? children(attributes, contexts)
    : cloneElement(children, attributes);

  return child;
}
