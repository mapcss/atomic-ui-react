// This module is browser compatible.

import { AllHTMLAttributes } from "react";
import { SharedContexts } from "./types.ts";
import useAttributesWithContext, {
  AllAttributesWithContext,
  AttributesHandler,
} from "../hooks/use_attributes_with_context.ts";

export type Params = SharedContexts;
export type AttributesWithContext = AllAttributesWithContext<
  SharedContexts,
  Element
>;

export type Attributes = Pick<AllHTMLAttributes<Element>, "id" | "hidden">;

export type Returns = [Attributes, SharedContexts];

export default function useDisclosureContent(
  contexts: Readonly<Params>,
  allAttributes: AttributesWithContext,
): Returns {
  const attributes = useAttributesWithContext({
    attributes: { ...defaultAttributes, ...allAttributes },
    context: contexts,
  });

  return [attributes, contexts];
}

const defaultId: AttributesHandler<SharedContexts, "id"> = ({ id }) => id;
const defaultHidden: AttributesHandler<SharedContexts, "hidden"> = (
  { isOpen },
) => !isOpen;
const defaultAttributes = {
  id: defaultId,
  hidden: defaultHidden,
};
