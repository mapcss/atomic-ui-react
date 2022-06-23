// This module is browser compatible.

import { createElement, ReactNode } from "react";
import { IdContext, OpenContext } from "./context.ts";
import { useId, useStateSet, useUpdateEffect } from "../hooks/mod.ts";
import { StateSet } from "../types.ts";
import { SharedContexts } from "./types.ts";
import { Exclusive } from "../util.ts";

export type Props =
  & {
    children?: ReactNode;

    onIsOpenChange?: (contexts: SharedContexts) => void;
  }
  & Exclusive<{
    isOpenSet: StateSet<boolean>;
  }, {
    /** Default state of `isOpen`
     * @default false
     */
    initialIsOpen?: boolean;
  }>;

export default function DisclosureProvider(
  {
    children,
    onIsOpenChange,
    initialIsOpen = false,
    isOpenSet,
  }: Readonly<Props>,
): JSX.Element {
  const { id } = useId();

  const [isOpen, setIsOpen] = useStateSet(initialIsOpen, isOpenSet);

  useUpdateEffect(
    () => {
      onIsOpenChange?.({
        id,
        isOpen,
        setIsOpen,
      });
    },
    [isOpen],
  );

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(OpenContext.Provider, {
      value: [isOpen, setIsOpen],
    }, children),
  );
}
