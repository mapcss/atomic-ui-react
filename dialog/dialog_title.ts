import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
  useContext,
} from "react";
import { AsProps, Tag } from "../types.ts";
import WithDialogTitle, {
  Props as WithDialogTitleProps,
} from "./with_dialog_title.ts";
import { IdsContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

export type Props<As extends Tag> =
  & AsProps<As>
  & Omit<WithDialogTitleProps, "id" | "children">
  & {
    children?: ReactNode;
  };

function _DialogTitle<As extends Tag = "h3">(
  {
    as = "h3" as As,
    children,
  }: Props<As>,
  ref: Ref<Element>,
): JSX.Element | never {
  const ids = useContext(IdsContext);
  if (!ids) throw Error(ERROR_MSG);

  const { titleId: id } = ids;

  return WithDialogTitle({
    children: (attributes) => {
      return createElement(as, { ref, ...attributes }, children);
    },
    id,
  });
}

/** Dialog title component with id associated with dialog.
 * ```tsx
 * import { Dialog, DialogTitle } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <Dialog hasTitle>
 *       <DialogTitle>Title</DialogTitle>
 *     </Dialog>
 *   );
 * };
 * ```
 */
const DialogTitle = _forwardRef(_DialogTitle);

export default DialogTitle;
