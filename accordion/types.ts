import {
  ReturnValue as UseCallbackFocusReturnValue,
} from "./use_callback_focus.ts";

export type Context = {
  isOpen: boolean;
  open: () => void;
  index: number;
} & UseCallbackFocusReturnValue;
