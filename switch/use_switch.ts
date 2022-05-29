// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent } from "react";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { mappingKey } from "../util.ts";

export type Params = {
  /** Whether or not the switch is checked. */
  isChecked: boolean;

  /** The function to call when the switch is toggled. */
  onValueChange: (isChecked: boolean) => void;
};

export type Contexts = Params;

export type AllAttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useSwitch(
  { isChecked, onValueChange }: Readonly<Params>,
  allAttributesWith: AllAttributesWithContexts = {},
): Returns {
  const contexts: Contexts = {
    isChecked,
    onValueChange,
  };

  const attributes = useAttributesWith(
    [contexts],
    { ...defaultAttributes, ...allAttributesWith },
  );

  return [attributes, contexts];
}

const defaultOnKeyDown: AttributesHandler<[Contexts], "onKeyDown"> = (
  ev,
  { isChecked, onValueChange },
) => {
  const toggle = () => {
    ev.preventDefault();
    onValueChange(!isChecked);
  };
  mappingKey<KeyboardEvent>([
    ["Space", toggle],
    ["Enter", toggle],
  ])(ev);
};

const defaultOnClick: AttributesHandler<[Contexts], "onClick"> = (
  _,
  { isChecked, onValueChange },
) => onValueChange(!isChecked);

const defaultAriaChecked: AttributesHandler<[Contexts], "aria-checked"> = (
  { isChecked },
) => isChecked;

const defaultAttributes: Pick<
  AllAttributesWith<[Contexts]>,
  DefaultAttribute
> = {
  onClick: defaultOnClick,
  onKeyDown: defaultOnKeyDown,
  role: "switch",
  tabIndex: 0,
  "aria-checked": defaultAriaChecked,
};

type DefaultAttribute =
  | "role"
  | "tabIndex"
  | "onClick"
  | "onKeyDown"
  | "aria-checked";
