// This module is browser compatible.

import { cloneElement, ReactElement, useContext, useMemo } from "react";
import { isFunction, ValueOf } from "../deps.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";
import { useEventHandler, usePreventDefault } from "../_shared/hooks.ts";
import { mergeProps } from "../util.ts";
import {
  AllHandlerMap,
  AllHandlerWithoutKeyBoard,
  KeyboardHandler,
} from "../types.ts";
import useAriaDisclosureControl, {
  ReturnValue as UseAriaDisclosureControlReturnValue,
} from "./use_aria_disclosure_control.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap, StateMap } from "./types.ts";
import useKeyboardEventHandler from "../hooks/use_keyboard_event_handler.ts";

type Attributes = UseAriaDisclosureControlReturnValue & AllHandlerMap;

type Type = "toggle" | "open" | "close";

export type Props = {
  /**
   * @defaultValue [`onClick`]
   */
  on?: Iterable<AllHandlerWithoutKeyBoard>;

  /**
   * @defaultValue [`onKeyDown`]
   */
  onKey?: Iterable<KeyboardHandler>;

  type?: Type;

  children:
    | ReactElement
    | ((
      attributes: Attributes,
      context: StateMap & DispatchMap,
    ) => JSX.Element);
};

export default function WithDisclosureControl(
  { on = ["onClick"], onKey = ["onKeyDown"], type = "toggle", children }:
    Readonly<Props>,
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
  const handlerMap = useEventHandler(on, dispatch);
  const beforeAll = usePreventDefault();
  const keyboardHandler = useKeyboardEventHandler([
    ["Space", dispatch],
    ["Enter", dispatch],
  ], { beforeAll });

  const keyboardHandlerMap = useEventHandler(onKey, keyboardHandler);
  const attributes: Attributes = {
    ...aria,
    ...handlerMap,
    ...keyboardHandlerMap,
  };

  if (isFunction(children)) {
    return children(attributes, {
      ...stateMap,
      ...dispatchMap,
    });
  }

  return cloneElement(
    children,
    mergeProps(children.props, attributes),
  );
}
