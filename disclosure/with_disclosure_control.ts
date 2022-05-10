// This module is browser compatible.

import {
  cloneElement,
  DOMAttributes,
  ReactElement,
  useContext,
  useMemo,
} from "react";
import { isFunction, ValueOf } from "../deps.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";
import { mergeProps } from "../util.ts";
import { AllHandler } from "../types.ts";
import useAriaDisclosureControl, {
  ReturnValue,
} from "./use_aria_disclosure_control.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap, StateMap } from "./types.ts";

type Type = "toggle" | "open" | "close";

type RenderAttributes<H extends AllHandler, E extends Element = Element> =
  & ReturnValue
  & Pick<DOMAttributes<E>, H>;

export type Props<H extends AllHandler, E extends Element = Element> = {
  on?: Iterable<H>;

  type?: Type;

  children:
    | ReactElement
    | ((
      attributes: RenderAttributes<H, E>,
      context: StateMap & DispatchMap,
    ) => JSX.Element);
};

export default function WithDisclosureControl<
  E extends Element,
  H extends AllHandler = "onClick",
>(
  { on = ["onClick"] as H[], type = "toggle", children }: Readonly<Props<H, E>>,
): JSX.Element {
  const id = useContext(IdContext);
  const stateSet = useContext(BooleanContext);

  if (!stateSet) throw Error(ERROR_MSG);

  const [isOpen, { on: open, off: close, toggle }] = stateSet;
  const stateMap: StateMap = { isOpen, id };
  const dispatchMap: DispatchMap = { open, close, toggle };
  const dispatch = useMemo<ValueOf<DispatchMap>>(() => dispatchMap[type], [
    type,
  ]);

  const aria = useAriaDisclosureControl(stateMap);

  const handlerMap = useMemo<Pick<DOMAttributes<E>, H>>(() => {
    return Array.from(on).reduce((acc, cur) => {
      return { ...acc, [cur]: dispatch };
    }, {} as Pick<DOMAttributes<E>, H>);
  }, [JSON.stringify(on), JSON.stringify(dispatch)]);

  if (isFunction(children)) {
    return children({ ...aria, ...handlerMap }, {
      ...stateMap,
      ...dispatchMap,
    });
  }

  return cloneElement(
    children,
    mergeProps(children.props, { ...aria, ...handlerMap }),
  );
}
