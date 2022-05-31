import { FocusStrategy } from "./types.ts";

const RovingTabIndex: FocusStrategy = {
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
  },
};

export default RovingTabIndex;
