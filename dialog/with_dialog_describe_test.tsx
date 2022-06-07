import {
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import WithDialogDescribe from "./with_dialog_describe.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithDialogDescribe",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithDialogDescribe id="dialog-describe">
      {(attributes) => <div {...attributes}></div>}
    </WithDialogDescribe>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  render(
    <WithDialogDescribe id="dialog-describe">
      {(attributes) => {
        mockFn(attributes);
        return <div {...attributes}></div>;
      }}
    </WithDialogDescribe>,
  );

  expect(mockFn).toHaveBeenCalledWith({
    id: anyString(),
  });
});
