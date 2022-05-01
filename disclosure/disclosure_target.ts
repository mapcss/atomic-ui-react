// This module is browser compatible.

import {
  ComponentProps,
  createElement,
  CSSProperties,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import Context from "./context.ts";
import { DispatchMap, StateMap } from "./use_disclosure.ts";
import { ERROR_MSG } from "./constant.ts";

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}

type RenderContext<As extends keyof JSX.IntrinsicElements> =
  & StateMap
  & DispatchMap
  & Pick<Required<_Props<As>>, "as" | "closedStyle">;

const defaultRender = <As extends keyof JSX.IntrinsicElements>(
  props: ComponentProps<As>,
  { isOpen, as, closedStyle }: RenderContext<As>,
) => {
  if (isOpen) {
    return createElement(as, props);
  }
  const { style: _style, ...rest } = props;
  const style = { ..._style, ...closedStyle };
  return createElement(as, { ...rest, ...style });
};

type Render<
  As extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
> = (
  props: ComponentProps<As>,
  context: RenderContext<As>,
) => JSX.Element;

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /**
   * @default `div`
   */
  as?: As;

  render?: Render<As>;

  /**
   * @default { display: "none"}
   */
  closedStyle?: CSSProperties;
};

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & ComponentProps<As>;

function _DisclosureTarget<As extends keyof JSX.IntrinsicElements = "div">(
  {
    render = defaultRender,
    as: _as,
    closedStyle = { display: "none" },
    ...props
  }: Props<As>,
): JSX.Element {
  const context = useContext(Context);
  if (!context) throw Error(ERROR_MSG);

  const as = useMemo<As>(() => _as ?? "div" as As, [_as]);
  const [stateMap, dispatchMap] = context;

  return render(props as ComponentProps<As>, {
    ...stateMap,
    ...dispatchMap,
    as,
    closedStyle,
  });
}

const DisclosureTarget = forwardRef(_DisclosureTarget);
export default DisclosureTarget;
