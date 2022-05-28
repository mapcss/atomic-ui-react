import { useState } from "react";
import useId from "../hooks/use_id.ts";
import { Dispatches, SharedContexts, States } from "./types.ts";
import useUpdateEffect from "../hooks/use_update_effect.ts";

export type ChangeOpenHandler = (contexts: SharedContexts) => void;

export type Options = {
  onChangeOpen: ChangeOpenHandler;
} & Exclusive;

export type Controllable =
  & Pick<States, "isOpen">
  & Pick<Dispatches, "setIsOpen">
  & {
    isDefaultOpen?: never;
  };
export type UnControllable = {
  isOpen?: never;

  setIsOpen?: never;

  /** Default state of `isOpen`.
   * @default false
   */
  isDefaultOpen?: boolean;
};

export type Exclusive = Controllable | UnControllable;

export type Returns = [States, Dispatches];

export default function useDisclosureProvider(
  {
    onChangeOpen,
    isOpen: _isOpen,
    setIsOpen: _setIsOpen,
    isDefaultOpen = false,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const { id } = useId();
  const openStateSet = useState<States["isOpen"]>(isDefaultOpen);

  const [isOpen, setIsOpen] = _setIsOpen
    ? [_isOpen, _setIsOpen] as [
      States["isOpen"],
      Dispatches["setIsOpen"],
    ]
    : openStateSet;

  useUpdateEffect(
    () => {
      onChangeOpen?.({
        id,
        isOpen,
        setIsOpen,
      });
    },
    undefined,
    [onChangeOpen, id, isOpen, setIsOpen],
  );

  return [{ id, isOpen }, { setIsOpen }];
}
