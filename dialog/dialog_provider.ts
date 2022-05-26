// This module is browser compatible.

import { createElement, ReactNode, useMemo } from "react";
import { IdsContext } from "./context.ts";
import useId from "../hooks/use_id.ts";
import { joinChars } from "../util.ts";

export type Props = {
  children: ReactNode;
};

export default function DialogProvider({ children }: Props): JSX.Element {
  const { id } = useId();
  const titleId = useMemo<string>(
    () => joinChars([id, "dialog", "title"], "-")!,
    [id],
  );
  const describeId = useMemo<string>(
    () => joinChars([id, "dialog", "describe"], "-")!,
    [id],
  );

  return createElement(
    IdsContext.Provider,
    { value: { id, titleId, describeId } },
    children,
  );
}
