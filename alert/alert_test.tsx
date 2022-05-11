import Alert from "./alert.ts";
import { assertSnapshot } from "../dev_deps.ts";
import { renderToStaticMarkup } from "react-dom/server";

Deno.test("Alert should render as", (t) => {
  assertSnapshot(t, renderToStaticMarkup(<Alert>test</Alert>));
});

Deno.test("Alert should change tag", (t) => {
  assertSnapshot(
    t,
    renderToStaticMarkup(<Alert as="span" className="test">test</Alert>),
  );
});
