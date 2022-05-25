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
import DialogProvider from "./dialog_provider.ts";
import WithDialog from "./with_dialog.ts";
import { fireEvent, render } from "@testing-library/react";

const describeTests = describe({
  name: "WithAlertDialog",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as child", (t) => {
  const { container } = render(
    <WithDialog isShow>
      {(attributes) => {
        return <div {...attributes}></div>;
      }}
    </WithDialog>,
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

it(
  describeTests,
  "should have aria-labelledby attribute when hasTitle is true",
  (t) => {
    const { container } = render(
      <WithDialog isShow hasTitle>
        {(attrs) => <div {...attrs}></div>}
      </WithDialog>,
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
  },
);

it(
  describeTests,
  "should have aria-describedby attribute when hasDescribe is true",
  (t) => {
    const { container } = render(
      <WithDialog isShow hasDescribe>
        {(attrs) => (
          <div {...attrs}>
          </div>
        )}
      </WithDialog>,
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
  },
);

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  render(
    <WithDialog isShow>
      {(attributes, context) => {
        mockFn(attributes);
        mockFn(context);
        return <div></div>;
      }}
    </WithDialog>,
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

it(
  describeTests,
  "should focus focusable element on fire keyDown event with tab key",
  () => {
    const { getByTestId } = render(
      <WithDialog isShow>
        {(attrs) => (
          <div {...attrs}>
            <button data-testid="test1">1</button>
            <button data-testid="test2">2</button>
          </div>
        )}
      </WithDialog>,
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
      <WithDialog isShow onClose={mockFn}>
        {(attrs) => <div {...attrs}></div>}
      </WithDialog>,
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

    expect(mockFn).not.toHaveBeenCalled();

    fireEvent.keyDown(document, {
      code: "Escape",
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  },
);
