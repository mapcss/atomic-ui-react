// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent } from "react";
import useAttributesWith, {
  AllAttributesWith,
} from "../hooks/use_attributes_with.ts";
import { mappingKey } from "../util.ts";
import useUpdateEffect from "../hooks/use_update_effect.ts";
import { IsCheckedProps } from "./types.ts";

export type Options = {
  /** Call on `isChecked` is mutated with contexts. */
  onIsCheckChange: (contexts: Contexts) => void;
};

export type Contexts = IsCheckedProps;

export type AllAttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useSwitch(
  { isChecked, setIsChecked }: Readonly<IsCheckedProps>,
  { onIsCheckChange }: Readonly<Partial<Options>> = {},
  allAttributesWith: AllAttributesWithContexts = {},
): Returns {
  const contexts: Contexts = {
    isChecked,
    setIsChecked,
  };

  useUpdateEffect(() => {
    onIsCheckChange?.(contexts);
  }, [contexts.isChecked]);

  const attributes = useAttributesWith(
    [contexts],
    { ...defaultAttributes, ...allAttributesWith },
  );

  return [attributes, contexts];
}

const defaultAttributes: Pick<
  AllAttributesWith<[Contexts]>,
  DefaultAttribute
> = {
  onClick: (_, { isChecked, setIsChecked }) => setIsChecked(!isChecked),
  onKeyDown: (ev, { isChecked, setIsChecked }) => {
    const toggle = () => {
      ev.preventDefault();
      setIsChecked(!isChecked);
    };
    mappingKey<KeyboardEvent>([
      ["Space", toggle],
      ["Enter", toggle],
    ])(ev);
  },
  role: "switch",
  tabIndex: 0,
  "aria-checked": ({ isChecked }) => isChecked,
};

export type DefaultAttribute =
  | "role"
  | "tabIndex"
  | "onClick"
  | "onKeyDown"
  | "aria-checked";
