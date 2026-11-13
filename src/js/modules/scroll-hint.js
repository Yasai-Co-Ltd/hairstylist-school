// スクロールの終端では、先に続くことを示す影を消す。
export function initScrollHints() {
  document.querySelectorAll(".js-scroll-hint").forEach((wrapper) => {
    const scroller = wrapper.querySelector('[role="region"]');
    if (!scroller) return;
    const update = () => {
      wrapper.classList.toggle(
        "is-scroll-end",
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1,
      );
    };
    scroller.addEventListener("scroll", update, { passive: true });
    new ResizeObserver(update).observe(scroller);
    update();
  });
}
