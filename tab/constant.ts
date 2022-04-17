// This module is browser compatible.

export const TYPE = Symbol.for("type");
export const TAB_PANEL = Symbol.for("tab-panel");
export const TAB = Symbol.for("tab");
export const TAB_LIST = Symbol.for("tab-list");
export const DEFAULT_INDEX = 0;

export const TAB_PREFIX = "tab";
export const TAB_PANEL_PREFIX = `${TAB_PREFIX}-panel` as const;
