import { projects } from "../data/projects.js";
import { escapeHtml, tagList } from "../lib/html.js";

export function renderProjects() {
  const years = projects.map((p) => p.year);
  const from = Math.min(...years);
  const to = Math.max(...years);
  const range = from === to ? `${from}` : `${from}–${to}`;

  const rows = projects
    .map(
      (p, i) => `
      <article class="proj${i === 0 ? " open" : ""}" tabindex="0" aria-expanded="${i === 0}">
        <div class="yr">${p.year}</div>
        <div>
          <h3>${escapeHtml(p.name)}</h3>
          <div class="cat">${escapeHtml(p.category)}</div>
          <div class="more"><div>
            <p>${escapeHtml(p.description)}</p>
            ${tagList(p.tags)}
          </div></div>
        </div>
        <a class="arrow" href="${escapeHtml(p.repo)}" target="_blank" rel="noopener" aria-label="${escapeHtml(p.name)} repository on GitHub">↗</a>
      </article>`
    )
    .join("");

  return `
  <section id="projects">
    <div class="wrap">
      <div class="sec-head">
        <h2>Featured Projects</h2>
        <div class="eyebrow">Selected work · ${range}</div>
      </div>
      <div class="projects" id="projectList">${rows}</div>
    </div>
  </section>`;
}

// One project is open at a time. Hover, keyboard focus, Enter/Space and tap all open a row.
export function initProjects() {
  const rows = [...document.querySelectorAll("#projectList .proj")];
  const open = (row) =>
    rows.forEach((r) => {
      const on = r === row;
      r.classList.toggle("open", on);
      r.setAttribute("aria-expanded", on);
    });

  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => open(row));
    row.addEventListener("focusin", () => open(row));
    row.addEventListener("click", (e) => {
      if (!e.target.closest("a")) open(row);
    });
    row.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target === row) {
        e.preventDefault();
        open(row);
      }
    });
  });
}
