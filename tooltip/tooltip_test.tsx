import Tooltip from "./tooltip.ts";
import { assertSnapshot, describe, expect, it } from "../dev_deps.ts";
import { renderToStaticMarkup } from "react-dom/server";

describe("Tooltip", () => {
  it("should render markup", (t) => {
    assertSnapshot(t, renderToStaticMarkup(<Tooltip></Tooltip>));
    assertSnapshot(t, renderToStaticMarkup(<Tooltip>test</Tooltip>));
  });
});
