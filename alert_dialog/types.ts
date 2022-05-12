// This module is browser compatible.

import {
  ReturnValue as UseFocusCallbackReturnValue,
} from "./use_focus_callback.ts";
export type RenderContext = {
  isShow: boolean;
} & UseFocusCallbackReturnValue;
