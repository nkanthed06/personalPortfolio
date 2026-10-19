Hey 👋
I’m Nirav Kanthed, a Data Science student at UC San Diego. Here’s my personal portfolio.

## Overview

A single-page site with five sections:

- **Home**: introduction, resume download, and links to email, GitHub and LinkedIn.
- **Experience**: a timeline of my roles. A copper progress line follows your scroll position and highlights the role you're reading.
- **Featured Projects**: one row per project; hover, focus or tap a row to see its description and tech stack, or follow the ↗ arrow to its repository.
- **Skills & Education**: technologies I work with, my degree and campus leadership.
- **Contact**: email and social links.

Behind the page, an animated copper wireframe sheet waves continuously and moves to the edges of the screen in the content-heavy sections. A small tracker on the left edge shows which section you're in and jumps to any section on click.

## Tech stack

- HTML, CSS and plain JavaScript (ES modules), with no UI framework
- Canvas 2D for the animated wireframe background
- [Vite](https://vite.dev/) for the dev server and production build
- Google Fonts: Instrument Sans, IBM Plex Sans and IBM Plex Mono

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
git clone https://github.com/nkanthed06/personalPortfolio.git
cd personalPortfolio
npm install
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with live reload at http://localhost:5173 |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the production build locally at http://localhost:4173 |

The build uses relative asset paths, so the contents of `dist/` can be hosted from any folder, including a GitHub Pages project URL.

## Deploying

- **GitHub Pages:** `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.
- **Cloudflare Workers:** Cloudflare runs `npm run build` and then `npx wrangler deploy`, which serves `dist/` using `wrangler.jsonc`. The `name` in that file must match the project name in the Cloudflare dashboard.

## Project structure

```
index.html              Page shell: background canvas, tracker, and mount points
wrangler.jsonc          Cloudflare Workers deployment settings
.github/workflows/      GitHub Pages deployment
src/
  main.js               Renders the sections in order and starts the interactive modules
  data/                 Content: edit these files to update the site
    experience.js       Roles, dates, bullet points, tags and logos
    projects.js         Featured projects
    education.js        Degree and leadership
    skills.js           Skill groups and the hero's technology line
    social.js           Email, GitHub, LinkedIn, locations and resume file
  sections/             One module per section, each returning its HTML
    hero.js, experience.js, projects.js, skills.js, education.js, contact.js
    social-links.js     Email / GitHub / LinkedIn buttons shared by hero and contact
  modules/              Page-wide behavior
    wireframe.js        Animated wireframe background
    tracker.js          Sidebar section tracker
    timeline-progress.js  Experience scroll-progress line and active role
  styles/
    tokens.css          Shared colors, typography and spacing variables
    base.css            Reset, layout container, section spacing, shared pieces
    hero.css, experience.css, tracker.css, projects.css,
    skills-education.css, contact.css
  lib/html.js           Small helpers for escaping text and building links and tags
  assets/
    logos/              Company and lab logos
    icons/              Email, GitHub and LinkedIn icons
    resume/             Downloadable resume (PDF)
```

To update content, edit the files in `src/data/`. To replace the resume, swap the PDF in `src/assets/resume/` and keep the file name, or update the import in `src/data/social.js`.
