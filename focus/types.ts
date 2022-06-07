type Node<Args extends readonly unknown[]> = Partial<{
  effect: (...args: Args) => void;

  attrs: (...args: Args) => void;
}>;

export type ParentPayload = { activeElement: Element | null | undefined };
export type ChildPayload = { isActive: boolean; id: string };

export type Parent = Node<[ParentPayload]>;
export type Child = Node<[ChildPayload]>;

export type FocusStrategy = {
  child: Child;

  parent: Parent;
};

export type FocusStrategyProps = {
  focusStrategy: FocusStrategy;
};

export type ActiveThenSelectProps = {
  /** Whether to select after active.
   * @default true
   */
  activeThenSelect: boolean;
};
