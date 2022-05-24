// This module is browser compatible.

import { createElement, ReactNode, useMemo } from "react";
import { visitDisplayName } from "../util.ts";
import { ALERT_DIALOG_DESCRIBE, ALERT_DIALOG_TITLE } from "./constant.ts";
import { ExistenceContext, IdsContext } from "./context.ts";
import useId from "../hooks/use_id.ts";
import { joinChars } from "../util.ts";

export type Props = {
  children: ReactNode;
};

export default function AlertDialogProvider({ children }: Props): JSX.Element {
  const id = useId();
  let title = false;
  let describe = false;

  visitDisplayName(children, {
    [ALERT_DIALOG_TITLE]: () => {
      title = true;
    },
    [ALERT_DIALOG_DESCRIBE]: () => {
      describe = true;
    },
  });

  const titleId = useMemo<string | undefined>(
    () => title ? joinChars([id, "alert", "dialog", "title"], "-") : undefined,
    [title, id],
  );
  const describeId = useMemo<string | undefined>(
    () =>
      describe
        ? joinChars([id, "alert", "dialog", "describe"], "-")
        : undefined,
    [describe, id],
  );

  return createElement(
    IdsContext.Provider,
    { value: { id, titleId, describeId } },
    createElement(ExistenceContext.Provider, {
      value: {
        title,
        describe,
      },
    }, children),
  );
}
