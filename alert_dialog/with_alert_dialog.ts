// This module is browser compatible.

import { cloneElement, ReactElement, RefAttributes, useCallback } from "react";
import { isFunction } from "../deps.ts";
import { mergeProps, omitRef } from "../util.ts";
import useId from "../hooks/use_id.ts";
import { filterFocusable } from "../_shared/util.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import useAlertDialog, {
  Attributes,
  Contexts,
  Options,
  Params,
} from "./use_alert_dialog.ts";
import { Targets } from "../hooks/use_focus_callback.ts";

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
  { children, isShow, keyEntries, initialFocus }: Readonly<
    Props
  >,
): JSX.Element {
  const id = useId();

  const targets = useCallback<Targets>(
    () => filterFocusable(getRef.current),
    [],
  );

  const [attributes, contexts] = useAlertDialog({ id, isShow, targets }, {
    keyEntries,
    initialFocus,
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
