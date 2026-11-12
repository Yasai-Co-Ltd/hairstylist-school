const OPEN_CLASS = "is-menu-open";
const LABEL_OPEN = "メニュー";
const LABEL_CLOSE = "メニューを閉じる";

/**
 * SP 全画面メニュー（aria-expanded・Esc・背面スクロール停止）
 */
export function initMenu() {
  const toggle = document.querySelector(".js-menu-toggle");
  const panel = document.querySelector(".js-menu-panel");
  const toggleLabel = document.querySelector(".js-menu-toggle-label");

  if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  const setToggleLabel = (text) => {
    if (toggleLabel instanceof HTMLElement) {
      toggleLabel.textContent = text;
    }
  };

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    panel.removeAttribute("hidden");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add(OPEN_CLASS);
    setToggleLabel(LABEL_CLOSE);
  };

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("hidden", "");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove(OPEN_CLASS);
    setToggleLabel(LABEL_OPEN);
  };

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  toggle.addEventListener("click", () => {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
      toggle.focus();
    }
  });

  panel.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (isOpen()) {
        close();
      }
    });
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches && isOpen()) {
      close();
    }
  });
}
