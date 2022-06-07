export default function scrollIntoViewIfNeeded(
  el: Element,
  centerIfNeeded = true,
) {
  const observer = new IntersectionObserver(([{ intersectionRatio }]) => {
    if (intersectionRatio < 1) {
      const place = intersectionRatio <= 0 && centerIfNeeded
        ? "center"
        : "nearest";
      el.scrollIntoView({
        block: place,
        inline: place,
        behavior: "smooth",
      });
    }
    observer.disconnect();
  });
  observer.observe(el);
}
