const header = document.querySelector(".site-header");
const requestForm = document.querySelector(".request-form");
const requestEmail = "maanriyupatel@gmail.com";

const setHeaderState = () => {
  if (!header) return;
  header.dataset.scrolled = String(window.scrollY > 8);
  document.body.dataset.scrolled = String(window.scrollY > 220);
};

const buildEmailBody = (formData, kind) => {
  const lines = [
    kind,
    "Submitted from Harrison Liquor & Wine Market website",
    ""
  ];

  for (const [key, value] of formData.entries()) {
    const cleanValue = String(value).trim();
    if (cleanValue) {
      lines.push(`${key}: ${cleanValue}`);
    }
  }

  return lines.join("\n");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

requestForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(requestForm);
  const kind = requestForm.dataset.formKind || "Harrison customer request";
  const category = String(formData.get("Category") || "Website request").trim();
  const subject = `Harrison website: ${category}`;
  const body = buildEmailBody(formData, kind);
  const status = requestForm.querySelector(".form-status");
  const mailtoUrl = `mailto:${requestEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  navigator.clipboard?.writeText(body).catch(() => {});

  if (status) {
    status.textContent = `Opening email to ${requestEmail}. The request is copied in case the email app needs it pasted.`;
  }

  window.location.href = mailtoUrl;
});
