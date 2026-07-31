const header = document.querySelector(".topbar");
const requestForms = document.querySelectorAll(".request-form");
const storeSmsNumber = "+13133893759";

const setHeaderState = () => {
  const isScrolled = window.scrollY > 8;
  header.dataset.scrolled = String(isScrolled);
  document.body.dataset.scrolled = String(window.scrollY > 180);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

requestForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const kind = form.dataset.messageKind;
    const lines = [`Harrison ${kind}`];

    for (const [key, value] of formData.entries()) {
      const cleanValue = String(value).trim();
      if (cleanValue) {
        lines.push(`${key}: ${cleanValue}`);
      }
    }

    const message = lines.join("\n");
    const status = form.querySelector(".form-status");
    const smsUrl = `sms:${storeSmsNumber}?&body=${encodeURIComponent(message)}`;

    navigator.clipboard?.writeText(message).catch(() => {});
    status.textContent = "Opening your text app. The request is also copied so you can paste it if needed.";
    window.location.href = smsUrl;
  });
});
