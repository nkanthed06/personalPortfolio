// Animated wireframe background: a sparse, triangulated copper sheet.
//
// One large curved surface (a slightly squashed, twisting spherical cap) seen so its
// rim folds away from the viewer. Edges compress near the rim and open into broad
// triangles across the face.
//
// Two layers of motion:
//   1. Scroll position picks where the sheet sits for each section (SECTION_PLACEMENT)
//      and eases between sections, keeping it away from content-heavy areas.
//   2. Time keeps it moving even when the page is still: the whole sheet sweeps, bobs
//      and rocks, and folds travel across its surface.

/* --- per-section placement (fractions of the viewport) ---
   x, y: sheet center; r: radius as a fraction of the larger side; roll: rotation;
   flip: mirror horizontally; vis: overall strength; hush: fade under the content column;
   move: how far the whole sheet drifts on its own (the surface keeps waving everywhere) */
const SECTION_PLACEMENT = {
  top:        { x: 1.56, y: 0.68, r: 1.08, roll: 0.70, flip: 1, vis: 1.00, hush: 0.50, move: 1.00 },
  experience: { x: 1.47, y: 0.58, r: 1.00, roll: 0.55, flip: 1, vis: 0.95, hush: 0.95, move: 0.60 },
  projects:   { x: 1.75, y: 0.55, r: 0.95, roll: 0.50, flip: 1, vis: 0.04, hush: 1.00, move: 0.45 },
  skills:     { x: -0.04, y: 1.62, r: 1.00, roll: -0.50, flip: -1, vis: 0.95, hush: 0.45, move: 0.65 },
  contact:    { x: -0.42, y: 0.64, r: 1.05, roll: -0.62, flip: -1, vis: 1.00, hush: 0.15, move: 1.00 },
};
const SECTION_ORDER = ["top", "experience", "projects", "skills", "contact"];

// On phones the hero sheet drops below the intro instead of sitting beside it.
const placementFor = (key, width) => {
  if (width < 700 && key === "top") return { ...SECTION_PLACEMENT.top, x: 1.18, y: 1.3, r: 0.95, roll: 0.95, hush: 0.2 };
  if (width < 700 && key === "contact") return { ...SECTION_PLACEMENT.contact, x: -0.25, y: 1.25 };
  return SECTION_PLACEMENT[key];
};

const LEVELS = 12; // number of stroke shades
const TAU = Math.PI * 2;
const smoothstep = (x) => x * x * (3 - 2 * x);

