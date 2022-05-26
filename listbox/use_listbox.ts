import { AllHTMLAttributes, useEffect, useMemo } from "react";
import useKeyboardEventHandler from "../hooks/use_keyboard_event_handler.ts";
import { useEventHandler } from "../_shared/hooks.ts";
import { Targets } from "../hooks/use_focus_callback.ts";
import { HasFocusElement } from "../types.ts";
import useDoublyLinkedList, {
  States,
} from "../hooks/use_doubly_linked_list.ts";

export type Params = {
  activeDescendantId: string | undefined;

  targets: Targets;
};

export type Options = {
  onActive: (contexts: States<HasFocusElement>) => void;

  activatedIndex: number;
};
export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "tabIndex" | "aria-activedescendant"
>;

export type Returns = [Attributes];

export default function useListbox(
  { targets, activeDescendantId }: Readonly<Params>,
  { onActive, activatedIndex }: Readonly<Partial<Options>>,
): Returns {
  const [states, { prev, next }] = useDoublyLinkedList({ targets }, {
    initialIndex: activatedIndex,
  });

  useEffect(
    () => {
      if (!states.element) return;
      onActive?.(states);
    },
    [states.element, states.index, onActive],
  );

  const keyboardHandler = useKeyboardEventHandler([
    ["ArrowUp", (ev) => {
      ev.preventDefault();
      prev();
    }],
    ["ArrowDown", (ev) => {
      ev.preventDefault();
      next();
    }],
  ]);

  const keyboardHandlers = useEventHandler(["onKeyDown"], keyboardHandler);

  const attributes = useMemo<Attributes>(() => ({
    role: "listbox",
    tabIndex: 0,
    "aria-activedescendant": activeDescendantId,
    ...keyboardHandlers,
  }), [activeDescendantId, keyboardHandlers]);

  return [attributes];
}

// function updateScroll(parent: Element, child: HTMLElement): void {
//   const selectedOption = child;
//   if (
//     parent.scrollHeight > parent.clientHeight
//   ) {
//     const scrollBottom = parent.clientHeight + parent.scrollTop;
//     const elementBottom = selectedOption.offsetTop +
//       selectedOption.offsetHeight;
//     console.log(2222222);
//     if (elementBottom > scrollBottom) {
//       parent.scrollTop = elementBottom - parent.clientHeight;
//     } else if (selectedOption.offsetTop < parent.scrollTop) {
//       parent.scrollTop = selectedOption.offsetTop;
//     }
//   }
// }

// function isHTMLElement(value: object): value is HTMLElement {
//   return value instanceof HTMLElement;
// }
