import { RefObject } from "react";
import { MutableRefObject } from "react";
import { ActiveIndexProps, SelectIndexProps } from "../_shared/types.ts";

export type CommonContexts =
  & {
    tabsRef: MutableRefObject<RefObject<Element>[]>;
    tabPanelsRef: MutableRefObject<RefObject<Element>[]>;
  }
  & ActiveIndexProps
  & SelectIndexProps;
