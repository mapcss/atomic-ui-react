// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";
import { PANEL, TAB } from "./constant.ts";
import { joinChars } from "../util.ts";

export type Params = {
  id: string;
  index: number;
  selectedIndex: number;
  disabledIds: number[];
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-labelledby" | "id" | "hidden"
>;

export type Contexts = {
  selectedIndex: number;
  index: number;
  isDisabled: boolean;
  isSelected: boolean;
  isShowable: boolean;
};

export type Returns = [Attributes, Contexts];

export default function useTabPanel(
  { id, index, selectedIndex, disabledIds }: Readonly<Params>,
): Returns {
  const tabId = useMemo<string | undefined>(
    () => joinChars([id, TAB, index], "-"),
    [id, index],
  );
  const tabPanelId = useMemo<string | undefined>(
    () => joinChars([id, TAB, PANEL, index], "-"),
    [id, index],
  );

  const isSelected = useMemo<boolean>(() => index === selectedIndex, [
    selectedIndex,
  ]);

  const isDisabled = useMemo<boolean>(() => disabledIds.includes(index), [
    JSON.stringify(disabledIds),
    index,
  ]);

  const isShowable = useMemo<boolean>(() => isSelected && !isDisabled, [
    isSelected,
    isDisabled,
  ]);

  const attributes = useMemo<Attributes>(() => {
    return {
      role: `${TAB}${PANEL}`,
      id: tabPanelId,
      "aria-labelledby": tabId,
      hidden: !isShowable,
    };
  }, [tabId, tabPanelId, isShowable]);

  const contexts = useMemo<Contexts>(() => ({
    isSelected,
    isShowable,
    isDisabled,
    selectedIndex,
    index,
  }), [isSelected, isShowable, isDisabled, selectedIndex, index]);

  return [attributes, contexts];
}
