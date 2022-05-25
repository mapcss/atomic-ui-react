import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { AsProps, Tag, WithIntrinsicElements } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import WithDialogDescribe from "./with_dialog_describe.ts";
import { mergeProps } from "../util.ts";

export type Props<As extends Tag> = WithIntrinsicElements<AsProps<As>, As>;

function _DialogDescribe<As extends Tag = "p">(
  {
    as,
    ..._props
  }: Props<As>,
  _: Ref<Element>,
): JSX.Element {
  return WithDialogDescribe({
    children: (attrs) => {
      const tag = useAs(as, "p");

      const props = mergeProps(attrs, _props);
      return createElement(tag, props);
    },
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
