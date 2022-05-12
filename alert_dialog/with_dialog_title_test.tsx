import {
  anyBoolean,
  anyFunction,
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
import WithAlertDialog from "./with_alert_dialog.ts";
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
      <h2></h2>
    </WithDialogTitle>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <WithAlertDialog isShow>
            <div>
              {children}
            </div>
          </WithAlertDialog>
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
      {(attributes, context) => {
        mockFn(attributes);
        mockFn(context);
        return <div></div>;
      }}
    </WithDialogTitle>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <WithAlertDialog isShow>
            <div>
              {children}
            </div>
          </WithAlertDialog>
        </SSRProvider>
      ),
    },
  );

  expect(mockFn).toHaveBeenCalledWith({
    id: anyString(),
  });
  expect(mockFn).toHaveBeenCalledWith({
    focusPrev: anyFunction(),
    focusNext: anyFunction(),
    isShow: anyBoolean(),
  });
});
