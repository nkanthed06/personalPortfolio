import { experience, timelineNow } from "../data/experience.js";
import { escapeHtml, externalLink, tagList } from "../lib/html.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "YYYY-MM" -> a month count, so durations are simple subtraction.
const monthIndex = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};
const formatMonth = (i) => `${MONTHS[i % 12]} ${Math.floor(i / 12)}`;
const formatDuration = (start, end) => {
  const months = end - start + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ") || "1 mo";
};

const renderLogo = (logo) =>
  logo.src ? `<img src="${escapeHtml(logo.src)}" alt="">` : logo.svg;

// Experience timeline. Year headings appear wherever the start year changes.
export function renderExperience() {
  const roles = experience
    .map((e) => ({ ...e, s: monthIndex(e.start), e: e.end ? monthIndex(e.end) : monthIndex(timelineNow) }))
    .sort((a, b) => b.s - a.s);

  const first = Math.min(...roles.map((r) => r.s));
  const last = Math.max(...roles.map((r) => r.e));

  let rows = "";
  let lastYear = null;
  roles.forEach((r, k) => {
    const year = Math.floor(r.s / 12);
    if (year !== lastYear) {
      rows += `<div class="yr-row" data-y="${year}"><div class="y">${year}</div><div class="dot"></div><div class="rule"></div></div>`;
      lastYear = year;
    }
    rows += `
      <article class="entry" data-k="${k}" data-y="${year}">
        <div class="when">
          <div class="m">${formatMonth(r.s)}</div>
          <div class="to">to ${r.current ? "Present" : formatMonth(r.e)}</div>
          <div class="d">${formatDuration(r.s, r.e)}</div>
        </div>
        <div class="node">
          <a class="logo" ${r.url ? `href="${escapeHtml(r.url)}" target="_blank" rel="noopener"` : ""} aria-label="${escapeHtml(r.org)} website">${renderLogo(r.logo)}</a>
        </div>
        <div class="card">
          <div class="top">
            <div class="co">${externalLink(r.org, r.url)}${r.current ? `<span class="now">NOW</span>` : ""}</div>
            <div class="place">${escapeHtml(r.location)}</div>
          </div>
          <h3>${escapeHtml(r.role)}</h3>
          <div class="team">${externalLink(r.team, r.teamUrl)}</div>
          <ul>${r.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
          ${tagList(r.tags)}
        </div>
      </article>`;
  });

  return `
  <section id="experience">
    <div class="wrap">
      <div class="sec-head">
        <h2>Experience</h2>
        <div class="eyebrow">${formatMonth(first)} — ${formatMonth(last)}</div>
      </div>
      <div class="tl" id="tl">
        <div class="spine"><i id="spineFill"></i></div>
        ${rows}
      </div>
    </div>
  </section>`;
}
