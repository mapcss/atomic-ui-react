// This module is browser compatible.

import { createElement, ReactNode } from "react";
import useId from "../hooks/use_id.ts";
import useBoolean from "../hooks/use_boolean.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";

export type Props = {
  children: ReactNode;

  /** Default state of `isOpen`.
   * @default false
   */
  isDefaultOpen?: boolean;
};

export default function DisclosureProvider(
  { children, isDefaultOpen }: Props,
): JSX.Element {
  const { id } = useId();
  const stateSet = useBoolean(isDefaultOpen);

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(BooleanContext.Provider, { value: stateSet }, children),
  );
}
