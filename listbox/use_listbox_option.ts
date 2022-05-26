import { AllHTMLAttributes, useMemo } from "react";
import { useEventHandler } from "../_shared/hooks.ts";
import { booleanish } from "../util.ts";
import { AllHandlerMap } from "../types.ts";

export type Params = {
  isSelect: boolean;

  id: string;
};

export type Options = {
  onSelect: () => void;
};

export type Attributes =
  & Pick<
    AllHTMLAttributes<Element>,
    "role" | "tabIndex" | "aria-selected" | "id"
  >
  & AllHandlerMap;

export type Returns = [Attributes];

export default function useListbox(
  { id, isSelect }: Readonly<Params>,
  { onSelect = () => {} }: Readonly<Partial<Options>>,
): Returns {
  const handler = useEventHandler(["onClick"], onSelect);

  const attributes = useMemo<Attributes>(() => ({
    role: "option",
    tabIndex: -1,
    id,
    "aria-selected": booleanish(isSelect),
    ...handler,
  }), [id, isSelect]);

  return [attributes];
}
