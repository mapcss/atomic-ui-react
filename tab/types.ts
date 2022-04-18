// This module is browser compatible.

import { ReactElement } from "react";
import { TAB, TAB_LIST, TAB_PANEL, TYPE } from "./constant.ts";

export interface TabFC<P = Record<never, never>> {
  // deno-lint-ignore no-explicit-any
  (props: P): ReactElement<any, any> | null;
  [TYPE]: typeof TAB | typeof TAB_LIST | typeof TAB_PANEL;
}

export interface TabElement extends ReactElement {
  type: TabFC;
}
