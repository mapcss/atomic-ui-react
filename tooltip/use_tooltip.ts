import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { IsShowProps } from "./types.ts";

export type AttributesWithContexts = Partial<AllAttributesWith<[IsShowProps]>>;

export default function useTooltip(
  contexts: Readonly<IsShowProps>,
  allAttributes: AttributesWithContexts = {},
) {
  const attributes = useAttributesWith<[IsShowProps]>([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes];
}

const defaultAttributes: AttributesWithContexts = {
  role: "tooltip",
  hidden: ({ isShow }) => !isShow,
  style: {
    position: "absolute",
  },
};
