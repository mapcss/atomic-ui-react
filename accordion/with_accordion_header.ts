// This module is browser compatible.

import {
  cloneElement,
  EventHandler,
  KeyboardEvent,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { isFunction } from "../deps.ts";
import { useEventHandler } from "../_shared/hooks.ts";
import { joinChars, mergeProps } from "../util.ts";
import useKeyboardEventHandler, {
  Param as KeyEntries,
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
import useCallbackFocus, {
  ReturnValue as UseCallbackFocusReturnValue,
} from "./use_callback_focus.ts";

type Attributes =
  & AllHandlerMap
  & UseAriaAccordionHeaderReturnValue;

type Context = {
  isOpen: boolean;
  open: () => void;
  index: number;
} & UseCallbackFocusReturnValue;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: Context) => ReactElement);

  on?: Iterable<AllHandlerWithoutKeyBoard>;

  onKey?: Iterable<KeyboardHandler>;
};

export default function WithAccordionHeader(
  { children, on = ["onClick"], onKey = ["onKeyDown"] }: Props,
): JSX.Element {
  const id = useContext(IdContext);
  const [selectedIndex, setSelectedIndex] = useContext(IndexContext);
  const tempId = useContext(HeaderCountContext);
  const refs = useContext(RefsContext);
  const ref = useRef<HTMLElement>(null);

  const index = tempId.next;
  refs.push(ref);

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

  const keyEntries = useMemo<KeyEntries>(() =>
    mapCodeEntries(codeEntries, {
      prev: focusPrev,
      first: focusFirst,
      next: focusNext,
      last: focusLast,
      open,
    }), [
    JSON.stringify(codeEntries),
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    open,
  ]);

  const beforeAll = usePreventDefault();
  const keyboardHandler = useKeyboardEventHandler(keyEntries, { beforeAll });
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

  if (isFunction(children)) {
    return children(attributes, {
      isOpen,
      open,
      index,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
    });
  }

  return cloneElement(children, {
    ref,
    ...mergeProps(children.props, attributes),
  });
}

type InteractionType = "prev" | "next" | "first" | "last" | "open";

type CodeCallbackMap = { [k in string]: EventHandler<KeyboardEvent<Element>> };

type CodeEntries = [string | Partial<KeyboardEvent>, InteractionType][];

const codeEntries: CodeEntries = [
  ["ArrowUp", "prev"],
  ["ArrowDown", "next"],
  ["Enter", "open"],
  ["Space", "open"],
  ["Home", "first"],
  ["End", "last"],
];

function mapCodeEntries(
  codeEntries: CodeEntries,
  codeCallbackMap: CodeCallbackMap,
): KeyEntries {
  return codeEntries.map((
    [codeEntry, type],
  ) => [codeEntry, codeCallbackMap[type]]);
}

function usePreventDefault(): (event: SyntheticEvent<Element, Event>) => void {
  return useCallback<EventHandler<SyntheticEvent<Element>>>((ev) => {
    ev.preventDefault();
  }, []);
}
