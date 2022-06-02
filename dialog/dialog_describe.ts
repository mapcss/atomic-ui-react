import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
  useContext,
} from "react";
import { AsProps, Tag } from "../types.ts";
import WithDialogDescribe, {
  Props as WithDialogDescribeProps,
} from "./with_dialog_describe.ts";
import { IdsContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

export type Props<As extends Tag> =
  & AsProps<As>
  & Omit<WithDialogDescribeProps, "id" | "children">
  & {
    children?: ReactNode;
  };

function _DialogDescribe<As extends Tag = "p">(
  {
    as = "p" as As,
    children,
  }: Props<As>,
  ref: Ref<Element>,
): JSX.Element | never {
  const ids = useContext(IdsContext);
  if (!ids) throw Error(ERROR_MSG);

  const { describeId: id } = ids;
  return WithDialogDescribe({
    children: (attributes) => {
      return createElement(as, { ref, ...attributes }, children);
    },
    id,
  });
}

/** Dialog title component with id associated with dialog.
 * ```tsx
 * import { DialogProvider, DialogDescribe } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <DialogProvider>
 *       <DialogDescribe>Describe dialog</DialogDescribe>
 *     </DialogProvider>
 *   );
 * };
 * ```
 */
const DialogDescribe = _forwardRef(_DialogDescribe);

export default DialogDescribe;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
