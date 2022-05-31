import { AllHTMLAttributes, useMemo } from "react";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { CommonContexts } from "./types.ts";

export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export type Params = {
  id: string;

  index: number;
} & CommonContexts;

export type Contexts = Params & {
  isActive: boolean;
};

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useToolbarItem(
  { activeIndex, setActiveIndex, index, id, itemsRef }: Readonly<
    Params
  >,
  allAttributes: Partial<AllAttributesWithContexts> = {},
): Returns {
  const isActive = useMemo<boolean>(
    () => index === activeIndex,
    [index, activeIndex],
  );

  const contexts = useMemo<Contexts>(() => ({
    isActive,
    activeIndex,
    setActiveIndex,
    index,
    id,
    itemsRef,
  }), [
    isActive,
    activeIndex,
    setActiveIndex,
    index,
    id,
  ]);

  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes, contexts];
}

const defaultTabIndex: AttributesHandler<[Contexts], "tabIndex"> = (
  { isActive },
) => isActive ? 0 : -1;
// const defaultOnKeyDown: AttributesHandler<[Contexts], "onKeyDown"> = (
//   ev,
//   { setActiveIndex, count, index },
// ) => {
//   const run = mappingKey<KeyboardEvent>([
//     ["ArrowLeft", (ev) => {
//       ev.preventDefault();
//       const featureIndex = prev({ current: index, max: count });
//       setActiveIndex(featureIndex);
//     }],
//     ["ArrowRight", (ev) => {
//       ev.preventDefault();
//       const featureIndex = next({ current: index, max: count });
//       setActiveIndex(featureIndex);
//     }],
//     ["Home", (ev) => {
//       ev.preventDefault();
//       const featureIndex = first({ current: index, max: count });
//       setActiveIndex(featureIndex);
//     }],
//     ["End", (ev) => {
//       ev.preventDefault();
//       const featureIndex = last({ current: index, max: count });
//       setActiveIndex(featureIndex);
//     }],
//   ]);

//   run(ev);
// };

const defaultOnClick: AttributesHandler<[Contexts], "onClick"> = (
  _,
  { setActiveIndex, index },
) => {
  setActiveIndex(index);
};

const defaultAttributes: Partial<AllAttributesWith<[Contexts]>> = {
  tabIndex: defaultTabIndex,
  onClick: defaultOnClick,
};
