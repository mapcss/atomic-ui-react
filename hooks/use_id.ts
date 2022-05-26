// This module is browser compatible.

import { useMemo } from "react";
import useKeyId, { Options as UseKeyIdOptions } from "./use_key_id.ts";
import { joinChars } from "../util.ts";
import useSSRStore from "../ssr/use_ssr_store.ts";

const DEFAULT_PREFIX = "atomic-ui";
function defaultFormatId({ prefix, index }: Contexts): string {
  return joinChars([prefix, index], "-")!;
}

export type Options = {
  /** ID prefix
   * @default `atomic-ui`
   */
  prefix: string;

  /** Change the format of the Id.
   * @defaultValue {@link defaultFormatId }
   */
  formatId: (contexts: Contexts) => string;
} & UseKeyIdOptions;

export type Contexts =
  & Pick<Options, "prefix" | "step" | "init">
  & Pick<Returns, "index">;

export type Returns = {
  /** Incremental Id for the same prefix. */
  index: number;

  /** Unique Id for the same prefix.
   * The format of the id can be changed through the `formatId` function.
   */
  id: string;
};

/** Returns a unique ID for the same prefix.
 * If prefix is specified, it returns a unique ID for the same prefix.
 * ```tsx
 * import { useId } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   const { id } = useId() // atomic-ui-0
 * };
 * ```
 * @remark
 * When running on the Server side, it must be wrapped in the `SSRProvider` component.
 */
export default function useId(
  {
    prefix = DEFAULT_PREFIX,
    step = 1,
    init = 0,
    formatId = defaultFormatId,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const store = useSSRStore();
  const index = useKeyId({ key: prefix, store }, { step, init });
  const returns = useMemo<Returns>(() => ({
    id: formatId({ index, prefix, step, init }),
    index,
  }), [prefix, index, formatId, step, init]);

  return returns;
}
