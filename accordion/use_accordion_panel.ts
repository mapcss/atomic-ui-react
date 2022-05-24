// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { joinChars, trueOr } from "../util.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
  Targets,
} from "../hooks/use_focus_callback.ts";

export type Params = {
  id: string;
  index: number;
  isOpen: boolean;
  targets: Targets;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "aria-labelledby" | "id" | "hidden"
>;

export type Contexts = UseFocusCallbackReturnValue & {
  headerId: string;

  panelId: string;
};

export type Returns = [Attributes, Contexts];
export default function useAccordionPanel(
  { id, index, isOpen, targets }: Readonly<Params>,
): Returns {
  const headerId = useMemo<string>(
    () => joinChars([id, "accordion", "header", index], "-")!,
    [
      id,
      index,
    ],
  );
  const panelId = useMemo<string>(
    () => joinChars([id, "accordion", "panel", index], "-")!,
    [id, index],
  );

  const { focusFirst, focusLast, focusNext, focusPrev } = useFocusCallback(
    targets,
  );

  const attributes = useMemo<Attributes>(() => ({
    "aria-labelledby": headerId,
    id: panelId,
    hidden: trueOr(!isOpen),
  }), [panelId, headerId, isOpen]);

  const contexts = useMemo<Contexts>(() => ({
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    headerId,
    panelId,
  }), [
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    headerId,
    panelId,
  ]);

  return [attributes, contexts];
}
