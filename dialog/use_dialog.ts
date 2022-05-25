// This module is browser compatible.

import { defineUseDialog } from "./_use_dialog.ts";
export type {
  Attributes,
  Contexts,
  Options,
  Params,
  Returns,
} from "./_use_dialog.ts";

const useDialog = defineUseDialog("dialog");
export default useDialog;
