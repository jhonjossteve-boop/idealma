document.addEventListener("DOMContentLoaded", () => {
  renderHeader("home");
  renderFooter();

  const id = getQueryParam("id");
  const trader = findTrader(id);
  const root = document.getElementById("verify-root");

  if (!trader) {
    root.innerHTML = renderNotFound(id);
    return;
  }

  root.innerHTML = renderProfile(trader);
  renderQrCode(trader);

  const downloadBtn = document.getElementById("download-cert");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => downloadCertificate(trader));
  }
});

function statusMeta(status) {
  switch (status) {
    case "VERIFIED":
      return { cls: "verified", label: "VERIFIED & ACTIVE", cardCls: "status-verified", iconName: "check" };
    case "EXPIRED":
      return { cls: "expired", label: "LICENSE EXPIRED", cardCls: "status-expired", iconName: "alert" };
    case "SUSPENDED":
      return { cls: "suspended", label: "SUSPENDED", cardCls: "status-suspended", iconName: "ban" };
    default:
      return { cls: "expired", label: status, cardCls: "", iconName: "alert" };
  }
}

function renderNotFound(id) {
  return `
    <div class="not-found">
      <div class="icon-circle">${icon("search", 32)}</div>
      <h1>Record Not Found</h1>
      <p>We could not verify a trader matching the ID or License Number
        <code>${escapeHtml(id || "")}</code>. Please check the identifier and try again.</p>
      <a href="index.html" class="btn btn-primary">${icon("arrowLeft", 16)} Return to Search</a>
    </div>
  `;
}

function renderProfile(t) {
  const meta = statusMeta(t.status);
  return `
    <a href="index.html" class="back-link">${icon("arrowLeft", 14)} Back to Registry Search</a>
    <div class="verify-grid">
      <div>
        <div class="card profile-card ${meta.cardCls}">
          <div class="profile-header">
            <div class="avatar">
  ${
    t.photoUrl
      ? `<img src="${escapeHtml(t.photoUrl)}" alt="${escapeHtml(t.fullName)}" class="avatar-img" onerror="this.style.display='none'; this.parentNode.innerHTML='<span>${initials(t.fullName)}</span>';">`
      : `<span>${initials(t.fullName)}</span>`
  }
</div>
            <div class="profile-identity">
              <h1>${escapeHtml(t.fullName)}</h1>
              <div class="specialization">${escapeHtml(t.specialization)}</div>
              <div class="meta-row">
                <span>${icon("map", 14)} ${escapeHtml(t.country)}</span>
                <span>${icon("briefcase", 14)} ${t.experienceYears}+ Years Experience</span>
                <span>${icon("award", 14)} ${t.awardsCount} Professional Awards</span>
              </div>
            </div>
            <span class="status-badge ${meta.cls}">${icon(meta.iconName, 14)} ${meta.label}</span>
          </div>

          <div class="divider"></div>

          <div class="info-grid">
            <div class="info-block">
              <h4>${icon("id", 15)} IDENTITY &amp; LICENSING</h4>
              <div class="field-label">Trader ID</div>
              <div class="field-value">${escapeHtml(t.traderId)}</div>
              <div class="field-label">License Number</div>
              <div class="field-value">${escapeHtml(t.licenseNumber)}</div>
            </div>
            <div class="info-block">
              <h4>${icon("calendar", 15)} REGISTRATION TIMELINE</h4>
              <div class="timeline-row"><span>Initial Registration</span><span>${formatDate(t.registrationDate)}</span></div>
              <div class="timeline-row"><span>Last Verified</span><span>${formatDate(t.verificationDate)}</span></div>
              <div class="timeline-row"><span>Valid Until</span><span>${formatDate(t.expiryDate)}</span></div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section-block">
            <h3>${icon("grad", 17)} Professional Qualifications</h3>
            <ul class="cert-list">
              ${t.certifications.map((c) => `<li>${icon("check", 15)} ${escapeHtml(c)}</li>`).join("")}
            </ul>
          </div>

          <div class="divider"></div>

          <div class="section-block">
            <h3>${icon("tag", 17)} Authorized Trading Categories</h3>
            <div class="tag-list">
              ${t.tradingCategories.map((c) => `<span class="tag gold">${escapeHtml(c)}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="card side-card">
          <h3>Cryptographic Verification</h3>
          <div id="qr-canvas-wrap"></div>
          <p style="font-size:0.82rem;color:var(--slate-500);">
            Scan to view live validation status on the Global Trader Registry portal.
          </p>
          <div class="blockchain-ref">
            BLOCKCHAIN REFERENCE
            <strong>${pseudoHash(t.traderId)}</strong>
          </div>
        </div>

        <div class="cert-panel">
          <h3>Official Certificate</h3>
          <p>Generate a notarized PDF of this trader's verification credentials for your records.</p>
          <button id="download-cert" class="btn btn-gold" style="width:100%;">
            ${icon("download", 16)} Download Certificate
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderQrCode(t) {
  const wrap = document.getElementById("qr-canvas-wrap");
  if (!wrap) return;
  const verificationUrl = window.location.origin + window.location.pathname.replace(/verify\.html.*/, "") + "verify.html?id=" + encodeURIComponent(t.traderId);
  // QRCode.js (loaded via CDN) draws directly into the container element.
  new QRCode(wrap, {
    text: verificationUrl,
    width: 160,
    height: 160,
    colorDark: "#0f172a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function downloadCertificate(t) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const meta = statusMeta(t.status);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 595, 120, "F");
  doc.setTextColor(212, 160, 23);
  doc.setFontSize(12);
  doc.text("GLOBAL TRADER REGISTRY", 48, 50);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Certificate of Verification", 48, 82);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(t.fullName, 48, 160);
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(t.specialization, 48, 180);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  const lines = [
    ["Status", meta.label],
    ["Trader ID", t.traderId],
    ["License Number", t.licenseNumber],
    ["Country", t.country],
    ["Experience", t.experienceYears + " years"],
    ["Professional Awards", String(t.awardsCount)],
    ["Registration Date", formatDate(t.registrationDate)],
    ["Last Verified", formatDate(t.verificationDate)],
    ["Valid Until", formatDate(t.expiryDate)],
    ["Certifications", t.certifications.join(", ")],
    ["Trading Categories", t.tradingCategories.join(", ")]
  ];

  let y = 220;
  lines.forEach(([label, value]) => {
    doc.setFont(undefined, "bold");
    doc.text(label + ":", 48, y);
    doc.setFont(undefined, "normal");
    const valueLines = doc.splitTextToSize(value, 380);
    doc.text(valueLines, 190, y);
    y += 20 * valueLines.length;
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(48, y + 10, 547, y + 10);
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("This certificate reflects registry data at the time of generation and is provided for reference purposes.", 48, y + 28);
  doc.text("Blockchain reference: " + pseudoHash(t.traderId), 48, y + 42);

  doc.save(`${t.traderId}-certificate.pdf`);
}

function pseudoHash(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return "0x" + hex + "...";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
