// This module is browser compatible.

import { createElement, ReactNode } from "react";
import Context from "./context.ts";
import useDisclosure from "./use_disclosure.ts";

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
  const stateSet = useDisclosure(isDefaultOpen);
  return createElement(Context.Provider, { value: stateSet }, children);
}
