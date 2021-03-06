// This module is browser compatible.

import { AllHTMLAttributes } from "react";
import { SharedContexts } from "./types.ts";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";

export type Params = SharedContexts;
export type AllAttributesWithContexts = AllAttributesWith<
  [SharedContexts]
>;

export type Returns = [AllHTMLAttributes<Element>, SharedContexts];

export default function useDisclosureContent(
  contexts: Readonly<Params>,
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes, contexts];
}

const defaultId: AttributesHandler<[SharedContexts], "id"> = ({ id }) => id;
const defaultHidden: AttributesHandler<[SharedContexts], "hidden"> = (
  { isOpen },
) => !isOpen;
const defaultAttributes = {
  id: defaultId,
  hidden: defaultHidden,
};
