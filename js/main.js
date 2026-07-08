// Shared header/footer + navigation search, used on every page.

function renderHeader(activePage) {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand">
        <span class="brand-icon">${icon("shield", 18)}</span>
        <span class="brand-name">Global Trader Registry</span>
      </a>
      <nav class="main-nav">
        <a href="index.html" class="${activePage === "home" ? "active" : ""}">Home</a>
        <a href="about.html" class="${activePage === "about" ? "active" : ""}">About</a>
      </nav>
      <div class="header-search">
        ${icon("search", 16)}
        <input type="text" id="header-search-input" placeholder="Quick verification..." />
      </div>
      <a href="index.html#search" class="btn btn-primary">Verify a Trader</a>
    </div>
  `;

  const input = document.getElementById("header-search-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") goToVerify(input.value);
    });
  }
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="footer-grid">
      <div>
        <div class="brand" style="margin-bottom:12px;">
          <span class="brand-icon">${icon("shield", 18)}</span>
          <span class="brand-name">Global Trader Registry</span>
        </div>
        <p>The official compliance registry for verified trading professionals.
        Providing institutional-grade credential verification for global financial markets.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html#search">Verify a License</a></li>
          <li><a href="about.html">About the Registry</a></li>
          <li><a href="about.html">Compliance Standards</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="about.html">Terms of Service</a></li>
          <li><a href="about.html">Privacy Policy</a></li>
          <li><a href="about.html">Data Protection</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; ${new Date().getFullYear()} Global Trader Registry. All rights reserved.
    </div>
  `;
}

// Normalizes a raw search string (trim + uppercase) so lookups are
// case-insensitive and whitespace-tolerant, matching either the trader ID
// or the license number.
function normalizeId(raw) {
  return (raw || "").trim().toUpperCase();
}

function findTrader(rawId) {
  const id = normalizeId(rawId);
  if (!id) return null;
  return TRADERS.find(
    (t) => t.traderId.toUpperCase() === id || t.licenseNumber.toUpperCase() === id
  ) || null;
}

function goToVerify(rawId) {
  const id = normalizeId(rawId);
  if (!id) return;
  window.location.href = "verify.html?id=" + encodeURIComponent(id);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function initials(fullName) {
  return fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Minimal inline SVG icon set (no external icon library / emojis).
function icon(name, size) {
  size = size || 16;
  const stroke = `stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
    search: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>`,
    alert: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M12 3l9 16H3z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/></svg>`,
    ban: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>`,
    map: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    briefcase: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    award: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="8" r="5"/><path d="M9 12.5L7 22l5-3 5 3-2-9.5"/></svg>`,
    id: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M14 10h4M14 14h4"/></svg>`,
    calendar: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`,
    grad: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M22 9L12 5 2 9l10 4 10-4z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
    tag: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M20 12l-8 8-9-9V4h7z"/><circle cx="8" cy="8" r="1.2"/></svg>`,
    lock: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
    download: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M5 19h14"/></svg>`,
    arrowLeft: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><path d="M19 12H5m0 0l6-6m-6 6l6 6"/></svg>`,
    target: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${stroke}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>`
  };
  return icons[name] || "";
}
