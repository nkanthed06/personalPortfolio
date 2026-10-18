import { social } from "../data/social.js";
import { escapeHtml } from "../lib/html.js";
import { renderSocialLinks } from "./social-links.js";

export function renderContact() {
  return `
  <section class="contact" id="contact">
    <div class="wrap">
      <div class="inner">
        <h2>Let’s build<br>what comes<br><span class="outline">next.</span></h2>
        <p>Open to software and ML engineering roles, research collaborations, and good ideas.</p>
        <div class="mail">${escapeHtml(social.email)}</div>
        ${renderSocialLinks()}
      </div>
    </div>
  </section>`;
}

export function renderFooter() {
  const places = social.locations.map((p) => p.toUpperCase()).join(" · ");
  return `<div class="wrap"><span>© 2026 ${escapeHtml(social.name.toUpperCase())}</span><span>${escapeHtml(places)}</span></div>`;
}
