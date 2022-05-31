import { FocusStrategy } from "./types.ts";

const RovingTabIndex: FocusStrategy = {
  child: {
    attrs: ({ isActive }) => {
      return {
        tabIndex: isActive ? 0 : -1,
      };
    },
  },

  parent: {
    effect: ({ activeElement }) => {
      if (activeElement instanceof HTMLElement) {
        activeElement.focus();
      }
    },
  },
};

export default RovingTabIndex;
