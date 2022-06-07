import { MutableRefObject, RefObject } from "react";
import { ActiveIndexProps } from "../_shared/types.ts";

export type IsOpenProps = {
  isOpen: boolean;

  setIsOpen: (isOpen: boolean) => void;
};

export type CommonContexts = IsOpenProps & ActiveIndexProps & {
  menuItemsRef: MutableRefObject<RefObject<Element>[]>;
  menuTriggerRef: RefObject<Element>;
  menuRef: RefObject<Element>;
};
