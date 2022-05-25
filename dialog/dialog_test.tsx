import Dialog from "./dialog.ts";
import DialogProvider from "./dialog_provider.ts";
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
  const { container, rerender } = render(<Dialog isShow={false} />, {
    wrapper: ({ children }) => (
      <SSRProvider>
        <DialogProvider>
          {children as never}
        </DialogProvider>
      </SSRProvider>
    ),
  });

  assertSnapshot(t, container.innerHTML);

  rerender(<Dialog isShow />);
  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render as custom tag", (t) => {
  const { container, rerender } = render(<Dialog as="dialog" isShow />, {
    wrapper: ({ children }) => (
      <SSRProvider>
        <DialogProvider>
          {children as never}
        </DialogProvider>
      </SSRProvider>
    ),
  });

  assertSnapshot(t, container.innerHTML);

  rerender(<Dialog as="span" isShow />);
  assertSnapshot(t, container.innerHTML);
});