/* --- topology: jittered lat/long patch, triangulated once --- */
function buildSheet() {
  const NA = 15; // rows across the sheet
  const NB = 19; // columns along it
  const hash = (i, j, k) => {
    const x = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const verts = [];
  for (let i = 0; i <= NA; i++) {
    for (let j = 0; j <= NB; j++) {
      const edge = i === 0 || i === NA || j === 0 || j === NB;
      const calm = Math.min(1, j / 5); // keep the fold's strands smooth
      const ja = edge ? 0 : (hash(i, j, 1) - 0.5) * 0.55 * calm;
      const jb = edge ? 0 : (hash(i, j, 2) - 0.5) * 0.55 * calm;
      // uneven spacing: rows bunch toward one side, columns stretch toward the far side
      const a = Math.pow((i + ja) / NA, 1.15);
      const b = Math.pow((j + jb) / NB, 1.35);
      verts.push({ a, b, rim: Math.min(i, NA - i, j + 2.2, NB - j) });
    }
  }

  // each shared edge is stored once
  const id = (i, j) => i * (NB + 1) + j;
  const edges = [];
  const seen = new Set();
  const add = (p, q) => {
    const k = p < q ? p * 10000 + q : q * 10000 + p;
    if (!seen.has(k)) {
      seen.add(k);
      edges.push([p, q]);
    }
  };
  for (let i = 0; i < NA; i++) {
    for (let j = 0; j < NB; j++) {
      const p00 = id(i, j), p01 = id(i, j + 1), p10 = id(i + 1, j), p11 = id(i + 1, j + 1);
      add(p00, p01); add(p00, p10); add(p01, p11); add(p10, p11);
      if (hash(i, j, 3) < 0.5) add(p00, p11); // varied diagonals
      else add(p01, p10);
    }
  }
  return { verts, edges };
}

/* --- copper palette, mixed toward the page black instead of using alpha,
       so overlapping edges never add up into bright patches --- */
function buildShades() {
  const css = getComputedStyle(document.documentElement);
  const rgb = (name, fallback) => {
    const v = (css.getPropertyValue(name) || fallback).trim().replace("#", "");
    return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
  };
  const bg = rgb("--bg", "#0a0b0c");
  const deep = rgb("--mesh-deep", "#4a1c10");
  const main = rgb("--mesh-main", "#783017");
  const hi = rgb("--mesh-hi", "#a44b24");
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return Array.from({ length: LEVELS }, (_, k) => {
    const t = (k + 0.5) / LEVELS; // 0 = barely there, 1 = highlight
    const c = t < 0.6 ? mix(bg, deep, t / 0.6) : t < 0.9 ? mix(deep, main, (t - 0.6) / 0.3) : mix(main, hi, (t - 0.9) / 0.1);
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  });
}

export function startWireframe(canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { verts, edges } = buildSheet();
  const shades = buildShades();
  const projected = new Array(verts.length);
  let W, H, dpr;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth;
    H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // scroll positions at which each section is centered in the viewport
  let anchors = [];
  function measure() {
    anchors = SECTION_ORDER.map((key) => {
      const el = document.getElementById(key);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + scrollY;
      return { key, at: Math.max(0, top + el.offsetHeight * 0.5 - innerHeight * 0.5) };
    }).filter(Boolean);
  }

  // layer 1: where the sheet sits for the current scroll position
  function placement() {
    const y = scrollY;
    if (y <= anchors[0].at) return { ...placementFor(anchors[0].key, W) };
    for (let n = 0; n < anchors.length - 1; n++) {
      const A = anchors[n], B = anchors[n + 1];
      if (y <= B.at) {
        const t = smoothstep((y - A.at) / Math.max(1, B.at - A.at));
        const P = placementFor(A.key, W), Q = placementFor(B.key, W), out = {};
        for (const key in P) out[key] = P[key] + (Q[key] - P[key]) * t;
        out.flip = t < 0.5 ? P.flip : Q.flip; // swaps only while the sheet is hidden
        if (P.flip !== Q.flip) out.vis *= Math.abs(t - 0.5) * 2; // dip visibility when changing sides
        return out;
      }
    }
    return { ...placementFor(anchors[anchors.length - 1].key, W) };
  }

  function draw(ms) {
    const t = ms / 1000;
    const pl = placement();
    ctx.clearRect(0, 0, W, H);
    if (pl.vis < 0.01) return;

    /* whole-form motion: the sheet sweeps sideways (~13% of the viewport peak to peak
       in hero/contact), bobs and rocks, around its section position */
    const mv = pl.move;
    const sweep = Math.sin((TAU * t) / 19), bob = Math.sin((TAU * t) / 23 + 1.3), rock = Math.sin((TAU * t) / 21 + 0.6);
    const S = Math.max(W, H) * pl.r * (1 + 0.04 * mv * Math.sin((TAU * t) / 27));
    const cx = W * (pl.x + 0.065 * mv * sweep * pl.flip);
    const cy = H * (pl.y + 0.045 * mv * bob);
    const roll = pl.roll + 0.11 * mv * rock * pl.flip;
    const cr = Math.cos(roll), sr = Math.sin(roll);

    /* surface motion: folds travel across the sheet (~11 s), plus a slow twist (~17 s) */
    const amp = 0.55 + 0.45 * mv;
    const wave = (TAU * t) / 11, twist = Math.sin((TAU * t) / 17), lean = 0.34 + 0.07 * Math.sin((TAU * t) / 24);
    const cl = Math.cos(Math.atan(lean)), sl = Math.sin(Math.atan(lean));

    for (let n = 0; n < verts.length; n++) {
      const v = verts[n];
      // sheet coordinates -> angles on a cap whose left rim curls away (lon ≈ -π/2 is the fold)
      let lat = (v.a - 0.5) * 2.35;
      let lon = -1.72 + v.b * 2.15;
      lon += amp * (0.17 * Math.sin(1.5 * lat - wave) + 0.12 * twist * lat);
      lat += amp * 0.07 * Math.sin(1.2 * lon - (TAU * t) / 13);
      const r = 1 + amp * (0.085 * Math.sin(1.3 * lat + 1.1 * lon - wave) + 0.05 * Math.sin(0.9 * lon - 1.7 * lat + (TAU * t) / 14));
      let x = r * Math.cos(lat) * Math.sin(lon), y = r * Math.sin(lat) * 1.12, z = -r * Math.cos(lat) * Math.cos(lon);
      // lean the cap so the fold sweeps diagonally
      const ty = y * cl - z * sl, tz = y * sl + z * cl;
      y = ty; z = tz;
      const f = 3.6 / (3.6 + z + 1); // mild perspective
      const X = x * S * f * pl.flip, Y = y * S * f;
      projected[n] = [cx + X * cr - Y * sr, cy + X * sr + Y * cr, z, v.rim];
    }

    const paths = Array.from({ length: LEVELS }, () => new Path2D());
    const columnHalfWidth = Math.min(W * 0.5, 640); // readable column
    const hushX = pl.flip > 0 ? W * 0.42 : W * 0.58;
    for (const [p, q] of edges) {
      const A = projected[p], B = projected[q];
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      if ((mx < -60 || mx > W + 60 || my < -60 || my > H + 60) &&
          (A[0] < -60 || A[0] > W + 60 || A[1] < -60 || A[1] > H + 60)) continue;
      const zm = (A[2] + B[2]) / 2;
      const fold = Math.exp(-(zm / 0.32) * (zm / 0.32)); // compressed edges near the fold read clearest
      const depth = Math.min(1, Math.max(0, 0.38 + 0.62 * fold - Math.max(0, zm) * 0.5));
      const rim = Math.min(1, Math.min(A[3], B[3]) / 2.2); // soften the sheet's borders
      const dx = Math.abs(mx - hushX) / columnHalfWidth; // fade beneath content
      const hush = 1 - pl.hush * Math.max(0, 1 - dx * dx);
      const vy = Math.max(0, Math.min(1, Math.min(my, H - my) / (H * 0.12) + 0.25)); // soft top/bottom fade
      const k = Math.pow(depth * rim * hush * vy * pl.vis, 1.15) * 0.86;
      if (!(k > 0.02)) continue;
      const level = Math.min(LEVELS - 1, Math.floor(k * LEVELS));
      paths[level].moveTo(A[0], A[1]);
      paths[level].lineTo(B[0], B[1]);
    }
    ctx.lineWidth = 1 / dpr; // one device pixel
    for (let k = 0; k < LEVELS; k++) {
      ctx.strokeStyle = shades[k];
      ctx.stroke(paths[k]);
    }
  }

  resize();
  measure();
  addEventListener("resize", () => { resize(); measure(); });
  addEventListener("load", measure);
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(document.body);

  if (reduceMotion) {
    const still = () => draw(0);
    still();
    addEventListener("scroll", still, { passive: true });
    addEventListener("resize", still);
  } else {
    const loop = (ms) => { draw(ms); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
}
