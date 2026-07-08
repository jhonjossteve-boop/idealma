const FEATURES = [
  {
    id: "feature-1",
    icon: "search",
    title: "Search by ID or License",
    body: "Enter a Trader ID or License Number to pull up a professional's full compliance record."
  },
  {
    id: "feature-2",
    icon: "check",
    title: "Live Status Checks",
    body: "See at a glance whether a license is verified &amp; active, expired, or suspended."
  },
  {
    id: "feature-3",
    icon: "download",
    title: "Downloadable Certificates",
    body: "Generate an official PDF certificate of verification for compliance and audit records."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderHeader("home");
  renderFooter();

  FEATURES.forEach((f) => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.innerHTML = `
      <div class="icon">${icon(f.icon, 20)}</div>
      <h3>${f.title}</h3>
      <p>${f.body}</p>
    `;
  });

  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const errorEl = document.getElementById("search-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) {
      errorEl.textContent = "Please enter a Trader ID or License Number.";
      errorEl.style.display = "block";
      return;
    }
    errorEl.style.display = "none";
    goToVerify(value);
  });
});
