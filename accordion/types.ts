export type OpenIndexProps = {
  /** Whether open or not. */
  openIndex: number;

  /** Update `isOpen` state. */
  setOpenIndex: (index: number) => void;
};

export type CommonContexts = OpenIndexProps;
