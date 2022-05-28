// This module is browser compatible.

import { HTMLAttributes, KeyboardEvent, useMemo } from "react";
import { SharedContexts } from "./types.ts";
import { AllHandlerMap } from "../types.ts";
import useAttributesWithContext, {
  AllAttributesWithContext,
  AttributesHandler,
} from "../hooks/use_attributes_with_context.ts";
import { mappingKey } from "../util.ts";

export type Params = SharedContexts;

export type Options = {
  /**
   * @default `toggle`
   */
  mutateType?: "toggle" | "on" | "off";
};

export type Attributes =
  & Pick<
    HTMLAttributes<Element>,
    "aria-controls" | "aria-expanded" | "role"
  >
  & AllHandlerMap;

export type AttributesWithContext = AllAttributesWithContext<Contexts, Element>;

export type Contexts = Params & Required<Options> & {
  mutateValue: boolean;
};

export type Returns = [Attributes, Contexts];

export default function useDisclosureControl(
  { setIsOpen, id, isOpen }: Readonly<Params>,
  { mutateType = "toggle" }: Readonly<Partial<Options>>,
  allAttributes: AttributesWithContext,
): Returns {
  const mutateValue = useMemo<boolean>(() => {
    switch (mutateType) {
      case "on": {
        return true;
      }
      case "off": {
        return false;
      }
      case "toggle": {
        return !isOpen;
      }
    }
  }, [isOpen, mutateType]);

  const contexts = useMemo<Contexts>(
    () => ({ setIsOpen, id, isOpen, mutateType, mutateValue }),
    [
      setIsOpen,
      id,
      isOpen,
      mutateType,
      mutateValue,
    ],
  );

  const attributes = useAttributesWithContext({
    attributes: { ...defaultAttributes, ...allAttributes },
    context: contexts,
  });

  return [attributes, contexts];
}

const defaultOnKeyDown: AttributesHandler<Contexts, "onKeyDown"> = (
  ev,
  { setIsOpen, mutateValue },
) => {
  const runner = mappingKey<KeyboardEvent>([
    ["Space", (ev) => {
      ev.preventDefault();
      setIsOpen(mutateValue);
    }],
    ["Enter", (ev) => {
      ev.preventDefault();
      setIsOpen(mutateValue);
    }],
  ]);
  runner(ev);
};
const defaultOnClick: AttributesHandler<Contexts, "onClick"> = (
  _,
  { setIsOpen, mutateValue },
) => setIsOpen(mutateValue);
const defaultRole: AttributesHandler<Contexts, "role"> = "button";
const defaultAriaControls: AttributesHandler<Contexts, "aria-controls"> = (
  { id },
) => id;
const defaultAriaExpanded: AttributesHandler<Contexts, "aria-expanded"> = (
  { isOpen },
) => isOpen;

const defaultAttributes = {
  "aria-controls": defaultAriaControls,
  "aria-expanded": defaultAriaExpanded,
  role: defaultRole,
  onKeyDown: defaultOnKeyDown,
  onClick: defaultOnClick,
};
