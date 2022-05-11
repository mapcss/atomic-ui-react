import TooltipProvider from "./tooltip_provider.ts";
import Tooltip from "./tooltip.ts";
import {
  assertSnapshot,
  describe,
  expect,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { renderToStaticMarkup } from "react-dom/server";
import { fireEvent, render } from "@testing-library/react";

describe("TooltipProvider", () => {
  it("should render markup", (t) => {
    assertSnapshot(
      t,
      renderToStaticMarkup(<TooltipProvider>{() => <></>}</TooltipProvider>),
    );
    assertSnapshot(
      t,
      renderToStaticMarkup(
        <TooltipProvider as="span">
          {() => <></>}
        </TooltipProvider>,
      ),
    );
  });
});

const describeTooltipProvider = describe({
  name: "TooltipProvider",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(
  describeTooltipProvider,
  "should render tooltip when mouseenter, remove tooltip when mouseleave",
  (t) => {
    const result = render(
      <TooltipProvider>
        {({ isShow, ref }) => (
          <>
            <button data-testid="test" ref={ref}></button>
            {isShow && <Tooltip>Tooltip</Tooltip>}
          </>
        )}
      </TooltipProvider>,
    );

    assertSnapshot(t, result.baseElement.innerHTML);
    const target = result.getByTestId("test");
    fireEvent.mouseEnter(target);
    assertSnapshot(t, result.baseElement.innerHTML);
    fireEvent.mouseLeave(target);
    assertSnapshot(t, result.baseElement.innerHTML);
  },
);
