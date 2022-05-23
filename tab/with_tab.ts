// This module is browser compatible.

import {
  cloneElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { filterTruthy, joinChars, mergeProps, omitRef } from "../util.ts";
import { isFunction } from "../deps.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import { REF_CALLBACK_IS_NOT_SUPPORTED } from "../_shared/constant.ts";
import {
  DisabledIdsContext,
  HorizontalContext,
  IdContext,
  IndexContext,
  TabCountContext,
  TabRefsContext,
} from "./context.ts";
import { ERROR_MSG, PANEL, TAB } from "./constant.ts";
import { AllHandlerWithoutKeyBoard, KeyboardHandler } from "../types.ts";
import useTab, { ChangeEventHandler, Options } from "./use_tab.ts";
import { Targets } from "../hooks/use_focus_callback.ts";

export type Props = {
  children: ReactElement;

  onKey?: Iterable<KeyboardHandler>;

  on?: Iterable<AllHandlerWithoutKeyBoard>;
} & Partial<Pick<Options, "isDisabled" | "keyEntries">>;

export default function WithTab(
  {
    isDisabled,
    children,
    onKey,
    on,
    keyEntries,
  }: Readonly<Props>,
): JSX.Element | never {
  const id = useContext(IdContext);
  const indexStateSet = useContext(IndexContext);
  const tabCount = useContext(TabCountContext);
  const refs = useContext(TabRefsContext);
  const isHorizontal = useContext(HorizontalContext);
  const disabledIds = useContext(DisabledIdsContext);

  if (!id || !indexStateSet || !tabCount) {
    throw Error(ERROR_MSG);
  }
  const [_, ref] = useMergedRef<HTMLElement>(children);
  if (isFunction(ref)) {
    throw Error(REF_CALLBACK_IS_NOT_SUPPORTED);
  }

  const [selectedIndex, setIndex] = indexStateSet;
  const index = tabCount.current;
  if (isDisabled) {
    disabledIds.push(index);
  }

  refs.push(ref);

  const isSelected = useMemo<boolean>(() => selectedIndex === index, [
    index,
    selectedIndex,
  ]);

  const tabPanelId = useMemo<string>(
    () => joinChars([id, TAB, PANEL, index], "-")!,
    [
      id,
      index,
    ],
  );

  const tabId = useMemo<string>(() => joinChars([id, TAB, index], "-")!, [
    id,
    index,
  ]);

  const targets = useCallback<Targets>(
    () => filterTruthy(refs.map((ref) => ref.current)),
    [],
  );

  const onChange = useCallback<ChangeEventHandler>(
    ({ featureIndex, target }) => {
      target.focus();
      setIndex(featureIndex);
    },
    [],
  );

  const [attributes] = useTab({
    index,
    targets,
  }, {
    isDisabled,
    onKey,
    on,
    keyEntries,
    onChange,
    tabId,
    tabPanelId,
    isSelected,
    isHorizontal,
  });

  return cloneElement(
    children,
    { ref, ...mergeProps(omitRef(children.props), attributes) },
  );
}
