import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/hero.css";
import "./styles/experience.css";
import "./styles/tracker.css";
import "./styles/projects.css";
import "./styles/skills-education.css";
import "./styles/contact.css";

import { renderHero } from "./sections/hero.js";
import { renderExperience } from "./sections/experience.js";
import { renderProjects, initProjects } from "./sections/projects.js";
import { renderSkills } from "./sections/skills.js";
import { renderEducation } from "./sections/education.js";
import { renderContact, renderFooter } from "./sections/contact.js";
import { startWireframe } from "./modules/wireframe.js";
import { initTracker } from "./modules/tracker.js";
import { initTimelineProgress } from "./modules/timeline-progress.js";

// 1. Render the page sections in order.
document.getElementById("main").innerHTML = [
  renderHero(),
  renderExperience(),
  renderProjects(),
  `<section id="skills"><div class="wrap two">${renderSkills()}${renderEducation()}</div></section>`,
  renderContact(),
].join("");
document.getElementById("footer").innerHTML = renderFooter();

// 2. Start the interactive pieces.
initTimelineProgress();
initTracker(document.getElementById("tracker"));
initProjects();
startWireframe(document.getElementById("mesh"));

// 3. Sections are rendered by script, so honor a direct link such as /#projects.
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
