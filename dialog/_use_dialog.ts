// This module is browser compatible.

import { AllHTMLAttributes, useCallback, useEffect, useMemo } from "react";
import {
  getFirstFocusable,
  getNextFocusable,
  getPreviousFocusable,
  mappingKey,
} from "../util.ts";
import { IsShowProps } from "./types.ts";
import {
  AllAttributesWith,
  useAttributesWith,
  useCallable,
  useEventListener,
  useUpdateEffect,
} from "../hooks/mod.ts";

export type Params = {
  root: () => Element | undefined | null;

  titleId: string | undefined;

  describeId: string | undefined;
} & IsShowProps;

export type Contexts = Params;

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Options = {
  /** Called when the dialog is dismissed */
  onChangeShow: (contexts: Contexts) => void;

  /** A function for return element that should receive focus first.
   * This function is executed on the client side.
   */
  initialFocus: () => HTMLElement | SVGElement | null | undefined;

  /** Whether the dialog title is included or not.
   * If `true`, `aria-labelledby` will be added to attributes.
   * @default false
   */
  hasTitle?: boolean;

  /** Whether the dialog describe is included or not.
   * If `true`, `aria-describedby` will be added to attributes.
   * @default false
   */
  hasDescribe?: boolean;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-modal" | "aria-labelledby" | "aria-describedby" | "hidden"
>;

export type Returns = [Attributes, Contexts];

export function defineUseDialog(role: "dialog" | "alertdialog") {
  const useDialog = (
    { isShow, setIsShow, root, titleId: _titleId, describeId: _describeId }:
      Params,
    {
      onChangeShow,
      initialFocus: _initialFocus,
      hasDescribe = false,
      hasTitle = false,
    }: Readonly<Partial<Options>> = {},
  ): Returns => {
    const target = useCallback<() => Document>(() => document, []);

    const initialFocus = useMemo(() => {
      if (_initialFocus) return _initialFocus;

      return () => {
        const _root = root();
        const el = getFirstFocusable(_root);
        return el;
      };
    }, [_initialFocus]);

    useEffect(() => {
      const el = initialFocus();
      if (!isShow) return;
      el?.focus();
    }, [isShow]);

    useUpdateEffect(() => {
      onChangeShow?.(contexts);
    }, [isShow]);

    const keyboardHandler = useCallback((ev: KeyboardEvent) => {
      mappingKey([
        [{ code: "Tab", shiftKey: true }, (ev) => {
          const _root = root();
          if (_root) {
            ev.preventDefault();
            const el = getPreviousFocusable(_root);
            el?.focus();
          }
        }],
        ["Tab", (ev) => {
          const _root = root();
          if (_root) {
            ev.preventDefault();
            const el = getNextFocusable(_root);
            el?.focus();
          }
        }],
        [
          "Escape",
          (ev) => {
            ev.preventDefault();
            setIsShow(false);
          },
        ],
      ])(ev);
    }, []);

    const titleId = useMemo<string | undefined>(
      () => hasTitle ? _titleId : undefined,
      [_titleId, hasTitle],
    );
    const describeId = useMemo<string | undefined>(
      () => hasDescribe ? _describeId : undefined,
      [_describeId, hasDescribe],
    );

    const contexts = useMemo<Contexts>(
      () => ({ titleId, describeId, isShow, setIsShow, root }),
      [
        titleId,
        describeId,
        isShow,
        setIsShow,
        root,
      ],
    );

    const attributes = useAttributesWith([contexts], {
      ...defaultAttributes,
      role,
    });

    const callback = useCallable(keyboardHandler, isShow);

    useEventListener(
      { target, event: "keydown", callback },
      [target, callback],
    );

    return [attributes, contexts];
  };

  return useDialog;
}

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  "aria-modal": "true",
  hidden: ({ isShow }) => !isShow,
  "aria-labelledby": ({ titleId }) => titleId!,
  "aria-describedby": ({ describeId }) => describeId!,
};
