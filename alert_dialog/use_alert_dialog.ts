import { defineUseDialog } from "../dialog/_use_dialog.ts";
export type {
  Attributes,
  Contexts,
  Options,
  Params,
  Returns,
} from "../dialog/_use_dialog.ts";

const useDialog = defineUseDialog("alertdialog");
export default useDialog;
