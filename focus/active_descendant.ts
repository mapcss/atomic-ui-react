import { FocusStrategy } from "./types.ts";
import scrollIntoViewIfNeeded from "./scroll_into_view_if_needed.ts";

const ActiveDescendant: FocusStrategy = {
  child: {
    attrs: ({ id }) => {
      return { id, tabIndex: -1 };
    },
  },

  parent: {
    attrs: ({ activeElement }) => {
      return {
        "aria-activedescendant": activeElement?.id,
        tabIndex: 0,
      };
    },
    effect: ({ activeElement }) => {
      if (activeElement) {
        scrollIntoViewIfNeeded(activeElement);
      }
    },
  },
};

export default ActiveDescendant;
