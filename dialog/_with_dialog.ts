// This module is browser compatible.

import {
  ReactElement,
  RefAttributes,
  useCallback,
  useMemo,
  useRef,
} from "react";
import useDialog, { Attributes, Contexts, Options } from "./use_dialog.ts";
import { Exclusive } from "../util.ts";
import { IsShowProps } from "./types.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";
import useId from "../hooks/use_id.ts";
import { joinChars } from "../util.ts";

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: Attributes & RefAttributes<any>,
      contexts: Contexts,
    ) => ReactElement;
  }
  & Exclusive<IsShowProps, {
    /**
     * @default false
     */
    initialIsShow?: boolean;
  }>
  & Partial<Options>;

export default function defineWithDialog(useHook: typeof useDialog) {
  const withDialog = ({
    children,
    isShow,
    hasTitle,
    hasDescribe,
    setIsShow,
    initialIsShow = false,
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

    const isShowStates = useExclusiveState({
      initialState: initialIsShow,
      state: isShow,
      setState: setIsShow,
    });

    const ref = useRef<Element>(null);

    const root = useCallback<() => Element | null>(() => ref.current, []);

    const [attributes, contexts] = useHook({
      isShow: isShowStates[0],
      setIsShow: isShowStates[1],
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
