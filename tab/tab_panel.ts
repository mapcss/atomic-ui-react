import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { CommonContextsContext, IdContext } from "./context.ts";
import { Tag } from "../types.ts";
import { ERROR_MSG } from "./constant.ts";
import { useId, useMergedRef } from "../hooks/mod.ts";
import { joinChars } from "../util.ts";
import useTabPanel, {
  AttributesWithContexts,
  Params,
} from "./use_tab_panel.ts";

export type Props<T extends Tag> = {
  /**
   * @default `div`
   */
  tag?: T;

  children?: ReactNode;
} & AttributesWithContexts;

function TabPanel<T extends Tag>(
  { tag = "div" as T, children, ...allAttributes }: Props<T>,
  ref: Ref<Element>,
): JSX.Element | never {
  const groupId = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);

  if (!groupId || !commonContexts) {
    throw Error(ERROR_MSG);
  }

  const [getRef, setRef] = useMergedRef(ref);
  useEffect(() => {
    commonContexts.tabPanelsRef.current.push(getRef);
  }, []);

  const prefix = useMemo<string>(
    () => joinChars([groupId, "tab", "panel"], "-")!,
    [groupId],
  );
  const { id, index } = useId({ prefix });

  const tabId = useMemo<string>(
    () => joinChars([groupId, "tab", index], "-")!,
    [groupId, index],
  );

  const contexts = useMemo<Params>(() => ({
    id,
    index,
    tabId,
    ...commonContexts,
  }), [id, index, tabId, commonContexts]);

  const [attributes] = useTabPanel(contexts, allAttributes);

  return createElement(tag, { ref: setRef, ...attributes }, children);
}

export default _forwardRef(TabPanel);
