// This module is browser compatible.

import {
  Children,
  cloneElement,
  createElement,
  PropsWithChildren,
  ReactNode,
} from "react";
import { isIterable, isString } from "../deps.ts";
import { isCloneable } from "../util.ts";

type Component<Args extends readonly unknown[]> = (
  ...args: Args
) => JSX.Element;

const defaultNav: Components["nav"] = (props) =>
  createElement("nav", { "aria-label": "Breadcrumb", ...props });
const defaultOl: Components["ol"] = (props) => createElement("ol", props);
const defaultLi: Components["li"] = (props, { forSeparator }) => {
  const attributes = forSeparator ? { "aria-hidden": "true", ...props } : props;
  return createElement("li", attributes);
};
const DEFAULT_SEPARATOR = "/";

export type Components = {
  /** Override `nav` component.
   * @defaultValue {@link defaultNav}
   */
  nav: Component<[PropsWithChildren<unknown>]>;

  /** Override `ol` component.
   * @defaultValue {@link defaultOl}
   */
  ol: Component<[PropsWithChildren<unknown>]>;

  /** Override `li` component.
   * @defaultValue {@link defaultLi}
   */
  li: Component<[PropsWithChildren<unknown>, { forSeparator: boolean }]>;
};

export type Props = {
  /** Child or children. */
  children: ReactNode | Iterable<ReactNode>;

  /** Separator between breadcrumb.
   * @default `/`
   */
  separator?: ReactNode;

  /** Whether to disable the automatic assignment of `aria-current`.
   * - `true` - If the last element is an anchor element, the `aria-current` attribute will be added.
   * - `false` - Do nothing.
   * @default false
   */
  disabledAriaCurrent?: boolean;

  /** The key is the name of the element to override. The value is the component to render instead. */
  components?: Partial<Components>;
};

/** A breadcrumb consists of a list of links to the parent pages of the
 * current page in hierarchical order. It helps users find their place within a website or web
 * application. Breadcrumbs are often placed horizontally before a page's main
 * content.
 * ```tsx
 * import { Breadcrumb } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   return (
 *     <Breadcrumb>
 *       <a href="/html">HTML</a>
 *       <a href="/html/breadcrumb">Breadcrumb</a>
 *       <a href="/html/breadcrumb/example">Example</a>
 *     </Breadcrumb>
 *   );
 * };
 * ```
 */
export default function Breadcrumb(
  {
    components: {
      nav = defaultNav,
      ol = defaultOl,
      li = defaultLi,
    } = {},
    children,
    separator = DEFAULT_SEPARATOR,
    disabledAriaCurrent = false,
  }: Readonly<Props>,
): JSX.Element {
  const _children = isString(children)
    ? [children]
    : isIterable(children)
    ? Array.from(children)
    : [children];
  return (
    nav({
      children: (
        ol({
          children: _children.map((_node, i) => {
            const isLast = _children.length - 1 === i;
            const node = !disabledAriaCurrent && isLast && isCloneable(_node) &&
                _node.type === "a"
              ? cloneElement(_node, { "aria-current": "page" })
              : _node;

            return (
              Children.toArray(
                [
                  separator && 0 < i &&
                  li({ children: separator }, { forSeparator: true }),
                  li({ children: node }, { forSeparator: false }),
                ],
              )
            );
          }),
        })
      ),
    })
  );
}
