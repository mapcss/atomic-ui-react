// This module is browser compatible.

import {
  cloneElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import { mergeProps } from "../util.ts";
import { KeyEntries } from "../hooks/use_keyboard_event_handler.ts";
import {
  AllHandlerMap,
  AllHandlerWithoutKeyBoard,
  KeyboardHandler,
} from "../types.ts";
import {
  HeaderCountContext,
  IdContext,
  IndexContext,
  RefsContext,
} from "./context.ts";
import useCallbackFocus from "./use_callback_focus.ts";
import useChildRef from "../hooks/use_child_ref.ts";
import useAttributesAccordionHeader, {
  Attributes,
} from "./use_attributes_accordion_header.ts";
import { useEventHandler, usePreventDefault } from "../_shared/hooks.ts";
import useKeyboardEventHandler from "../hooks/use_keyboard_event_handler.ts";
import { Context } from "./types.ts";

type HTMLAttributes = Attributes | AllHandlerMap;

export type Props = {
  children:
    | ReactElement
    | ((
      htmlAttributes: HTMLAttributes,
      context: Context,
    ) => ReactElement);

  on?: Iterable<AllHandlerWithoutKeyBoard>;

  onKey?: Iterable<KeyboardHandler>;

  /**
   * @defaultValue {@link defaultKeyEntries}
   */
  keyEntries?: (context: Context) => KeyEntries;
};

export default function WithAccordionHeader(
  {
    children,
    on = ["onClick"],
    onKey = ["onKeyDown"],
    keyEntries = defaultKeyEntries,
  }: Props,
): JSX.Element {
  const id = useContext(IdContext);
  const [selectedIndex, setSelectedIndex] = useContext(IndexContext);
  const tempId = useContext(HeaderCountContext);
  const refs = useContext(RefsContext);
  const index = tempId.next;

  const isOpen = useMemo<boolean>(() => index === selectedIndex, [
    index,
    selectedIndex,
  ]);

  const open = useCallback<() => void>(() => setSelectedIndex(index), [
    setSelectedIndex,
    index,
  ]);

  const { focusFirst, focusLast, focusNext, focusPrev } = useCallbackFocus({
    refs,
    index,
  });

  const ctx: Context = {
    isOpen,
    open,
    index,
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
  };

  const entries = useMemo<KeyEntries>(() => keyEntries(ctx), [
    keyEntries,
    JSON.stringify(ctx),
  ]);

  const attributes = useAttributesAccordionHeader({
    id,
    index,
    isOpen,
  });

  const handlerMap = useEventHandler(on, open);
  const beforeAll = usePreventDefault();
  const keyboardHandler = useKeyboardEventHandler(entries, { beforeAll });
  const keyHandlerMap = useEventHandler(onKey, keyboardHandler);
  const htmlAttributes: HTMLAttributes = {
    ...attributes,
    ...handlerMap,
    ...keyHandlerMap,
  };

  const child = isFunction(children)
    ? children(htmlAttributes, ctx)
    : cloneElement(children, mergeProps(children.props, htmlAttributes));

  const [getRef, setRef] = useChildRef(child);
  refs.push(getRef);

  return cloneElement(child, { ref: setRef });
}

const defaultKeyEntries: (context: Context) => KeyEntries = (
  { focusFirst, focusLast, focusNext, focusPrev, open },
) => [
  ["ArrowUp", focusPrev],
  ["ArrowDown", focusNext],
  ["Enter", open],
  ["Space", open],
  ["Home", focusFirst],
  ["End", focusLast],
];
