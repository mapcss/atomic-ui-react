// This module is browser compatible.

import {
  cloneElement,
  DOMAttributes,
  forwardRef,
  ReactElement,
  Ref,
  useContext,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import useAriaDisclosureTrigger, {
  ReturnValue,
} from "./use_aria_disclosure_trigger.ts";
import { DispatchMap, StateMap } from "./use_disclosure.ts";
import Context from "./context.ts";
import { ERROR_MSG } from "./constant.ts";

type Handler<E extends Element = Element> = Exclude<
  keyof DOMAttributes<E>,
  "children" | "dangerouslySetInnerHTML"
>;

type Type = "toggle" | "open" | "close";

type RenderAttributes<H extends Handler, E extends Element = Element> =
  & ReturnValue
  & Pick<DOMAttributes<E>, H>;

export type Props<H extends Handler, E extends Element = Element> = {
  on?: Iterable<H>;

  type?: Type;

  children:
    | ReactElement
    | ((
      attributes: RenderAttributes<H, E>,
      context: RenderContext,
    ) => JSX.Element);
};

type RenderContext = StateMap & DispatchMap;

function _WithDisclosureTrigger<
  E extends Element,
  H extends Handler = "onClick",
>(
  { on = ["onClick"] as H[], type = "toggle", children }: Readonly<Props<H, E>>,
  ref: Ref<E>,
): JSX.Element {
  const context = useContext(Context);
  if (!context) throw Error(ERROR_MSG);

  const [stateMap, dispatchMap] = context;
  const dispatch = useMemo(() => dispatchMap[type], [type]);

  const aria = useAriaDisclosureTrigger(stateMap);

  const handlerMap = useMemo<Pick<DOMAttributes<E>, H>>(() => {
    return Array.from(on).reduce((acc, cur) => {
      return { ...acc, [cur]: dispatch };
    }, {} as Pick<DOMAttributes<E>, H>);
  }, [JSON.stringify(on), JSON.stringify(dispatch)]);

  if (isFunction(children)) {
    return children({ ...aria, ...handlerMap, ref }, {
      ...stateMap,
      ...dispatchMap,
    });
  }

  return cloneElement(children, { ...aria, ...handlerMap, ref });
}

const WithDisclosureTrigger = forwardRef(_WithDisclosureTrigger);
export default WithDisclosureTrigger;
