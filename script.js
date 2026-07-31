const header = document.querySelector(".topbar");

const setHeaderState = () => {
  const isScrolled = window.scrollY > 8;
  header.dataset.scrolled = String(isScrolled);
  document.body.dataset.scrolled = String(window.scrollY > 180);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
