// This module is browser compatible.

import {
  createElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isNumber } from "../deps.ts";
import { DEFAULT_INDEX, DEFAULT_IS_HORIZONTAL } from "./constant.ts";
import useId from "../hooks/use_id.ts";
import {
  DisabledIdsContext,
  HorizontalContext,
  IdContext,
  IndexContext,
  TabCountContext,
  TabPanelCountContext,
  TabRefsContext,
} from "./context.ts";
import { tempId } from "./util.ts";

export type Props = {
  /** The selected index if you want to use as a controlled component. */
  selectedIndex?: number;

  /** The default selected index.
   * @default 0
   */
  defaultIndex?: number;

  /** A function called whenever the active tab will change. */
  onChange?: (index: number) => void;

  /** When `true`, the orientation of the `TabList` will be `horizontal`, otherwise `vertical`
   * @default true
   */
  isHorizontal?: boolean;

  children: ReactNode;
};

export default function TabProvider(
  props: Props,
): JSX.Element {
  const {
    children,
    defaultIndex = DEFAULT_INDEX,
    selectedIndex,
    isHorizontal = DEFAULT_IS_HORIZONTAL,
    onChange,
  } = props;
  const id = useId();
  const refs: RefObject<HTMLElement>[] = [];
  const tabCount = tempId();
  const tabPanelCount = tempId();
  const disabledIds: number[] = [];

  const isControl = useMemo<boolean>(() => isNumber(selectedIndex), [
    selectedIndex,
  ]);
  const [state, setState] = useState<number>(selectedIndex ?? defaultIndex);

  const index = useMemo<number>(
    () => isControl ? selectedIndex ?? defaultIndex : state,
    [
      isControl,
      selectedIndex,
      state,
      defaultIndex,
    ],
  );

  useEffect(() => {
    onChange?.(state);
  }, [onChange, state]);

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(
      IndexContext.Provider,
      { value: [index, setState] },
      createElement(
        TabCountContext.Provider,
        { value: tabCount },
        createElement(
          TabPanelCountContext.Provider,
          { value: tabPanelCount },
          createElement(
            TabRefsContext.Provider,
            { value: refs },
            createElement(
              HorizontalContext.Provider,
              { value: isHorizontal },
              createElement(
                DisabledIdsContext.Provider,
                { value: disabledIds },
                children,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
