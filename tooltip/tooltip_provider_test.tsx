import TooltipProvider from "./tooltip_provider.ts";
import { assertSnapshot, describe, expect, it } from "../dev_deps.ts";
import { renderToStaticMarkup } from "react-dom/server";

describe("TooltipProvider", () => {
  it("should render markup", (t) => {
    assertSnapshot(
      t,
      renderToStaticMarkup(<TooltipProvider>{() => <></>}</TooltipProvider>),
    );
    assertSnapshot(
      t,
      renderToStaticMarkup(
        <TooltipProvider wrapper={(props) => <span {...props} />}>
          {() => <></>}
        </TooltipProvider>,
      ),
    );
  });
});
