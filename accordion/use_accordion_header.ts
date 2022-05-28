// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { joinChars, KeyEntries } from "../util.ts";
import { VFn } from "../deps.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
  Targets,
} from "../hooks/use_focus_callback.ts";
import { AllHandlerWithoutKeyBoard, KeyboardHandler } from "../types.ts";
import useKeyboardEventHandler from "../hooks/use_keyboard_event_handler.ts";
import { useEventHandler, usePreventDefault } from "../_shared/hooks.ts";

export type Params = {
  isOpen: boolean;
  id: string;
  index: number;
  targets: Targets;
  open: VFn;
};

export type Options = {
  on: Iterable<AllHandlerWithoutKeyBoard>;

  onKey: Iterable<KeyboardHandler>;

  keyEntries: (contexts: Contexts) => KeyEntries;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "aria-expanded" | "aria-controls" | "id" | "tabIndex"
>;

export type Contexts =
  & {
    headerId: string;

    panelId: string;
  }
  & UseFocusCallbackReturnValue
  & Params;

export type Returns = [Attributes, Contexts];

export default function useAccordionHeader(
  { isOpen, id, index, targets, open }: Readonly<Params>,
  { on = ["onClick"], onKey = ["onKeyDown"], keyEntries = defaultKeyEntries }:
    Readonly<
      Partial<Options>
    > = {},
): Returns {
  const headerId = useMemo<string>(
    () => joinChars([id, "accordion", "header", index], "-")!,
    [id, index],
  );
  const panelId = useMemo<string>(
    () => joinChars([id, "accordion", "panel", index], "-")!,
    [id, index],
  );

  const { focusFirst, focusLast, focusNext, focusPrev } = useFocusCallback(
    targets,
  );

  const contexts = useMemo<Contexts>(
    () => ({
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      headerId,
      panelId,
      isOpen,
      id,
      index,
      targets,
      open,
    }),
    [
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      headerId,
      panelId,
      isOpen,
      id,
      index,
      targets,
      open,
    ],
  );

  const entries = useMemo<KeyEntries>(() => keyEntries(contexts), [
    keyEntries,
    JSON.stringify(contexts),
  ]);
  const beforeAll = usePreventDefault();
  const keyboardHandler = useKeyboardEventHandler(entries, { beforeAll });
  const handlers = useEventHandler(on, open);
  const keyboardHandlers = useEventHandler(onKey, keyboardHandler);

  const attributes = useMemo<Attributes>(() => ({
    "aria-expanded": isOpen,
    "aria-controls": panelId,
    id: headerId,
    tabIndex: 0,
    ...handlers,
    ...keyboardHandlers,
  }), [isOpen, panelId, headerId, handlers, keyboardHandlers]);

  return [attributes, contexts];
}

function defaultKeyEntries(
  { focusFirst, focusLast, focusNext, focusPrev, open }: Contexts,
): KeyEntries {
  return [
    ["ArrowUp", focusPrev],
    ["ArrowDown", focusNext],
    ["Enter", open],
    ["Space", open],
    ["Home", focusFirst],
    ["End", focusLast],
  ];
}
