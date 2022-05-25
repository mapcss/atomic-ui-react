import {
  anyFunction,
  anyObject,
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { ReactElement } from "react";
import SSRProvider from "../ssr/ssr_provider.ts";
import DialogProvider from "../dialog/dialog_provider.ts";
import WithAlertDialog from "./with_alert_dialog.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithAlertDialog",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithAlertDialog isShow>
      {(attributes) => <div {...attributes} />}
    </WithAlertDialog>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <DialogProvider>
            {children as ReactElement}
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
    <WithAlertDialog isShow>
      {(attributes, context) => {
        mockFn(attributes);
        mockFn(context);
        return <div></div>;
      }}
    </WithAlertDialog>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <DialogProvider>
            {children as ReactElement}
          </DialogProvider>
        </SSRProvider>
      ),
    },
  );

  expect(mockFn).toHaveBeenCalledWith({
    "aria-describedby": undefined,
    "aria-labelledby": undefined,
    "aria-modal": anyString(),
    role: anyString(),
    ref: anyObject(),
    hidden: undefined,
  });
  expect(mockFn).toHaveBeenCalledWith({
    focusPrev: anyFunction(),
    focusNext: anyFunction(),
    focusFirst: anyFunction(),
    focusLast: anyFunction(),
    close: undefined,
  });
});
