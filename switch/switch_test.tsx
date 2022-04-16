import Switch from "./switch.ts";
import { expect, fn, setupJSDOM } from "../dev_deps.ts";

Deno.test("Switch as default element", async () => {
  setupJSDOM();
  const { render, fireEvent } = await import(
    "@testing-library/react"
  )
    .then((module) => module.default);
  const mockFn = fn();
  const result = render(
    <Switch checked={false} onChange={mockFn} />,
  );

  const switchEl = result.getByRole("switch");
  expect(mockFn).not.toHaveBeenCalled();
  expect(switchEl.getAttribute("aria-checked")).toBe("false");

  fireEvent.click(switchEl);
  expect(mockFn).toHaveBeenCalledWith(true);
  result.rerender(<Switch checked={true} onChange={mockFn} />);
  expect(switchEl.getAttribute("aria-checked")).toBe("true");
});

Deno.test("Switch as div element", async () => {
  setupJSDOM();
  const { render } = await import(
    "@testing-library/react"
  )
    .then((module) => module.default);
  const mockFn = fn();
  const result = render(
    <Switch as="div" checked={false} onChange={mockFn} />,
  );

  const switchEl = result.getByRole("switch");
  expect(switchEl.getAttribute("type")).toBe(null);
});
