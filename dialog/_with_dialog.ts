// This module is browser compatible.

import {
  ReactElement,
  RefAttributes,
  useCallback,
  useMemo,
  useRef,
} from "react";
import useDialog, { Attributes, Contexts, Options } from "./use_dialog.ts";
import { useId } from "../hooks/mod.ts";
import { joinChars } from "../util.ts";
import { IsShowProps } from "./types.ts";

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: Attributes & RefAttributes<any>,
      contexts: Contexts,
    ) => ReactElement;
  }
  & IsShowProps
  & Partial<Options>;

export default function defineWithDialog(useHook: typeof useDialog) {
  const withDialog = ({
    children,
    hasTitle,
    hasDescribe,
    isShow,
    setIsShow,
    onChangeShow,
    initialFocus,
  }: Readonly<Props>): JSX.Element => {
    const { id } = useId();
    const titleId = useMemo<string>(
      () => joinChars([id, "dialog", "title"], "-")!,
      [id],
    );
    const describeId = useMemo<string>(
      () => joinChars([id, "dialog", "describe"], "-")!,
      [id],
    );

    const ref = useRef<Element>(null);

    const root = useCallback<() => Element | null>(() => ref.current, []);

    const [attributes, contexts] = useHook({
      isShow,
      setIsShow,
      root,
      titleId,
      describeId,
    }, {
      onChangeShow,
      initialFocus,
      hasTitle,
      hasDescribe,
    });

    const child = children({ ref, ...attributes }, contexts);

    return child;
  };
  return withDialog;
}
