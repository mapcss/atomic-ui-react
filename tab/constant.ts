// This module is browser compatible.

export const TAB_PREFIX = "tab";
export const TAB_PANEL_PREFIX = `${TAB_PREFIX}-panel` as const;
export const TYPE = Symbol.for("type");
export const TAB_PANEL = Symbol.for(TAB_PANEL_PREFIX);
export const TAB = Symbol.for(TAB_PREFIX);
export const TAB_LIST = Symbol.for(`${TAB_PREFIX}-list`);
export const DEFAULT_INDEX = 0;
