import { education, leadership } from "../data/education.js";
import { escapeHtml } from "../lib/html.js";

// Education column.
export function renderEducation() {
  const schools = education
    .map(
      (e) => `
          <div class="row">
            <div class="k">${escapeHtml(e.label)}</div>
            <div class="v">
              <h4>${escapeHtml(e.school)}</h4>${escapeHtml(e.degree)}
              <small class="spec">${escapeHtml(e.specialization)}</small>
              <small>${escapeHtml(e.note)}</small>
            </div>
          </div>`
    )
    .join("");

  return `
      <div>
        <h2>Education</h2>
        <div class="rows">
          ${schools}
          <div class="row">
            <div class="k">${escapeHtml(leadership.label)}</div>
            <div class="v"><h4>${escapeHtml(leadership.title)}</h4>${escapeHtml(leadership.detail)}</div>
          </div>
        </div>
      </div>`;
}
