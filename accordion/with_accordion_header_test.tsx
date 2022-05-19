import {
  anyBoolean,
  anyFunction,
  anyNumber,
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { ReactNode } from "react";
import SSRProvider from "../ssr/ssr_provider.ts";
import WithAccordionHeader from "./with_accordion_header.ts";
import AccordionProvider from "./accordion_provider.ts";
import { fireEvent, render } from "@testing-library/react";

const describeTests = describe({
  name: "WithAccordionHeader",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container, getByTestId } = render(
    <>
      <WithAccordionHeader>
        <button data-testid="test1">test1</button>
      </WithAccordionHeader>
      <WithAccordionHeader>
        <button data-testid="test2">test2</button>
      </WithAccordionHeader>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AccordionProvider>{children as ReactNode}</AccordionProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);

  fireEvent.click(getByTestId("test2"));
  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should focus on keyboard event", (t) => {
  const { getByTestId, rerender } = render(
    <>
      <WithAccordionHeader>
        <button data-testid="test1">test1</button>
      </WithAccordionHeader>
      <WithAccordionHeader>
        <button data-testid="test2">test2</button>
      </WithAccordionHeader>
      <WithAccordionHeader>
        <button data-testid="test3">test3</button>
      </WithAccordionHeader>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AccordionProvider>{children as ReactNode}</AccordionProvider>
        </SSRProvider>
      ),
    },
  );

  const el1 = getByTestId("test1");
  const el2 = getByTestId("test2");
  const el3 = getByTestId("test3");
  el1.focus();

  expect(el1).toHaveFocus();

  fireEvent.keyDown(document.activeElement!, {
    code: "ArrowDown",
  });

  expect(el2).toHaveFocus();

  fireEvent.keyDown(document.activeElement!, {
    code: "Space",
  });
  expect(el1).toHaveAttribute("aria-expanded", "false");
  expect(el2).toHaveAttribute("aria-expanded", "true");

  fireEvent.keyDown(document.activeElement!, {
    code: "ArrowDown",
  });
  expect(el3).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, {
    code: "Enter",
  });
  expect(el2).toHaveAttribute("aria-expanded", "false");
  expect(el3).toHaveAttribute("aria-expanded", "true");

  fireEvent.keyDown(document.activeElement!, {
    code: "ArrowDown",
  });

  expect(el1).toHaveFocus();

  fireEvent.keyDown(document.activeElement!, {
    code: "ArrowUp",
  });

  expect(el3).toHaveFocus();

  fireEvent.keyDown(document.activeElement!, {
    code: "Home",
  });

  expect(el1).toHaveFocus();

  fireEvent.keyDown(document.activeElement!, {
    code: "End",
  });

  expect(el3).toHaveFocus();

  fireEvent.keyUp(document.activeElement!, {
    code: "Home",
  });
  expect(el3).toHaveFocus();

  rerender(
    <>
      <WithAccordionHeader onKey={["onKeyUp"]}>
        <button data-testid="test1">test1</button>
      </WithAccordionHeader>
      <WithAccordionHeader onKey={["onKeyUp"]}>
        <button data-testid="test2">test2</button>
      </WithAccordionHeader>
      <WithAccordionHeader onKey={["onKeyUp"]}>
        <button data-testid="test3">test3</button>
      </WithAccordionHeader>
    </>,
  );

  expect(el3).toHaveFocus();

  fireEvent.keyUp(document.activeElement!, {
    code: "Home",
  });

  expect(el1).toHaveFocus();
});

it(describeTests, "should change open event handler", (t) => {
  const { getByTestId, rerender } = render(
    <>
      <WithAccordionHeader>
        <button data-testid="test1">test1</button>
      </WithAccordionHeader>
      <WithAccordionHeader>
        <button data-testid="test2">test2</button>
      </WithAccordionHeader>
      <WithAccordionHeader>
        <button data-testid="test3">test3</button>
      </WithAccordionHeader>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AccordionProvider>{children as ReactNode}</AccordionProvider>
        </SSRProvider>
      ),
    },
  );

  const el2 = getByTestId("test2");
  expect(el2).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(el2);
  expect(el2).toHaveAttribute("aria-expanded", "true");

  rerender(
    <>
      <WithAccordionHeader on={["onMouseEnter"]}>
        <button data-testid="test1">test1</button>
      </WithAccordionHeader>
      <WithAccordionHeader on={["onMouseEnter"]}>
        <button data-testid="test2">test2</button>
      </WithAccordionHeader>
      <WithAccordionHeader on={["onMouseEnter"]}>
        <button data-testid="test3">test3</button>
      </WithAccordionHeader>
    </>,
  );

  const el3 = getByTestId("test3");
  expect(el3).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(el3);
  expect(el3).toHaveAttribute("aria-expanded", "false");

  fireEvent.mouseEnter(el3);
  expect(el3).toHaveAttribute("aria-expanded", "true");
});

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  const { container } = render(
    <>
      <WithAccordionHeader>
        {(attrs, context) => {
          mockFn(attrs);
          mockFn(context);
          return <button {...attrs}>test</button>;
        }}
      </WithAccordionHeader>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AccordionProvider>{children as ReactNode}</AccordionProvider>
        </SSRProvider>
      ),
    },
  );
  assertSnapshot(t, container.innerHTML);

  expect(mockFn).toHaveBeenCalledWith({
    "aria-expanded": anyBoolean(),
    "aria-controls": anyString(),
    id: anyString(),
    onClick: anyFunction(),
    onKeyDown: anyFunction(),
    tabIndex: anyNumber(),
  });

  expect(mockFn).toHaveBeenCalledWith({
    isOpen: anyBoolean(),
    open: anyFunction(),
    index: anyNumber(),
    focusFirst: anyFunction(),
    focusLast: anyFunction(),
    focusNext: anyFunction(),
    focusPrev: anyFunction(),
  });
});
