// This module is browser compatible.

import {
  ReactElement,
  RefAttributes,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { filterFocusable } from "../_shared/util.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import useDialog, {
  Attributes,
  Contexts,
  Options,
  Params,
} from "./use_dialog.ts";
import { Targets } from "../hooks/use_focus_callback.ts";
import { IdsContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: Attributes & RefAttributes<any>,
      contexts: Contexts,
    ) => ReactElement;

    /** Whether the dialog title is included or not.
     * If `true`, `aria-labelledby` will be added to attributes.
     * @default false
     */
    hasTitle?: boolean;

    /** Whether the dialog describe is included or not.
     * If `true`, `aria-describedby` will be added to attributes.
     * @default false
     */
    hasDescribe?: boolean;
  }
  & Pick<Params, "isShow">
  & Partial<Omit<Options, "titleId" | "describeId">>;

export default function defineWithDialog(useHook: typeof useDialog) {
  return ({
    children,
    isShow,
    keyEntries,
    initialFocus,
    onClose,
    hasTitle = false,
    hasDescribe = false,
  }: Readonly<
    Props
  >): JSX.Element | never => {
    const ids = useContext(IdsContext);

    if (!ids) throw Error(ERROR_MSG);

    const { titleId: _titleId, describeId: _describeId } = ids;

    const targets = useCallback<Targets>(
      () => filterFocusable(getRef.current),
      [],
    );

    const titleId = useMemo<string | undefined>(
      () => hasTitle ? _titleId : undefined,
      [_titleId, hasTitle],
    );

    const describeId = useMemo<string | undefined>(
      () => hasDescribe ? _describeId : undefined,
      [_describeId, hasDescribe],
    );

    const [attributes, contexts] = useHook({ isShow, targets }, {
      onClose,
      keyEntries,
      initialFocus,
      titleId,
      describeId,
    });

    const [getRef, ref] = useMergedRef<HTMLElement | SVGElement>(children);

    const child = children({ ref, ...attributes }, contexts);

    return child;
  };
}
