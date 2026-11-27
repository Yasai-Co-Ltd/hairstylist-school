import Swiper from "swiper";
import { A11y, Navigation, Pagination } from "swiper/modules";

export function initPartnerSalon() {
  document.querySelectorAll("[data-partner-salon]").forEach((root) => {
    const viewport = root.querySelector("[data-salon-viewport]");
    if (!viewport || viewport.swiper) return;

    const controls = root.querySelector("[data-salon-controls]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncControls = (swiper) => {
      controls.hidden = swiper.isLocked;
    };

    const swiper = new Swiper(viewport, {
      modules: [A11y, Navigation, Pagination],
      init: false,
      slidesPerView: 1.15,
      spaceBetween: 16,
      breakpoints: {
        768: { slidesPerView: 2.15, spaceBetween: 24 },
        1024: { slidesPerView: 3.15, spaceBetween: 24 },
      },
      speed: reducedMotion.matches ? 0 : 400,
      loop: false,
      watchOverflow: true,
      navigation: {
        prevEl: root.querySelector("[data-salon-prev]"),
        nextEl: root.querySelector("[data-salon-next]"),
        disabledClass: "is-disabled",
        lockClass: "is-locked",
        addIcons: false,
      },
      pagination: {
        el: root.querySelector("[data-salon-pagination]"),
        clickable: true,
        bulletElement: "button",
        bulletClass: "p-top-partner-salon__dot",
        bulletActiveClass: "is-active",
        lockClass: "is-locked",
        renderBullet: (index, className) =>
          `<button type="button" class="${className}" aria-label="店舗一覧の${index + 1}番目の位置へ移動"></button>`,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "前の店舗を表示",
        nextSlideMessage: "次の店舗を表示",
        firstSlideMessage: "最初の店舗です",
        lastSlideMessage: "最後の店舗です",
        paginationBulletMessage: "店舗一覧の{{index}}番目の位置へ移動",
        slideLabelMessage: "{{index}} / {{slidesLength}} 店舗（仮表示）",
        notificationClass: "p-top-partner-salon__notification",
      },
      on: {
        init: syncControls,
        lock: syncControls,
        unlock: syncControls,
        resize: syncControls,
      },
    });

    // 横スクロールのフォールバックから、初期化時だけSwiperの配置へ切り替える。
    viewport.dataset.sliderReady = "true";
    try {
      swiper.init();
    } catch (error) {
      swiper.destroy(true, true);
      delete viewport.dataset.sliderReady;
      controls.hidden = true;
      console.error("提携サロンのスライダーを初期化できませんでした。", error);
      return;
    }

    // document全体ではなく、スライダー内にフォーカスがあるときだけ操作する。
    root.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target.closest("input, textarea, select, [contenteditable]")) return;
      if (swiper.isLocked) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        if (event.key === "ArrowLeft") swiper.slidePrev();
        else swiper.slideNext();
      }
    });

    reducedMotion.addEventListener("change", (event) => {
      swiper.params.speed = event.matches ? 0 : 400;
    });
  });
}
