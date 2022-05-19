import WithToolbar from "./with_toolbar.ts";
import {
  assertSnapshot,
  describe,
  expect,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithToolbar",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithToolbar>
      <div>
        <button>1</button>
      </div>
    </WithToolbar>,
  );

  assertSnapshot(t, container.innerHTML);
});
