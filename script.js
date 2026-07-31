const header = document.querySelector(".topbar");
const quickTabs = document.querySelectorAll("[data-tab]");
const quickPanels = document.querySelectorAll("[data-panel]");

const setHeaderState = () => {
  header.dataset.scrolled = String(window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

quickTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    quickTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    quickPanels.forEach((panel) => {
      const isActive = panel.dataset.panel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});
