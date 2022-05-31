import { FocusStrategy } from "./types.ts";
import { hasFocusElement } from "../util.ts";

export const RovingTabIndex: FocusStrategy = {
  child: {
    attrs: ({ isActive }) => {
      return {
        tabIndex: isActive ? 0 : -1,
      };
    },
  },

  parent: {
    effect: ({ activeElement }) => {
      if (activeElement && hasFocusElement(activeElement)) {
        activeElement.focus();
      }
    },
  },
};
