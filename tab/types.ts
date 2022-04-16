import { ReactElement } from "react";
import { TYPE } from "./constant.ts";

export interface TabFC<P = Record<never, never>> {
  // deno-lint-ignore no-explicit-any
  (props: P): ReactElement<any, any> | null;
  [TYPE]: symbol;
}

export interface TabElement extends ReactElement {
  type: TabFC;
}
