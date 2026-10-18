import { skills } from "../data/skills.js";
import { escapeHtml } from "../lib/html.js";

// Skills & Technologies column.
export function renderSkills() {
  const rows = skills
    .map(
      (s) =>
        `<div class="row"><div class="k">${escapeHtml(s.group)}</div><div class="v">${escapeHtml(s.items.join(" · "))}</div></div>`
    )
    .join("");

  return `
      <div>
        <h2>Skills &amp; Technologies</h2>
        <div class="rows">${rows}</div>
      </div>`;
}
