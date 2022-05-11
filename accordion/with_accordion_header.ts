// This module is browser compatible.

import {
  cloneElement,
  EventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useEventHandler } from "../_shared/hooks.ts";
import { KeyEntries, mappingKey } from "../_shared/util.ts";
import { joinChars } from "../util.ts";
import { AllHandlerWithoutKeyBoard, KeyboardHandler } from "../types.ts";
import {
  HeaderCountContext,
  IdContext,
  IndexContext,
  RefsContext,
} from "./context.ts";
import useAriaAccordionHeader from "./use_aria_accordion_header.ts";
import useCallbackFocus from "./use_callback_focus.ts";

export type Props = {
  children: ReactElement;

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
  const { prev, first, next, last } = useCallbackFocus({ refs, index });

  const keyEntries = useMemo<KeyEntries>(() =>
    mapCodeEntries(codeEntries, {
      prev,
      first,
      next,
      last,
      open,
    }), [JSON.stringify(codeEntries), prev, first, next, last, open]);

  const keyboardHandler = useCallback<KeyboardEventHandler>(
    mappingKey(keyEntries),
    [JSON.stringify(keyEntries)],
  );
  const keyHandlerMap = useEventHandler(onKey, keyboardHandler);

  const headerId = joinChars([id, "accordion", "header", index], "-");
  const panelId = joinChars([id, "accordion", "panel", index], "-");
  const aria = useAriaAccordionHeader({ id: headerId, panelId, isOpen });

  return cloneElement(children, {
    ref,
    ...aria,
    ...handlerMap,
    ...keyHandlerMap,
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
