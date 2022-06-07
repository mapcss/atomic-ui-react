import useId from "../hooks/use_id.ts";
import { Dispatches, SharedContexts, States } from "./types.ts";
import useUpdateEffect from "../hooks/use_update_effect.ts";
import { Exclusive } from "../util.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";

export type ChangeOpenHandler = (contexts: SharedContexts) => void;

export type Params = Exclusive<GlobalScope, LocalScope>;

export type GlobalScope =
  & Pick<States, "isOpen">
  & Pick<Dispatches, "setIsOpen">;

export type LocalScope = {
  /** Default state of `isOpen`.
   * @default false
   */
  isInitialOpen?: boolean;
};

export type Options = {
  onChangeOpen: ChangeOpenHandler;
};

export type Returns = [States, Dispatches];

export default function useDisclosure(
  { isOpen: state, setIsOpen: setState, isInitialOpen: initialState = false }:
    Readonly<Params>,
  {
    onChangeOpen,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const { id } = useId();

  const [isOpen, setIsOpen] = useExclusiveState({
    initialState,
    state,
    setState,
  });

  useUpdateEffect(
    () => {
      onChangeOpen?.({
        id,
        isOpen,
        setIsOpen,
      });
    },
    [onChangeOpen, id, isOpen, setIsOpen],
  );

  return [{ id, isOpen }, { setIsOpen }];
}
