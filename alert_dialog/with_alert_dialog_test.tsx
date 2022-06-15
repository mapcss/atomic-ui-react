import {
  anyBoolean,
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
    <WithAlertDialog isShow setIsShow={() => {}}>
      {(attributes) => <div {...attributes} />}
    </WithAlertDialog>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          {children as ReactElement}
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  render(
    <WithAlertDialog isShow setIsShow={() => {}}>
      {(attributes, context) => {
        mockFn(attributes);
        mockFn(context);
        return <div></div>;
      }}
    </WithAlertDialog>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          {children as ReactElement}
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
    hidden: anyBoolean(),
  });
  expect(mockFn).toHaveBeenCalledWith({
    titleId: undefined,
    describeId: undefined,
    isShow: anyBoolean(),
    setIsShow: anyFunction(),
    root: anyFunction(),
  });
});
