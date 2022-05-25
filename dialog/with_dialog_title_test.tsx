import {
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import WithDialogTitle from "./with_dialog_title.ts";
import DialogProvider from "./dialog_provider.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithDialogTitle",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithDialogTitle>
      {(attributes) => <h2 {...attributes}></h2>}
    </WithDialogTitle>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <DialogProvider>
            {children as never}
          </DialogProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  render(
    <WithDialogTitle>
      {(attributes) => {
        mockFn(attributes);
        return <div></div>;
      }}
    </WithDialogTitle>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <DialogProvider>
            {children as never}
          </DialogProvider>
        </SSRProvider>
      ),
    },
  );

  expect(mockFn).toHaveBeenCalledWith({
    id: anyString(),
  });
});
