import {
  cleanCharacter,
  cleanTokens,
  equal,
  isBrowser,
  joinChars,
  mergeProps,
  omitRef,
  tokenize,
} from "./util.ts";
import {
  describe,
  expect,
  fn,
  it,
  ParamReturn,
  setupJSDOM,
} from "./dev_deps.ts";
import { resolveElementLike } from "./util.ts";

Deno.test("isBrowser", () => {
  expect(isBrowser).toBeFalsy();
});

const resolveElementTest = describe({
  name: "resolveElementLike",
  beforeAll: setupJSDOM,
});

it(resolveElementTest, "should return element or undefined/null", () => {
  const el = globalThis.document.createElement("div");
  expect(resolveElementLike(null)).toBe(null);
  expect(resolveElementLike(undefined)).toBe(undefined);
  expect(resolveElementLike(el)).toEqual(el);
  expect(resolveElementLike(() => el)).toEqual(el);
  expect(resolveElementLike(() => undefined)).toBe(undefined);
  expect(resolveElementLike({ current: el })).toEqual(el);
});

Deno.test("joinChars", () => {
  const table: ParamReturn<typeof joinChars>[] = [
    [[""], " ", undefined],
    [[undefined], " ", undefined],
    [[undefined, undefined], " ", undefined],
    [[undefined, undefined, ""], " ", undefined],
    [[" "], " ", undefined],
    [[undefined, undefined, " "], " ", undefined],
    [["test"], " ", "test"],
    [[" test "], " ", "test"],
    [["test", "test2"], " ", "test test2"],
    [[" test ", "tes t"], " ", "test tes t"],
    [
      ["", "a", " b", undefined, "c ", " d ", " ef g ", undefined],
      " ",
      "a b c d ef g",
    ],
    [
      ["ab", "ab"],
      " ",
      "ab ab",
    ],
    [
      ["id", undefined, "2 "],
      "-",
      "id-2",
    ],
    [
      ["id", undefined, "2", " "],
      "-",
      "id-2",
    ],
    [
      ["id", undefined, "    ", "2", " ", "  3 "],
      "-",
      "id-2-3",
    ],
    [
      [0, 1, "2", "3"],
      "-",
      "0-1-2-3",
    ],
  ];
  table.forEach(([value, separator, result]) =>
    expect(joinChars(value, separator)).toBe(result)
  );
});

Deno.test("cleanCharacter", () => {
  const table: ParamReturn<typeof cleanCharacter>[] = [
    ["", ""],
    ["   ", ""],
    ["This  is sunny !   ", "This is sunny !"],
  ];

  table.forEach(([value, result]) =>
    expect(cleanCharacter(value)).toBe(result)
  );
});

Deno.test("tokenize", () => {
  const table: ParamReturn<typeof tokenize>[] = [
    ["", []],
    [" ", []],
    ["       ", []],
    ["a", ["a"]],
    ["a b", ["a", "b"]],
    ["   a b,  c  d  ,e ", ["a", "b,", "c", "d", ",e"]],
    [" a a b b ", ["a", "a", "b", "b"]],
  ];
  table.forEach(([value, result]) => expect(tokenize(value)).toEqual(result));
});

Deno.test("cleanTokens", () => {
  const table: ParamReturn<typeof cleanTokens>[] = [
    [[], []],
    [[""], []],
    [[undefined], []],
    [[undefined, "a", undefined], ["a"]],
    [["       ", "      "], []],
    [["a"], ["a"]],
    [["a", "b"], ["a", "b"]],
    [["a a a", "b"], ["a", "b"]],
    [["  a  b  c  ", "b", " cd ef ghi ", " jkl "], [
      "a",
      "b",
      "c",
      "cd",
      "ef",
      "ghi",
      "jkl",
    ]],
  ];
  table.forEach(([value, result]) =>
    expect(cleanTokens(value)).toEqual(result)
  );
});

Deno.test("mergeProps", () => {
  const table: ParamReturn<typeof mergeProps>[] = [
    [{}, {}, {}],
    [{ "": "" }, {}, { "": "" }],
    [{ "": "abc" }, { "": "def" }, { "": "def" }],
    [{ "": "" }, { "": 1 }, { "": 1 }],
    [{ a: "b", c: "d" }, { e: "f", g: "h" }, {
      a: "b",
      c: "d",
      e: "f",
      g: "h",
    }],
    [{ className: "" }, { className: "" }, { className: "" }],
    [{ className: "" }, { className: undefined }, { className: "" }],
    [{ className: undefined }, { className: "" }, { className: "" }],
    [{ className: undefined }, { className: undefined }, {
      className: undefined,
    }],
    [{ className: "test" }, { className: "test" }, { className: "test" }],
    [{ className: "test test2" }, { className: "test" }, {
      className: "test test2",
    }],
    [{ className: "  test   test2   " }, { className: "   test3 test4    " }, {
      className: "test test2 test3 test4",
    }],
    [{ style: { display: "none" } }, { style: { visibility: "visible" } }, {
      style: { display: "none", visibility: "visible" },
    }],
    [{ style: { display: "none" } }, { style: { display: "block" } }, {
      style: { display: "block" },
    }],
  ];

  table.forEach(([a, b, result]) => expect(mergeProps(a, b)).toEqual(result));
});

