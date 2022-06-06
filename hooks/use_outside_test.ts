import useOutside from "./use_outside.ts";
import { describe, expect, fn, it, setupJSDOM } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";

const describeTests = describe({
  name: "useOutside",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should fire event when outside element is fired", () => {
  const mockFn = fn();
  const outer = document.createElement("div");
  outer.innerText = "outer";
  const inner = document.createElement("div");
  inner.innerText = "inner";
  const trigger = document.createElement("div");
  trigger.innerText = "trigger";
  trigger.appendChild(inner);
  outer.appendChild(trigger);
  document.body.appendChild(outer);

  const { result, rerender } = renderHook(({ target }) =>
    useOutside({
      callback: (ev) => {
        mockFn(ev);
      },
      target,
    }), {
    initialProps: {
      target: inner,
    },
  });

  trigger.onclick = result.current;
  expect(mockFn).not.toHaveBeenCalled();

  fireEvent.click(trigger);
  expect(mockFn).not.toHaveBeenCalled();

  rerender({ target: trigger });
  trigger.onclick = result.current;

  fireEvent.click(trigger);
  expect(mockFn).not.toHaveBeenCalled();

  rerender({ target: outer });
  trigger.onclick = result.current;

  fireEvent.click(trigger);
  expect(mockFn).toHaveBeenCalled();
});
