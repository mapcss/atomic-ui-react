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
import WithDialogDescribe from "./with_dialog_describe.ts";
import AlertDialogProvider from "./alert_dialog_provider.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithDialogDescribe",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithDialogDescribe>
      <div></div>
    </WithDialogDescribe>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AlertDialogProvider>
            {children as never}
          </AlertDialogProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  render(
    <WithDialogDescribe>
      {(attributes) => {
        mockFn(attributes);
        return <div {...attributes}></div>;
      }}
    </WithDialogDescribe>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AlertDialogProvider>
            {children as never}
          </AlertDialogProvider>
        </SSRProvider>
      ),
    },
  );

  expect(mockFn).toHaveBeenCalledWith({
    id: anyString(),
  });
});
