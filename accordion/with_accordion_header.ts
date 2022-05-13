// This module is browser compatible.

import {
  cloneElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import { useEventHandler, usePreventDefault } from "../_shared/hooks.ts";
import { joinChars, mergeProps } from "../util.ts";
import useKeyboardEventHandler, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
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
import useAriaAccordionHeader, {
  ReturnValue as UseAriaAccordionHeaderReturnValue,
} from "./use_aria_accordion_header.ts";
import useCallbackFocus from "./use_callback_focus.ts";
import useChildRef from "../hooks/use_child_ref.ts";
import { Context } from "./types.ts";

type Attributes =
  & AllHandlerMap
  & UseAriaAccordionHeaderReturnValue;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: Context) => ReactElement);

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

  const handlerMap = useEventHandler(on, open);
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

  const beforeAll = usePreventDefault();
  const keyboardHandler = useKeyboardEventHandler(entries, { beforeAll });
  const keyHandlerMap = useEventHandler(onKey, keyboardHandler);

  const headerId = joinChars([id, "accordion", "header", index], "-");
  const panelId = joinChars([id, "accordion", "panel", index], "-");
  const aria = useAriaAccordionHeader({ id: headerId, panelId, isOpen });

  const attributes = useMemo<Attributes>(() => ({
    ...aria,
    ...handlerMap,
    ...keyHandlerMap,
  }), [
    JSON.stringify(aria),
    handlerMap,
    keyHandlerMap,
  ]);

  const child = isFunction(children)
    ? children(attributes, ctx)
    : cloneElement(children, mergeProps(children.props, attributes));

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