Deno.test("mergeProps: merge event handler", () => {
  const onClick1 = fn();
  const onClick2 = fn();

  const props = mergeProps({ onClick: onClick1 }, { onClick: onClick2 });

  expect(onClick1).not.toHaveBeenCalled();
  expect(onClick2).not.toHaveBeenCalled();
  props.onClick(1);
  expect(onClick1).toHaveBeenCalledWith(1);
  expect(onClick2).toHaveBeenCalledWith(1);
});

Deno.test("omitRef: no ref key from record", () => {
  expect(omitRef({})).toEqual({});
  expect(omitRef({ ref: null })).toEqual({});
  expect(omitRef({ ref: { current: null } })).toEqual({});
  expect(omitRef({ ref: null, a: "b" })).toEqual({ a: "b" });
});

Deno.test("equal should be same Value Zero as default", () => {
  const table: ParamReturn<typeof equal>[] = [
    [0, -0, true],
    [-0, 0, true],
    [NaN, NaN, true],
    [+0, -0, true],
    [-0, +0, true],
  ];

  table.forEach(([a, b, result]) => {
    expect(equal(a, b)).toBe(result);
  });
});

Deno.test("equal should ensure equality is primitive and Object and Array as default", () => {
  const table: ParamReturn<typeof equal>[] = [
    ["world", "world", true],
    ["hello", "world", false],
    ["world", "hello", false],
    [5, 5, true],
    [5, 6, false],
    [6, 5, false],
    [null, undefined, false],
    [null, null, true],
    [() => {}, () => {}, false],
    [{}, {}, true],
    [{ hello: "world" }, { hello: "world" }, true],
    [{ world: "hello" }, { hello: "world" }, false],
    [
      { hello: "world", hi: { there: "everyone" } },
      { hello: "world", hi: { there: "everyone" } },
      true,
    ],
    [
      { hello: "world", hi: { there: "everyone" } },
      { hello: "world", hi: { there: "everyone else" } },
      false,
    ],
    [{ hello: "world", hi: { there: "everyone" } }, {
      hello: "world",
      hi: { there: "everyone else" },
    }, false],
    [{ [Symbol.for("foo")]: "bar" }, { [Symbol.for("foo")]: "bar" }, true],
    [{ [Symbol("foo")]: "bar" }, { [Symbol("foo")]: "bar" }, false],
    [[], [], true],
    [[1, 2, 3, 4], [1, 2, 3, 4], true],
    [[4, 3, 2, 1], [1, 2, 3, 4], false],
    [[{}], [{}], true],
    [[{}, {}, {}, {}], [{}, {}, {}, {}], true],
    [[{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }], true],
    [[{ a: 2 }, { b: 3 }], [{ a: 1 }, { b: 2 }], false],
    [[{ a: 1 }, { b: 3 }], [{ a: 1 }, { b: 2 }], false],
    [{ a: [] }, { a: [] }, true],
    [{ a: [1, 2, 3] }, { a: [1, 2, 3] }, true],
    [{ a: [1, 2, 4] }, { a: [1, 2, 3] }, false],
    [{ a: { b: { c: "d" } } }, { a: { b: { c: "d" } } }, true],
    [{ a: { b: { c: "d", e: "f" } } }, { a: { b: { c: "d", e: "g" } } }, false],
    [{ a: { b: { c: "d", e: ["f", "g", {}] } } }, {
      a: { b: { c: "d", e: ["f", "g", {}] } },
    }, true],
  ];

  table.forEach(([a, b, result]) => {
    expect(equal(a, b)).toBe(result);
  });
});

Deno.test("equal should return false when the value is not Object or Array as default", () => {
  const table: ParamReturn<typeof equal>[] = [
    [/a/, /a/, false],
    [new Date("2000/1/1"), new Date("2000/1/1"), false],
    [new Map(), new Map(), false],
    [new Set(), new Set(), false],
    [new WeakMap(), new WeakMap(), false],
    [new WeakSet(), new WeakSet(), false],
    [new WeakSet(), new WeakSet(), false],
    [new WeakRef({ hello: "world" }), new WeakRef({ hello: "world" }), false],
    [new Function(), new Function(), false],
    [new URL("https://example.test"), new URL("https://example.test"), false],
    [new Uint8Array(), new Uint8Array(), false],
  ];

  table.forEach(([a, b, result]) => {
    expect(equal(a, b)).toBe(result);
  });
});

Deno.test("equal should treat cycle reference safety", () => {
  const objA: { prop?: unknown } = {};
  objA.prop = objA;
  const objB: { prop?: unknown } = {};
  objB.prop = objB;

  expect(equal(objA, objB)).toBe(true);
});
