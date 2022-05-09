import Breadcrumb from "./breadcrumb.ts";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "Breadcrumb",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should be match snapshot", (t) => {
  const { container } = render(
    <Breadcrumb>
      <a>test</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should add aria-current attribute to last element", (t) => {
  const { container } = render(
    <Breadcrumb>
      <a>1</a>
      <a>2</a>
      <a>3</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should change separator", (t) => {
  const { container } = render(
    <Breadcrumb separator={<span>{">"}</span>}>
      <a>1</a>
      <a>2</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should overwrite components", (t) => {
  const { container, rerender } = render(
    <Breadcrumb
      components={{
        nav: ({ children }) => <nav children={children} />,
      }}
    >
      <a>1</a>
      <a>2</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);

  rerender(
    <Breadcrumb
      components={{
        ol: (props) => <ul {...props} />,
      }}
    >
      <a>1</a>
      <a>2</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);

  rerender(
    <Breadcrumb
      components={{
        li: (props, { forSeparator }) =>
          forSeparator ? <></> : <li {...props} />,
      }}
    >
      <a>1</a>
      <a>2</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should disabled auto adding aria current attribute", (t) => {
  const { container } = render(
    <Breadcrumb
      disabledAriaCurrent
    >
      <a>1</a>
      <a>2</a>
    </Breadcrumb>,
  );

  assertSnapshot(t, container.innerHTML);
});

it(
  describeTests,
  "should not add aria-current when the last element is not anchor",
  (t) => {
    const { container } = render(
      <Breadcrumb>
        <div>not anchor</div>
      </Breadcrumb>,
    );

    assertSnapshot(t, container.innerHTML);
  },
);
