import Dialog from "./dialog.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { render } from "@testing-library/react";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";

const describeTests = describe({
  name: "Dialog",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as default", (t) => {
  const { container, rerender } = render(<Dialog />, {
    wrapper: ({ children }) => (
      <SSRProvider>
        {children as never}
      </SSRProvider>
    ),
  });

  assertSnapshot(t, container.innerHTML);

  rerender(<Dialog isShow setIsShow={() => {}} />);
  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render as custom tag", (t) => {
  const { container, rerender } = render(
    <Dialog as="dialog" initialIsShow />,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          {children as never}
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);

  rerender(<Dialog as="span" initialIsShow />);
  assertSnapshot(t, container.innerHTML);
});
