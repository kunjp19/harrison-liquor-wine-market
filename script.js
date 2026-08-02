const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const requestForm = document.querySelector(".request-form");
const requestEmail = "maanriyupatel@gmail.com";
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=735%20Harrison%20Blvd%2C%20Lincoln%20Park%2C%20MI%2048146";

document.body.dataset.js = "true";

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

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  document.body.dataset.menuOpen = String(!isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.dataset.menuOpen = "false";
  }
});

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll("\"", "&quot;")
  .replaceAll("'", "&#039;");

const cardImage = (item, fallbackAlt) => `
  <img src="${escapeHtml(item.image)}" width="720" height="540" decoding="async" alt="${escapeHtml(item.alt || fallbackAlt)}">
`;

const renderDeals = (deals) => {
  const target = document.querySelector("[data-deals]");
  if (!target || !Array.isArray(deals) || deals.length === 0) return;

  target.innerHTML = deals.map((deal) => `
    <article class="deal-card">
      ${cardImage(deal, deal.name)}
      <div>
        <span>${escapeHtml(deal.title)}</span>
        <h3>${escapeHtml(deal.name)}</h3>
        <p>${escapeHtml(deal.description)}</p>
        <small>${escapeHtml(deal.disclaimer || "Selection and availability may vary.")}</small>
        <a class="text-link" href="tel:+13133893759">Call for today's deals</a>
      </div>
    </article>
  `).join("");
};

const renderCategories = (categories) => {
  const target = document.querySelector("[data-categories]");
  if (!target || !Array.isArray(categories) || categories.length === 0) return;

  target.innerHTML = categories.map((category) => `
    <article class="category-card">
      ${cardImage(category, category.name)}
      <div>
        <span>Browse</span>
        <h3>${escapeHtml(category.name)}</h3>
        <p>${escapeHtml(category.description)}</p>
      </div>
    </article>
  `).join("");
};

const renderProducts = (products) => {
  const target = document.querySelector("[data-products]");
  if (!target || !Array.isArray(products) || products.length === 0) return;

  target.innerHTML = products.map((product) => `
    <article class="product-card">
      ${cardImage(product, product.name)}
      <div>
        <span>${escapeHtml(product.category)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <a class="text-link" href="#request">Request availability</a>
      </div>
    </article>
  `).join("");
};

const loadJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
};

Promise.all([
  loadJson("data/deals.json").then(renderDeals),
  loadJson("data/categories.json").then(renderCategories),
  loadJson("data/products.json").then(renderProducts)
]).catch(() => {
  // Fallback cards in the HTML stay visible if local JSON cannot be loaded.
});

document.querySelectorAll("a[href^='tel:']").forEach((link) => {
  link.addEventListener("click", () => {
    window.dataLayer?.push({ event: "click_call" });
  });
});

document.querySelectorAll(`a[href="${mapsUrl}"]`).forEach((link) => {
  link.addEventListener("click", () => {
    window.dataLayer?.push({ event: "click_directions" });
  });
});

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

  window.dataLayer?.push({ event: "submit_product_inquiry", category });
  window.location.href = mailtoUrl;
});
