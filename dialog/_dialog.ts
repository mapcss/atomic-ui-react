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
import { useStateSet } from "../hooks/mod.ts";
import { StateSet } from "../types.ts";
import { Exclusive } from "../util.ts";

type _Props<As extends Tag> = ElementProps<As, Contexts>;

export type Props<As extends Tag> =
  & WithIntrinsicElements<_Props<As>, As>
  & Omit<WithDialogProps, "children" | "isShow" | "setIsShow">
  & {
    children?: ReactNode;
  }
  & Exclusive<{
    isShowSet: StateSet<boolean>;
  }, {
    /**
     * @default false
     */
    initialIsShow?: boolean;
  }>;

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
    isShowSet,
    initialIsShow = false,
    onChangeShow,
    ..._props
  }: Props<As>, _: Ref<Element>): JSX.Element | never => {
    const [isShow, setIsShow] = useStateSet<boolean>(initialIsShow, isShowSet);

    return Component({
      children: (attributes, { describeId, titleId }) => {
        return createElement(
          IdsContext.Provider,
          { value: { describeId, titleId } },
          createElement(as, attributes, children),
        );
      },
      onChangeShow,
      isShow,
      setIsShow,
      ..._props,
    });
  };

  return _forwardRef(_Dialog);
}
