import WithDialog from "./with_dialog.ts";
import defineDialog from "./_dialog.ts";
export type { Props } from "./_dialog.ts";

/** Dialog component with accessibility and keyboard interaction.
 * ```tsx
 * import { Dialog } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *      <Dialog initialIsShow></Dialog>
 *   );
 * };
 * ```
 */
const Dialog = defineDialog(WithDialog);
export default Dialog;
