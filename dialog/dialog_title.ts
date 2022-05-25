import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { AsProps, Tag, WithIntrinsicElements } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import WithDialogTitle from "./with_dialog_title.ts";
import { mergeProps } from "../util.ts";

export type Props<As extends Tag> = WithIntrinsicElements<AsProps<As>, As>;

function _DialogTitle<As extends Tag = "h3">(
  {
    as,
    ..._props
  }: Props<As>,
  _: Ref<Element>,
): JSX.Element {
  return WithDialogTitle({
    children: (attrs) => {
      const tag = useAs(as, "h3");

      const props = mergeProps(attrs, _props);
      return createElement(tag, props);
    },
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
