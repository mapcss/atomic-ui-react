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
import { ReactElement } from "react";
import SSRProvider from "../ssr/ssr_provider.ts";
import WithAlertDialog from "./with_alert_dialog.ts";
import { fireEvent, render } from "@testing-library/react";

const describeTests = describe({
  name: "WithAlertDialog",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <WithAlertDialog isShow>
      <div></div>
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
          {children as ReactElement}
        </SSRProvider>
      ),
    },
  );

  expect(mockFn).toHaveBeenCalledWith({
    "aria-describedby": anyString(),
    "aria-labelledby": anyString(),
    "aria-modal": anyString(),
    role: anyString(),
  });
  expect(mockFn).toHaveBeenCalledWith({
    focusPrev: anyFunction(),
    focusNext: anyFunction(),
    isShow: anyBoolean(),
  });
});

it(
  describeTests,
  "should focus focusable element on fire keyDown event with tab key",
  () => {
    const { getByTestId } = render(
      <WithAlertDialog isShow>
        <div>
          <button data-testid="test1">1</button>
          <button data-testid="test2">2</button>
        </div>
      </WithAlertDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            {children as ReactElement}
          </SSRProvider>
        ),
      },
    );

    const el1 = getByTestId("test1");
    const el2 = getByTestId("test2");
    expect(el1).not.toHaveFocus();
    fireEvent.keyDown(document, {
      code: "Tab",
    });

    expect(el1).toHaveFocus();

    fireEvent.keyDown(document, {
      code: "Tab",
    });
    expect(el2).toHaveFocus();

    fireEvent.keyDown(document, {
      code: "Tab",
    });
    expect(el1).toHaveFocus();

    fireEvent.keyDown(document, {
      code: "Tab",
      shiftKey: true,
    });
    expect(el2).toHaveFocus();
  },
);
