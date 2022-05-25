import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { ElementProps, Tag, WithIntrinsicElements } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import WithDialog, { Props as WithDialogProps } from "./with_dialog.ts";
import { Contexts } from "./use_dialog.ts";
import { mergeProps } from "../util.ts";

type _Props<As extends Tag> = ElementProps<As, Contexts>;

export type Props<As extends Tag> =
  & WithIntrinsicElements<_Props<As>, As>
  & Omit<WithDialogProps, "children">;

/** Dialog component with accessibility and keyboard interaction.
 * ```tsx
 * import { DialogProvider, Dialog } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <DialogProvider>
 *       <Dialog isShow></Dialog>
 *     </DialogProvider>
 *   );
 * };
 * ```
 */

export default function defineDialog(Component: typeof WithDialog) {
  const _Dialog = <As extends Tag = "div">({
    as,
    renderAttributes,
    isShow,
    hasDescribe,
    hasTitle,
    onClose,
    keyEntries,
    initialFocus,
    ..._props
  }: Props<As>, _: Ref<Element>): JSX.Element | never => {
    return Component({
      children: (attrs, contexts) => {
        const tag = useAs(as, "div");
        const attributes = renderAttributes?.(contexts) ?? {};

        const props = mergeProps(attrs, mergeProps(_props, attributes));
        return createElement(tag, props);
      },
      isShow,
      hasDescribe,
      hasTitle,
      onClose,
      keyEntries,
      initialFocus,
    });
  };

  return _forwardRef(_Dialog);
}

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
