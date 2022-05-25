// This module is browser compatible.

import useDialog from "./use_dialog.ts";
import defineWithDialog from "./_with_dialog.ts";
export type { Props } from "./_with_dialog.ts";

const WithDialog = defineWithDialog(useDialog);

export default WithDialog;
