// This module is browser compatible.

import { useMemo } from "react";
import useKeyId, { Options as UseKeyIdOptions } from "./use_key_id.ts";
import { joinChars } from "../util.ts";
import useSSRStore from "../ssr/use_ssr_store.ts";

const DEFAULT_PREFIX = "atomic-ui";
function defaultFormatId({ prefix, index }: Contexts): string {
  return joinChars([prefix, index], "-")!;
}

export type FormatId = (contexts: Contexts) => string;

export type Options = {
  /** Id prefix.
   * @default `atomic-ui`
   */
  prefix: string;

  /** Format of the Id.
   * @defaultValue {@link defaultFormatId }
   */
  formatId: FormatId;

  /** Initial index.
   * @default 0
   */
  initialIndex: number;
} & Pick<UseKeyIdOptions, "step">;

export type Contexts =
  & Pick<Options, "prefix" | "step" | "initialIndex">
  & Pick<Returns, "index">;

export type Returns = {
  /** Incremental Id for the same prefix. */
  index: number;

  /** Unique Id for the same prefix.
   * This is formatted through the {@link Options.formatId} function.
   */
  id: string;
};

/** Hooks for ensure a unique ID for the same prefix.
 * @param options This options
 * ```tsx
 * import { useId } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   const { id } = useId() // atomic-ui-0
 * };
 * ```
 * @remark When running on the Server side, it must be wrapped in the `SSRProvider` component.
 */
export default function useId(
  {
    prefix = DEFAULT_PREFIX,
    step = 1,
    initialIndex = 0,
    formatId = defaultFormatId,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const store = useSSRStore();
  const index = useKeyId({ key: prefix, store }, { step, init: initialIndex });

  const id = useMemo<string>(
    () => formatId({ index, prefix, step, initialIndex }),
    [
      formatId,
      index,
      prefix,
      step,
      initialIndex,
    ],
  );
  const returns = useMemo<Returns>(() => ({
    id,
    index,
  }), [id, index]);

  return returns;
}
