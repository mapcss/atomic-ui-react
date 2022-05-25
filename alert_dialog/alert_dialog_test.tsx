import AlertDialog from "./alert_dialog.ts";
import DialogProvider from "../dialog/dialog_provider.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { render } from "@testing-library/react";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";

const describeTests = describe({
  name: "AlertDialog",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as default", (t) => {
  const { container, rerender } = render(<AlertDialog isShow={false} />, {
    wrapper: ({ children }) => (
      <SSRProvider>
        <DialogProvider>
          {children as never}
        </DialogProvider>
      </SSRProvider>
    ),
  });

  assertSnapshot(t, container.innerHTML);

  rerender(<AlertDialog isShow />);
  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render as custom tag", (t) => {
  const { container, rerender } = render(<AlertDialog as="dialog" isShow />, {
    wrapper: ({ children }) => (
      <SSRProvider>
        <DialogProvider>
          {children as never}
        </DialogProvider>
      </SSRProvider>
    ),
  });

  assertSnapshot(t, container.innerHTML);

  rerender(<AlertDialog as="span" isShow />);
  assertSnapshot(t, container.innerHTML);
});
