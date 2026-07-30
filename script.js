const header = document.querySelector(".topbar");

const setHeaderState = () => {
  header.dataset.scrolled = String(window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
