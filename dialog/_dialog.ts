import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
} from "react";
import { ElementProps, Tag, WithIntrinsicElements } from "../types.ts";
import WithDialog, { Props as WithDialogProps } from "./with_dialog.ts";
import { Contexts } from "./use_dialog.ts";
import { IdsContext } from "./context.ts";

type _Props<As extends Tag> = ElementProps<As, Contexts>;

export type Props<As extends Tag> =
  & WithIntrinsicElements<_Props<As>, As>
  & Omit<WithDialogProps, "children">
  & {
    children?: ReactNode;
  };

/** Dialog component with accessibility and keyboard interaction.
 * ```tsx
 * import { Dialog } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *       <Dialog initialIsShow></Dialog>
 *   );
 * };
 * ```
 */

export default function defineDialog(Component: typeof WithDialog) {
  const _Dialog = <As extends Tag = "div">({
    as = "div" as As,
    children,
    isShow,
    setIsShow,
    initialIsShow,
    ..._props
  }: Props<As>, _: Ref<Element>): JSX.Element | never => {
    return Component({
      children: (attributes, { describeId, titleId }) => {
        return createElement(
          IdsContext.Provider,
          { value: { describeId, titleId } },
          createElement(as, attributes, children),
        );
      },
      isShow,
      setIsShow: setIsShow as never,
      initialIsShow: initialIsShow as never,
      ..._props,
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
