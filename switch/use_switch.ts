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

  /** Dispatch function of `isChecked`. */
  setIsChecked: (isChecked: boolean) => void;
};

export type Contexts = Params;

export type AllAttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useSwitch(
  { isChecked, setIsChecked }: Readonly<Params>,
  allAttributesWith: AllAttributesWithContexts = {},
): Returns {
  const contexts: Contexts = {
    isChecked,
    setIsChecked,
  };

  const attributes = useAttributesWith(
    [contexts],
    { ...defaultAttributes, ...allAttributesWith },
  );

  return [attributes, contexts];
}

const defaultOnKeyDown: AttributesHandler<[Contexts], "onKeyDown"> = (
  ev,
  { isChecked, setIsChecked },
) => {
  const toggle = () => {
    ev.preventDefault();
    setIsChecked(!isChecked);
  };
  mappingKey<KeyboardEvent>([
    ["Space", toggle],
    ["Enter", toggle],
  ])(ev);
};

const defaultOnClick: AttributesHandler<[Contexts], "onClick"> = (
  _,
  { isChecked, setIsChecked },
) => setIsChecked(!isChecked);

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
