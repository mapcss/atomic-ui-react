export type StateMap = {
  /** The global unique id for disclosure. */
  id: string;

  /** Whether disclosure is open or not. */
  isOpen: boolean;
};

export type DispatchMap = {
  /** Change `isOpen` state to `true` */
  open: () => void;

  /** Change `isOpen` state to `false` */
  close: () => void;

  /** Toggle `isOpen` state */
  toggle: () => void;
};
