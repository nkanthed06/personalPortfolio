import emailIcon from "../assets/icons/email.svg?raw";
import githubIcon from "../assets/icons/github.svg?raw";
import linkedinIcon from "../assets/icons/linkedin.svg?raw";
import { social, gmailComposeUrl } from "../data/social.js";
import { escapeHtml } from "../lib/html.js";

// Round email / GitHub / LinkedIn buttons, used in the hero and contact sections.
export function renderSocialLinks() {
  return `
    <div class="socials">
      <a class="social" href="${escapeHtml(gmailComposeUrl(social.email))}" target="_blank" rel="noopener" aria-label="Email Nirav in Gmail">${emailIcon}</a>
      <a class="social" href="${escapeHtml(social.github)}" target="_blank" rel="noopener" aria-label="GitHub"><span class="gh">${githubIcon}</span></a>
      <a class="social" href="${escapeHtml(social.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${linkedinIcon}</a>
    </div>`;
}
