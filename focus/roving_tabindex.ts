import { FocusStrategy } from "./types.ts";
import { hasFocusElement } from "../util.ts";
import scrollIntoViewIfNeeded from "./scroll_into_view_if_needed.ts";

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
      if (activeElement && hasFocusElement(activeElement)) {
        activeElement.focus({ preventScroll: true });
        scrollIntoViewIfNeeded(activeElement);
      }
    },
  },
};

export default RovingTabIndex;
