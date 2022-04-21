// This module is browser compatible.

import { ReactElement } from "react";
import { TAB, TAB_LIST, TAB_PANEL, TYPE } from "./constant.ts";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

export interface TabLikeComponent<P = Record<never, never>> {
  // deno-lint-ignore no-explicit-any
  (props: P): ReactElement<any, any> | null;
  [TYPE]: typeof TAB | typeof TAB_LIST | typeof TAB_PANEL;
}

export interface TabElement extends ReactElement {
  type: TabLikeComponent;
}
