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
import AlertDialogProvider from "./alert_dialog_provider.ts";
import WithAlertDialog from "./with_alert_dialog.ts";
import WithDialogTitle from "./with_dialog_title.ts";
import WithDialogDescribe from "./with_dialog_describe.ts";
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
      <div>
      </div>
    </WithAlertDialog>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AlertDialogProvider>
            {children as ReactElement}
          </AlertDialogProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});

it(
  describeTests,
  "should have aria-labelledby attribute when WithDialogTitle is exists",
  (t) => {
    const { container } = render(
      <WithAlertDialog isShow>
        <div>
          <WithDialogTitle>
            <h2>test</h2>
          </WithDialogTitle>
        </div>
      </WithAlertDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            <AlertDialogProvider>
              {children as ReactElement}
            </AlertDialogProvider>
          </SSRProvider>
        ),
      },
    );

    assertSnapshot(t, container.innerHTML);
  },
);

it(
  describeTests,
  "should have aria-describedby attribute when WithDialogDescribe is exists",
  (t) => {
    const { container } = render(
      <WithAlertDialog isShow>
        <div>
          <WithDialogDescribe>
            <p>test</p>
          </WithDialogDescribe>
        </div>
      </WithAlertDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            <AlertDialogProvider>
              {children as ReactElement}
            </AlertDialogProvider>
          </SSRProvider>
        ),
      },
    );

    assertSnapshot(t, container.innerHTML);
  },
);

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
          <AlertDialogProvider>
            {children as ReactElement}
          </AlertDialogProvider>
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
            <AlertDialogProvider>
              {children as ReactElement}
            </AlertDialogProvider>
          </SSRProvider>
        ),
      },
    );

    const el1 = getByTestId("test1");
    const el2 = getByTestId("test2");
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

it(
  describeTests,
  "should call onClose callback when escape is keyed",
  () => {
    const mockFn = fn();
    render(
      <WithAlertDialog isShow onClose={mockFn}>
        <div></div>
      </WithAlertDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            <AlertDialogProvider>
              {children as ReactElement}
            </AlertDialogProvider>
          </SSRProvider>
        ),
      },
    );

    expect(mockFn).not.toHaveBeenCalled();

    fireEvent.keyDown(document, {
      code: "Escape",
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  },
);
