import {
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import WithDialogTitle from "./with_dialog_title.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithDialogTitle",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithDialogTitle id="dialog-title">
      {(attributes) => <h2 {...attributes}></h2>}
    </WithDialogTitle>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  render(
    <WithDialogTitle id="dialog-title">
      {(attributes) => {
        mockFn(attributes);
        return <div></div>;
      }}
    </WithDialogTitle>,
  );

  expect(mockFn).toHaveBeenCalledWith({
    id: anyString(),
  });
});
