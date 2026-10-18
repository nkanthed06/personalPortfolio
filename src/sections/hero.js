import { heroStack } from "../data/skills.js";
import { resume } from "../data/social.js";
import { escapeHtml } from "../lib/html.js";
import { renderSocialLinks } from "./social-links.js";

export function renderHero() {
  return `
  <header class="hero" id="top">
    <div class="wrap"><div class="hero-inner">
      <div class="eyebrow">Software &amp; ML Engineer / 2026</div>
      <h1>Nirav <span class="outline">Kanthed</span></h1>
      <div class="stack">${escapeHtml(heroStack.join(" · ").toUpperCase())}</div>
      <p class="lede">I’m passionate about building useful software and applying machine learning to practical problems. My work spans full-stack applications, speech recognition, and AI tools for developers.</p>
      <div class="cta">
        <a class="btn primary" href="#experience">View Experience</a>
        <a class="btn" href="${escapeHtml(resume.url)}" download="${escapeHtml(resume.filename)}">Download Resume</a>
      </div>
      ${renderSocialLinks()}
    </div></div>
  </header>`;
}
