import { Exclusive } from "../util.ts";
export type ActiveIndexProps = {
  activeIndex: number | undefined;

  setActiveIndex: (index: ActiveIndexProps["activeIndex"]) => void;
};

export type InitialActiveIndexProps = {
  /**
   * @default undefined
   */
  initialActiveIndex?: ActiveIndexProps["activeIndex"];
};

export type ExclusiveActiveIndexProps = Exclusive<
  ActiveIndexProps,
  InitialActiveIndexProps
>;

export type ExclusiveActiveIndex = Exclusive<{
  activeIndexSet: [number | undefined, () => number | undefined];
}, InitialActiveIndexProps>;

export type ExclusiveSelectIndex = Exclusive<{
  selectIndexSet: [number | undefined, () => number | undefined];
}, InitialSelectIndexProps>;

export type SelectIndexProps = {
  /** The selected index if you want to use as a controlled component. */
  selectIndex: number | undefined;

  setSelectIndex: (index: SelectIndexProps["selectIndex"]) => void;
};

export type InitialSelectIndexProps = {
  /** Initial selected index.
   * @default undefined
   */
  initialSelectIndex?: SelectIndexProps["selectIndex"];
};

export type ExclusiveSelectIndexProps = Exclusive<
  SelectIndexProps,
  InitialSelectIndexProps
>;
