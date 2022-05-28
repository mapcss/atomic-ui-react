export type States = {
  /** The global unique id for disclosure. */
  id: string;

  /** Whether disclosure is open or not. */
  isOpen: boolean;
};

export type Dispatches = {
  setIsOpen: (isOpen: boolean) => void;
};

export type SharedContexts = States & Dispatches
