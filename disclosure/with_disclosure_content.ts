// This module is browser compatible.

import { ReactElement, useContext } from "react";
import { IdContext, OpenContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";
import { SharedContexts } from "./types.ts";
import useDisclosureContent, {
  Attributes,
  AttributesWithContext,
} from "./use_disclosure_content.ts";

export type Props = {
  children: (
    attributes: Attributes,
    contexts: SharedContexts,
  ) => ReactElement;
} & Omit<AttributesWithContext, "children">;

export default function WithDisclosureContent(
  {
    children,
    ...allAttributes
  }: Readonly<Props>,
): JSX.Element | never {
  const id = useContext(IdContext);
  const stateSet = useContext(OpenContext);
  if (!id || !stateSet) throw Error(ERROR_MSG);

  const [isOpen, setIsOpen] = stateSet;
  const [attributes, contexts] = useDisclosureContent(
    { isOpen, id, setIsOpen },
    allAttributes,
  );

  return children(attributes, contexts);
}
