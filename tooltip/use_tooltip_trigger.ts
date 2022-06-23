import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { IsShowProps } from "./types.ts";

type Contexts = IsShowProps;

export type AttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export default function useTooltipTrigger(
  contexts: Contexts,
  allAttributes: AttributesWithContexts = {},
) {
  const attributes = useAttributesWith<[Contexts]>([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes];
}

const defaultAttributes: AttributesWithContexts = {
  tabIndex: 0,
  onFocus: (ev, { setIsShow }) => {
    ev.preventDefault();
    setIsShow(true);
  },
  onBlur: (ev, { setIsShow }) => {
    ev.preventDefault();
    setIsShow(false);
  },
};
