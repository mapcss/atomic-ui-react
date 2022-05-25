import WithAlertDialog from "./with_alert_dialog.ts";
import defineDialog from "../dialog/_dialog.ts";
export type { Props } from "../dialog/_dialog.ts";

/** Alert dialog component with accessibility and keyboard interaction.
 * ```tsx
 * import { DialogProvider, AlertDialog } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <DialogProvider>
 *       <AlertDialog isShow></AlertDialog>
 *     </DialogProvider>
 *   );
 * };
 * ```
 */
const AlertDialog = defineDialog(WithAlertDialog);
export default AlertDialog;
