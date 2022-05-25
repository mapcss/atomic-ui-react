// This module is browser compatible.

import {
  cloneElement,
  ReactElement,
  RefAttributes,
  useCallback,
  useContext,
} from "react";
import { isFunction } from "../deps.ts";
import { mergeProps, omitRef } from "../util.ts";
import { filterFocusable } from "../_shared/util.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import useAlertDialog, {
  Attributes,
  Contexts,
  Options,
  Params,
} from "./use_alert_dialog.ts";
import { Targets } from "../hooks/use_focus_callback.ts";
import { IdsContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

export type Props =
  & {
    children:
      | ReactElement
      | ((
        // deno-lint-ignore no-explicit-any
        attributes: Attributes & RefAttributes<any>,
        contexts: Contexts,
      ) => ReactElement);
  }
  & Pick<Params, "isShow">
  & Partial<Options>;
export default function WithAlertDialog(
  { children, isShow, keyEntries, initialFocus, onClose }: Readonly<
    Props
  >,
): JSX.Element | never {
  const ids = useContext(IdsContext);

  if (!ids) throw Error(ERROR_MSG);

  const { titleId, describeId } = ids;

  const targets = useCallback<Targets>(
    () => filterFocusable(getRef.current),
    [],
  );

  const [attributes, contexts] = useAlertDialog({ isShow, targets }, {
    onClose,
    keyEntries,
    initialFocus,
    titleId,
    describeId,
  });

  const [getRef, ref] = useMergedRef<HTMLElement | SVGElement>(children);
  const child = isFunction(children)
    ? children({ ref, ...attributes }, contexts)
    : cloneElement(children, {
      ref,
      ...mergeProps(omitRef(children.props), attributes),
    });

  return child;
}
