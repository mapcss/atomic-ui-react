// This module is browser compatible.

import { ReactElement, useContext } from "react";
import useToolbar, {
  AllAttributesWithContexts,
  Returns,
} from "./use_toolbar.ts";
import { CommonContextsContext, FocusStrategyContext } from "./context.ts";
import { ERROR_MSG } from "./constants.ts";

export type Props =
  & {
    children: (
      attributes: Returns[0],
      contexts: Returns[1],
    ) => ReactElement;
  }
  & Partial<AllAttributesWithContexts>;

export default function WithToolbar(
  {
    children,
    ...allAttributes
  }: Readonly<
    Props
  >,
): JSX.Element {
  const commonContexts = useContext(CommonContextsContext);
  const focusStrategy = useContext(FocusStrategyContext);

  if (!commonContexts) throw Error(ERROR_MSG);

  const [attributes, contexts] = useToolbar(
    commonContexts,
    { focusStrategy },
    allAttributes,
  );

  return children(attributes, contexts);
}
