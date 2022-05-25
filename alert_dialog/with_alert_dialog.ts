import useAlertDialog from "./use_alert_dialog.ts";
import defineWithDialog from "../dialog/_with_dialog.ts";
export type { Props } from "../dialog/_with_dialog.ts";

const WithAlertDialog = defineWithDialog(useAlertDialog);

export default WithAlertDialog;
