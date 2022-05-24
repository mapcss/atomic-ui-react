// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import {
  Attributes,
  Children,
  FunctionComponent,
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
  ReactFragment,
  ReactNode,
  ReactPortal,
  Ref,
  RefAttributes,
  RefObject,
} from "react";
import {
  distinct,
  filterKeys,
  isFunction,
  isLength0,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "./deps.ts";

export function filterTruthy<T>(value: T[]): (Exclude<T, undefined | null>)[] {
  return value.filter(Boolean) as never;
}

export type Lazyable<T, U extends (...args: any[]) => T = () => T> = T | U;

/** Whether this environment is Browser or not.
 * This is compatible with Node.js
 */
export const isBrowser = !("Deno" in globalThis) && !("process" in globalThis);
export function lazyEval<T, U extends (...args: any[]) => T = () => T>(
  lazyable: Lazyable<T, U>,
): T {
  return isFunction(lazyable) ? lazyable() : lazyable;
}

export function isRefObject<T>(value: unknown): value is RefObject<T> {
  return isObject(value) && "current" in value;
}

export function hasRef<T>(
  element: ReactElement,
): element is ReactElement & RefAttributes<T> {
  return "ref" in element;
}

interface RefObjectAttributes<T> extends Attributes {
  ref?: RefObject<T>;
}

export function hasRefObject<T>(
  element: ReactElement & RefAttributes<T>,
): element is ReactElement & RefObjectAttributes<T> {
  return isObject(element.ref);
}

/** Utility for checking the child is under the parent or not. */
export function containElement(
  parent: Element | null | undefined | RefObject<Element>,
  maybeChild: Element,
): boolean {
  const el = isRefObject(parent) ? parent.current : parent;
  return el?.contains(maybeChild) ?? false;
}

/** `Element` or `Element` like */
export type ElementLike<T extends Element = Element> =
  | Lazyable<T | undefined | null>
  | RefObject<T | undefined>;

export function resolveElementLike<E extends Element>(
  elementLike: ElementLike<E>,
): E | undefined | null {
  if (isRefObject(elementLike)) {
    return elementLike.current;
  }

  return lazyEval(elementLike);
}

export type EventLike<E extends string> = E | Iterable<E>;

export function resolveEventType<T extends string>(
  value: T | Iterable<T>,
): T[] {
  const events = isString(value) ? [value] : Array.from(value);
  return events;
}

export function resolveRef<E>(
  children: ReactElement,
): RefObject<E> | undefined | never {
  if (!hasRef<E>(children) || isNil(children.ref)) return;

  if (hasRefObject(children)) return children.ref;
  throw Error(ERROR_MSG);
}

export function getRefObject<T>(
  el: ReactElement,
): [false] | [true, RefObject<T>] | [true] {
  const ref = getRef<T>(el);
  if (!ref) return [false];
  return isRefObject(ref) ? [true, ref] : [true];
}

export function cleanCharacter(value: string): string {
  return value.trim().replaceAll(/\s+/g, " ");
}

export function joinChars(
  characters: (string | number | undefined | null)[],
  separator: string,
): string | undefined {
  const joined = (characters.filter((v) => !isNil(v))).map(
    String,
  )
    .map(cleanCharacter).filter(Boolean)
    .join(separator);

  return isLength0(joined) ? undefined : joined;
}

/** Returns space-separated, non-duplicate tokens.
 * Empty characters are not considered token.
 */
export function cleanTokens(
  value: Readonly<Iterable<string | undefined>>,
): string[] {
  const truthy = filterTruthy(Array.from(value));
  return distinct(truthy.map(tokenize).flat());
}

/** Returns a space-separated string as tokens.
 * Duplicates are not eliminated.
 */
export function tokenize(value: string): string[] {
  return filterTruthy(value.split(" "));
}

export function getRef<E>(
  el: ReactElement,
): Ref<E> | undefined {
  if (hasRef<E>(el)) {
    return el.ref;
  }
}

const ERROR_MSG = "[atomic-ui] Supported ref is only RefObject.";

export function resolveRefObject<T>(
  ...args: (Ref<T> | undefined)[]
): RefObject<T> | undefined | null | never {
  for (const arg of args) {
    if (!arg) continue;

    if (isRefObject(arg)) {
      return arg;
    } else {
      throw Error(ERROR_MSG);
    }
  }
}

type Props = {
  [key: string]: any;
};

export function mergeProps<T extends Props, U extends Props>(
  a: T,
  b: U,
): T & U {
  const result: Props = {};
  const keys = [
    ...Object.getOwnPropertyNames(a),
    ...Object.getOwnPropertyNames(b),
  ];

  for (const key of keys) {
    const hasA = Object.hasOwn(a, key);
    const hasB = Object.hasOwn(b, key);

    if (hasA && hasB) {
      const recordA = a[key];
      const recordB = b[key];

      if (isObject(recordA) && isObject(recordB)) {
        result[key] = mergeProps(recordA, recordB);
        continue;
      }

      if (key === "className" && isString(recordA) && isString(recordB)) {
        result[key] = cleanTokens([recordA, recordB]).join(" ");
        continue;
      }

      if (
        isFunction(recordA) && isFunction(recordB) &&
        isEventHandlerName(key)
      ) {
        result[key] = chain(recordA, recordB);
        continue;
      }

      result[key] = isUndefined(recordB) ? recordA : recordB;
      continue;
    }
    if (hasB) {
      result[key] = b[key];
    } else {
      result[key] = a[key];
    }
  }

  return result as T & U;
}

function isEventHandlerName(value: string): value is `on${string}` {
  return value[0] === "o" &&
    value[1] === "n" &&
    value.charCodeAt(2) >= /* 'A' */ 65 &&
    value.charCodeAt(2) <= /* 'Z' */ 90;
}

function chain(
  // deno-lint-ignore ban-types
  ...callbacks: Function[]
): (...args: any[]) => void {
  return (...args: any[]) => {
    for (const callback of callbacks) {
      callback(...args);
    }
  };
}

export function isCloneable(
  value: ReactNode,
): value is
  | ReactElement<any, string | JSXElementConstructor<any>>
  | ReactPortal {
  return isObject(value) && "key" in value;
}

export function isReactElement(value: ReactNode): value is ReactElement {
  return isObject(value) && "type" in value;
}

export function isSameNode(node: Node | null, other: Node | null): boolean {
  return node?.isSameNode(other) ?? false;
}

export function omitRef(value: Readonly<Record<PropertyKey, unknown>>) {
  return filterKeys(value, (key) => key !== "ref");
}

export function onNotNullable<T, U>(
  value: T,
  onNonNullable: (value: NonNullable<T>) => U,
): U | undefined {
  if (isNil(value)) return;
  return onNonNullable(value as NonNullable<T>);
}

export function booleanish(value: boolean): "true" | "false" {
  return value ? "true" : "false";
}

export function current<T extends { current: unknown }>(
  value: T,
): T["current"] {
  return value["current"];
}

export function trueOr(value?: boolean): true | undefined {
  return value ? true : undefined;
}

export function traverse(
  root: ReactNode | readonly ReactNode[],
  callback: (
    child: Exclude<ReactNode, boolean | null | undefined>,
  ) => void,
) {
  const seen = new WeakSet();

  const run = (
    root: ReactNode | readonly ReactNode[],
    callback: (
      child: Exclude<ReactNode, boolean | null | undefined>,
    ) => void,
  ) => {
    for (const child of Children.toArray(root)) {
      callback(child);
      if (isReactElement(child) && hasChildren(child)) {
        if (seen.has(child)) break;
        seen.add(child);
        traverse(child.props.children, callback);
      }
    }
  };
  run(root, callback);
}

function hasChildren<P = unknown>(
  el: ReactElement,
): el is ReactElement<PropsWithChildren<P>> {
  return "children" in el.props;
}

type Visits = {
  onReactElement: (value: ReactElement) => void;
  onReactPortal: (value: ReactPortal) => void;
  onReactFragment: (value: ReactFragment) => void;
  onString: (value: string) => void;
  onNumber: (value: number) => void;
};

export function visit(
  root: ReactNode | readonly ReactNode[],
  { onReactElement, onReactFragment, onNumber, onReactPortal, onString }:
    Readonly<
      Partial<Visits>
    >,
) {
  traverse(root, (child) => {
    if (isString(child)) {
      onString?.(child);
    } else if (isNumber(child)) {
      onNumber?.(child);
    } else if ("type" in child) {
      if ("children" in child) {
        onReactPortal?.(child);
      } else {
        onReactElement?.(child);
      }
    } else {
      onReactFragment?.(child);
    }
  });
}

function isFC(
  value: ReactElement,
): value is ReactElement<any, FunctionComponent> {
  return isFunction(value.type);
}

type VisitDisplayNames = Record<
  string,
  (value: ReactElement<unknown, FunctionComponent>) => void
>;

export function visitDisplayName(
  root: ReactNode | readonly ReactNode[],
  visitDisplayNames: VisitDisplayNames,
) {
  visit(root, {
    onReactElement: (value) => {
      if (isFC(value) && value.type.displayName) {
        visitDisplayNames[value.type.displayName]?.(value);
      }
    },
  });
}
