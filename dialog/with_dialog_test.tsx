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
    <WithDialog isShow setIsShow={() => {}}>
      {(attributes) => {
        return <div {...attributes}></div>;
      }}
    </WithDialog>,
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

it(
  describeTests,
  "should have aria-labelledby attribute when hasTitle is true",
  (t) => {
    const { container } = render(
      <WithDialog hasTitle isShow setIsShow={() => {}}>
        {(attrs) => <div {...attrs}></div>}
      </WithDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            {children as ReactElement}
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
      <WithDialog hasDescribe isShow setIsShow={() => {}}>
        {(attrs) => (
          <div {...attrs}>
          </div>
        )}
      </WithDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            {children as ReactElement}
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
    <WithDialog isShow={false} setIsShow={() => {}}>
      {(attributes, context) => {
        mockFn(attributes);
        mockFn(context);
        return <div></div>;
      }}
    </WithDialog>,
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

it(
  describeTests,
  "should focus focusable element on fire keyDown event with tab key",
  () => {
    const { getByTestId } = render(
      <WithDialog isShow setIsShow={() => {}}>
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
            {children as ReactElement}
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
      <WithDialog isShow setIsShow={mockFn}>
        {(attrs) => <div {...attrs}></div>}
      </WithDialog>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            {children as ReactElement}
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
