import WithAlert from "./with_alert.ts";
import { assertSnapshot } from "../dev_deps.ts";
import { renderToStaticMarkup } from "react-dom/server";

Deno.test("WithAlert should render as", (t) => {
  assertSnapshot(
    t,
    renderToStaticMarkup(
      <WithAlert>
        <div>test</div>
      </WithAlert>,
    ),
  );
});

Deno.test("WithAlert should children as function", (t) => {
  assertSnapshot(
    t,
    renderToStaticMarkup(
      <WithAlert>
        {(attributes) => <span {...attributes}></span>}
      </WithAlert>,
    ),
  );
});
