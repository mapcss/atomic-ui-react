import { createElement, useMemo } from "react";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element the Switch should render as.
   * @default `button`
   */
  as?: As;

  /** Whether or not the switch is checked. */
  checked: boolean;

  /** The function to call when the switch is toggled. */
  onChange: (value: boolean) => void;
};

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function Switch<
  As extends keyof JSX.IntrinsicElements = "button",
>({ checked, onChange, as, ...rest }: Props<As>): JSX.Element {
  const _as = as ?? "button";

  const defaultAttrs = useMemo<Record<string, unknown>>(() => {
    if (_as === "button") {
      return {
        type: "button",
      };
    } else {
      return {};
    }
  }, [_as]);
  return createElement(
    _as,
    {
      role: "switch",
      "aria-checked": checked,
      onClick: () => onChange(!checked),
      ...defaultAttrs,
      ...rest,
    },
  );
}
