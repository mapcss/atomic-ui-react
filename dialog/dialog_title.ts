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
 * import { DialogProvider, DialogTitle } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <DialogProvider>
 *       <DialogTitle>Title</DialogTitle>
 *     </DialogProvider>
 *   );
 * };
 * ```
 */
const DialogTitle = _forwardRef(_DialogTitle);

export default DialogTitle;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
