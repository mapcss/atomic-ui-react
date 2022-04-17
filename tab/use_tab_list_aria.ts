import { useMemo } from "react";
import { isBoolean } from "../deps.ts";

export type Param = {
  /** When `true`, the orientation of the `TabList` will be `horizontal`, When `false` will be `vertical` */
  isHorizontal: boolean;
};

export type ReturnValue = Pick<
  JSX.IntrinsicElements[keyof JSX.IntrinsicElements],
  "aria-orientation" | "role"
>;

export default function useTabListAria(
  { isHorizontal }: Readonly<Partial<Param>> = {},
): ReturnValue {
  const aria = useMemo<ReturnValue>(() => {
    return {
      role: "tablist",
      "aria-orientation": isBoolean(isHorizontal)
        ? isHorizontal ? "horizontal" : "vertical"
        : undefined,
    };
  }, [isHorizontal]);

  return aria;
}
