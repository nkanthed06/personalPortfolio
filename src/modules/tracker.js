// Sidebar section tracker: one bar per major section. The bar for the section
// occupying the reading area is lit; clicking a bar scrolls to its section.

const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills & Education" },
  { id: "contact", label: "Contact" },
];

export function initTracker(nav) {
  nav.innerHTML = SECTIONS.map(
    (s) => `<a href="#${s.id}" data-sec="${s.id}" aria-label="${s.label}"><i></i><span>${s.label.replace("&", "&amp;")}</span></a>`
  ).join("");

  const links = [...nav.querySelectorAll("a")];
  const sections = links.map((a) => document.getElementById(a.dataset.sec));
  let current = null;
  let queued = false;

  function update() {
    queued = false;
    const readingLine = innerHeight * 0.4;
    const doc = document.documentElement;
    let index = 0;
    if (scrollY + innerHeight >= doc.scrollHeight - 4) {
      index = sections.length - 1; // reached the bottom of the page
    } else {
      sections.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= readingLine) index = i;
      });
    }
    if (index === current) return;
    current = index;
    links.forEach((a, i) => {
      a.classList.toggle("on", i === index);
      if (i === index) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  links.forEach((a, i) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      sections[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    })
  );

  addEventListener("scroll", () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  addEventListener("resize", update);
  addEventListener("hashchange", update);
  update();
}
