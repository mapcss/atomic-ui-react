import { useMemo } from "react";

export type Param = {
  isSelected: boolean;
  tabPanelId: string;
};

export type ReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "role" | "aria-selected" | "tabIndex" | "aria-controls"
>;
export default function useTabAria(
  { isSelected, tabPanelId }: Readonly<Partial<Param>>,
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: "tab",
      "aria-selected": isSelected ? "true" : "false",
      "aria-controls": tabPanelId,
    };
  }, [isSelected, tabPanelId]);

  return aria;
}
