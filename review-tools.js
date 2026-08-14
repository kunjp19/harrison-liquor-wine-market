const reviewForm = document.querySelector("[data-api-review-form]");
const statusMessage = document.querySelector("[data-api-review-status]");
const preview = document.querySelector("[data-review-email-preview]");

const collectReview = () => {
  const rows = [...document.querySelectorAll("[data-review-card]")];
  return rows.map((row) => {
    const id = row.dataset.reviewCard;
    const title = row.querySelector("h3")?.textContent?.trim() || id;
    const choice = row.querySelector(`input[name="${id}"]:checked`)?.value || "No selection";
    const note = row.querySelector("textarea")?.value?.trim();
    return { title, choice, note };
  });
};

reviewForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = reviewForm.dataset.reviewEmail;
  const body = collectReview()
    .map((item, index) => [
      `${index + 1}. ${item.title}`,
      `Decision: ${item.choice}`,
      item.note ? `Notes: ${item.note}` : "Notes:"
    ].join("\n"))
    .join("\n\n");

  const subject = reviewForm.dataset.reviewSubject || "Harrison weekly API review decisions";
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (preview) {
    preview.hidden = false;
    preview.value = `To: ${email}\nSubject: ${subject}\n\n${body}`;
  }

  if (statusMessage) {
    statusMessage.textContent = "Choices captured. Your email app should open next; if it does not, use the preview below.";
  }

  window.location.href = mailto;
});
