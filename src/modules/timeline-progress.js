// Experience scroll progress: the copper fill grows down the timeline spine to the
// reading line, and the entry whose logo the line has reached becomes active.

export function initTimelineProgress() {
  const timeline = document.getElementById("tl");
  const fill = document.getElementById("spineFill");
  const entries = [...timeline.querySelectorAll(".entry")];
  const years = [...timeline.querySelectorAll(".yr-row")];
  const nodes = entries.map((el) => el.querySelector(".logo"));
  let active = -1;
  let queued = false;

  function update() {
    queued = false;
    const box = timeline.getBoundingClientRect();
    const readingLine = innerHeight * 0.45;
    fill.style.height = `${Math.max(0, Math.min(box.height, readingLine - box.top))}px`;

    let best = 0;
    nodes.forEach((node, i) => {
      const b = node.getBoundingClientRect();
      if (b.top + b.height / 2 <= readingLine + 1) best = i;
    });
    if (best === active) return;
    active = best;
    entries.forEach((el, i) => el.classList.toggle("on", i === best));
    const year = entries[best].dataset.y;
    years.forEach((row) => row.classList.toggle("on", row.dataset.y === year));
  }

  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  update();
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
}
