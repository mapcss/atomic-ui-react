// This module is browser compatible.

import { HTMLAttributes, useMemo } from "react";
import { StateMap } from "./types.ts";
import { VFn } from "../deps.ts";
import {
  AllHandlerMap,
  AllHandlerWithoutKeyBoard,
  KeyboardHandler,
} from "../types.ts";
import { KeyEntries } from "../hooks/use_keyboard_event_handler.ts";
import { useEventHandler, usePreventDefault } from "../_shared/hooks.ts";
import useKeyboardEventHandler from "../hooks/use_keyboard_event_handler.ts";

export type Params = {
  dispatch: VFn;
} & StateMap;

export type Attributes =
  & Pick<
    HTMLAttributes<Element>,
    "aria-controls" | "aria-expanded" | "role"
  >
  & AllHandlerMap;

export type Options = {
  /**
   * @defaultValue [`onClick`]
   */
  on: Iterable<AllHandlerWithoutKeyBoard>;

  /**
   * @defaultValue [`onKeyDown`]
   */
  onKey: Iterable<KeyboardHandler>;

  /**
   * @defaultValue {@link defaultKeyEntries}
   */
  keyEntries: (contexts: Contexts) => KeyEntries;
};

export type Contexts = {
  dispatch: VFn;
} & StateMap;

export type Returns = [Attributes, Contexts];

export default function useDisclosureControl(
  { dispatch, id, isOpen }: Readonly<Params>,
  {
    on = ["onClick"],
    onKey = ["onKeyDown"],
    keyEntries = defaultKeyEntries,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const contexts = useMemo<Contexts>(() => ({ dispatch, id, isOpen }), [
    dispatch,
  ]);

  const handlers = useEventHandler(on, dispatch);

  const entries = useMemo<KeyEntries>(() => keyEntries(contexts), [
    keyEntries,
    contexts.id,
    contexts.dispatch,
    contexts.isOpen,
  ]);

  const beforeAll = usePreventDefault();
  const keyboardHandler = useKeyboardEventHandler(entries, { beforeAll });
  const keyboardHandlers = useEventHandler(onKey, keyboardHandler);

  const attributes = useMemo<Attributes>(() => {
    return {
      "aria-controls": id,
      "aria-expanded": isOpen,
      role: "button",
      ...handlers,
      ...keyboardHandlers,
    };
  }, [id, isOpen, keyboardHandlers, handlers]);

  return [attributes, contexts];
}

export function defaultKeyEntries({ dispatch }: Contexts): KeyEntries {
  return [
    ["Space", dispatch],
    ["Enter", dispatch],
  ];
}
