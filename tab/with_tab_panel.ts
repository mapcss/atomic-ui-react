// This module is browser compatible.

import {
  ReactElement,
  RefAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { CommonContextsContext, IdContext } from "./context.ts";
import { joinChars } from "../util.ts";
import { ERROR_MSG } from "./constant.ts";
import useTabPanel, { Returns } from "./use_tab_panel.ts";
import useId from "../hooks/use_id.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: Returns[0] & RefAttributes<any>,
    contexts: Returns[1],
  ) => ReactElement;
};

export default function WithTabPanel(
  { children }: Readonly<Props>,
): JSX.Element {
  const groupId = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);

  if (!groupId || !commonContexts) {
    throw Error(ERROR_MSG);
  }

  const ref = useRef<Element>(null);
  useEffect(() => {
    commonContexts.tabPanelsRef.current.push(ref);
  }, []);

  const prefix = useMemo<string>(
    () => joinChars([groupId, "tab", "panel"], "-")!,
    [groupId],
  );
  const { id, index } = useId({ prefix });

  const tabId = useMemo<string>(
    () => joinChars([groupId, "tab", index], "-")!,
    [groupId],
  );

  const [attributes, contexts] = useTabPanel({
    id,
    index,
    tabId,
    ...commonContexts,
  });

  return children({ ref, ...attributes }, contexts);
}
