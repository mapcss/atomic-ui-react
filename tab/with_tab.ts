// This module is browser compatible.

import {
  ReactElement,
  RefAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { joinChars } from "../util.ts";
import {
  CommonContextsContext,
  HorizontalContext,
  IdContext,
} from "./context.ts";
import { ERROR_MSG } from "./constant.ts";
import { FocusStrategyContext } from "../focus/mod.ts";
import useTab, { Returns } from "./use_tab.ts";
import useId from "../hooks/use_id.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: Returns[0] & RefAttributes<any>,
    contexts: Returns[1],
  ) => ReactElement;
};

export default function WithTab(
  {
    children,
  }: Readonly<Props>,
): JSX.Element | never {
  const groupId = useContext(IdContext);
  const isHorizontal = useContext(HorizontalContext);
  const commonContexts = useContext(CommonContextsContext);
  const focusStrategy = useContext(FocusStrategyContext);

  if (!groupId || !commonContexts) {
    throw Error(ERROR_MSG);
  }

  const ref = useRef<Element>(null);
  useEffect(() => {
    commonContexts.tabsRef.current.push(ref);
  }, []);

  const prefix = useMemo<string>(() => joinChars([groupId, "tab"], "-")!, [
    groupId,
  ]);
  const { id, index } = useId({ prefix });

  const tabPanelId = useMemo<string>(
    () => joinChars([groupId, "tab", "panel", index], "-")!,
    [groupId],
  );

  const [attributes, contexts] = useTab({
    index,
    id,
    tabPanelId,
    ...commonContexts,
  }, {
    isHorizontal,
    focusStrategy,
  });

  return children({ ref, ...attributes }, contexts);
}
