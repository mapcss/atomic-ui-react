import { useCallback } from "react";
import { JSONStringify } from "../util.ts";
import { Fn } from "../deps.ts";

/** Bind arguments to the function. The actual binding is done when the function is called.
 * @param fn Function to bind arguments.
 * @param args bind arguments.
 * ```tsx
 * import { useState } from "react";
 * import { useBind } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * function add(a: number, b: number): number {
 *   return a + b;
 * }
 * export default () => {
 *   const [state, setState] = useState(0);
 *   const inc = useBind(setState, (state) => state + 1);
 *   // inc()
 *   const add1 = useBind(add, 1);
 *   // add1(2) // 3
 * };
 * ```
 */
export default function useBind<
  // deno-lint-ignore no-explicit-any
  F extends Fn<readonly any[]>,
  Args extends Sequence<Parameters<F>>,
>(fn: F, ...args: Args): (
  ...rest: Slice<Parameters<F>, Args["length"], Parameters<F>["length"]>
) => ReturnType<F> {
  const callback = useCallback<
    (
      ...rest: Slice<Parameters<F>, Args["length"], Parameters<F>["length"]>
    ) => ReturnType<F>
  >((...rest) => fn.bind(null, ...args).apply(null, rest), [
    fn,
    JSONStringify(args),
  ]);

  return callback;
}

/**
 * @see https://github.com/type-challenges/type-challenges/issues/9122
 */
type Slice<
  Arr extends readonly unknown[],
  Start extends number = 0,
  End extends number = Arr["length"],
> = isNegative<End> extends true
  ? Slice<Arr, Start, BigMinusSmall<Arr["length"], toAbsolute<End>>>
  : isNegative<Start> extends true
    ? Slice<Arr, BigMinusSmall<Arr["length"], toAbsolute<Start>>, End>
  : SliceImpl<Arr, Start, End>;

type SliceImpl<
  Arr,
  Start extends number,
  End extends number,
  Idx extends number = 0,
  Res extends unknown[] = [],
> = Arr extends [infer One, ...infer Rest]
  ? And<isGreaterEqual<Idx, Start>, isSmaller<Idx, End>> extends true
    ? SliceImpl<Rest, Start, End, Add1<Idx>, [...Res, One]>
  : SliceImpl<Rest, Start, End, Add1<Idx>, Res>
  : Res;

type CreateTupple<S extends number, R extends 1[] = []> = R["length"] extends S
  ? R
  : CreateTupple<S, [...R, 1]>;

type Minus1<S extends number> = CreateTupple<S> extends [...infer Head, infer _]
  ? Head["length"]
  : 0;
type Add1<S extends number> = S extends 0 ? 1
  : [...CreateTupple<S>, 1]["length"];
type BigMinusSmall<X1 extends number, X2 extends number> = X2 extends 0 ? X1
  : BigMinusSmall<Minus1<X1>, Minus1<X2>>;
type isEqual<X1 extends number, X2 extends number> = X1 extends X2 ? true
  : false;
type isGreater<X1 extends number, X2 extends number> = X1 extends 0 ? false
  : X2 extends 0 ? true
  : isGreater<Minus1<X1>, Minus1<X2>>;
type isSmaller<X1 extends number, X2 extends number> = X2 extends 0 ? false
  : X1 extends 0 ? true
  : isSmaller<Minus1<X1>, Minus1<X2>>;
type isGreaterEqual<X1 extends number, X2 extends number> = Or<
  isGreater<X1, X2>,
  isEqual<X1, X2>
>;

type toNumber<S extends string, Res extends 1[] = []> =
  `${Res["length"]}` extends S ? Res["length"] : toNumber<S, [...Res, 1]>;
type isNegative<S extends number> = `${S}` extends `-${infer _}` ? true
  : false;
type toAbsolute<S extends number> = isNegative<S> extends false ? S
  : `${S}` extends `-${infer R}` ? toNumber<R>
  : never;

type Or<C1, C2> = C1 extends true ? true : C2 extends true ? true : false;
type And<C1, C2> = C1 extends true ? C2 extends true ? true : false : false;

// deno-lint-ignore no-explicit-any
type Sequence<T extends readonly any[]> = T extends [infer F, ...infer R]
  ? [F, ...Sequence<R>] | [F]
  : [];
