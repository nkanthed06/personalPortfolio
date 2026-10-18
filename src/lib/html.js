// Escape text before placing it inside HTML markup.
export const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Link that opens in a new tab, or plain text when there is no URL.
export const externalLink = (text, url) =>
  url
    ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(text)} ↗</a>`
    : escapeHtml(text);

export const tagList = (tags) =>
  `<div class="tags">${tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`;
