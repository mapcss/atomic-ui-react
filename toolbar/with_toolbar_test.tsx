import WithToolbar from "./with_toolbar.ts";
import {
  assertSnapshot,
  describe,
  expect,
  fn,
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

it(describeTests, "should render as children", (t) => {
  const mockFn = fn();
  const { container } = render(
    <WithToolbar>
      {(attributes) => {
        mockFn(attributes);
        return (
          <div {...attributes}>
            <button>1</button>
          </div>
        );
      }}
    </WithToolbar>,
  );

  assertSnapshot(t, container.innerHTML);
  expect(mockFn).toHaveBeenCalledWith({
    role: "toolbar",
  });
});
