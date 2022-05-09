import { Children, cloneElement, createElement, ReactNode } from "react";
import { isIterable, isString } from "../deps.ts";
import { isCloneable } from "../util.ts";

type FC<Props> = (props: Props) => JSX.Element;
type FCWithContext<Props, Context> = (
  props: Props,
  context: Context,
) => JSX.Element;
type Component<Props> = FC<Props>;

export type NavProps = Pick<
  JSX.IntrinsicElements["nav"],
  "children" | "aria-label"
>;
export type OlProps = Pick<JSX.IntrinsicElements["ol"], "children">;
export type LiProps = Pick<
  JSX.IntrinsicElements["li"],
  "children" | "aria-hidden"
>;

const defaultNav: Required<Components>["nav"] = (props) =>
  createElement("nav", props);
const defaultOl: Required<Components>["ol"] = (props) =>
  createElement("ol", props);
const defaultLi: Required<Components>["li"] = (props) =>
  createElement("li", props);
const DEFAULT_SEPARATOR = "/";

export type Components = {
  nav?: Component<NavProps>;
  ol?: Component<OlProps>;
  li?: FCWithContext<LiProps, { forSeparator: boolean }>;
};

export type Props = {
  children: ReactNode | Iterable<ReactNode>;

  components?: Components;

  /**
   * @default `/`
   */
  separator?: ReactNode;

  /**
   * @default false
   */
  disabledAriaCurrent?: boolean;
};

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
  }: Props,
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
            const node = !disabledAriaCurrent && isLast && isCloneable(_node)
              ? cloneElement(_node, { "aria-current": "page" })
              : _node;

            return (
              Children.toArray(
                [
                  separator && 0 < i &&
                  li({ children: separator, "aria-hidden": "true" }, {
                    forSeparator: true,
                  }),
                  li({ children: node }, { forSeparator: false }),
                ],
              )
            );
          }),
        })
      ),
      "aria-label": "Breadcrumb",
    })
  );
}
