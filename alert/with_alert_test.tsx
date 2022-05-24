import WithAlert from "./with_alert.ts";
import { assertSnapshot, expect, fn } from "../dev_deps.ts";
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
  const mockFn = fn();
  assertSnapshot(
    t,
    renderToStaticMarkup(
      <WithAlert>
        {(attributes) => {
          mockFn(attributes);
          return <span {...attributes}></span>;
        }}
      </WithAlert>,
    ),
  );

  expect(mockFn).toHaveBeenCalledWith({ role: "alert" });
});
