/**
 * Generative artwork for The Hawaii Agency.
 *
 * Every illustration on the site (hero ridgelines, topographic contours, the
 * service "blueprint" series, article cover, OG image, favicons) is produced
 * deterministically by this script, so the art direction stays coherent and
 * reproducible. Run with `npm run art`. Outputs:
 *   src/assets/images/art/*.webp   – raster art, optimised later by astro:assets
 *   src/assets/art/*.svg           – vector line art inlined for draw-on animations
 *   public/og/default.jpg, public/favicon.svg, public/apple-touch-icon.png, public/favicon-32.png
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_RASTER = path.join(ROOT, 'src/assets/images/art');
const OUT_VECTOR = path.join(ROOT, 'src/assets/art');
const OUT_PUBLIC = path.join(ROOT, 'public');
for (const d of [OUT_RASTER, OUT_VECTOR, path.join(OUT_PUBLIC, 'og')]) fs.mkdirSync(d, { recursive: true });

const C = {
  mist: '#F3F7FA',
  sky50: '#EAF2F9',
  sky100: '#DFEBF6',
  powder: '#B7D3ED',
  sky300: '#8DB8E2',
  blue: '#2869B2',
  deep: '#173F70',
  navy: '#0F2238',
  warm: '#F7F2EA',
  white: '#FFFFFF',
};

/* ------------------------------------------------------------------ noise */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeNoise(seed) {
  const rnd = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h, x, y) => { const g = h & 7; const u = g < 4 ? x : y; const v = g < 4 ? y : x; return ((g & 1) ? -u : u) + ((g & 2) ? -2 * v : 2 * v); };
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  const n2 = (x, y) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = perm[X] + Y, b = perm[X + 1] + Y;
    return lerp(lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u), lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u), v) / 2.2;
  };
  const fbm = (x, y, oct = 5) => { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * n2(x * f, y * f); n += a; a *= 0.5; f *= 2.03; } return s / n; };
  return { n2, fbm, rnd };
}

const f1 = (n) => Math.round(n * 10) / 10;
const svgDoc = (w, h, body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;

async function toWebp(svg, file, quality = 84) {
  await sharp(Buffer.from(svg), { density: 72, limitInputPixels: false }).webp({ quality, effort: 5 }).toFile(path.join(OUT_RASTER, file));
  console.log('  ✓', file);
}

/* grain overlay used by every raster piece */
const grainDefs = (id = 'grain', freq = 0.85) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="7" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>`;
const grainRect = (w, h, id = 'grain', op = 0.07) => `<rect width="${w}" height="${h}" filter="url(#${id})" opacity="${op}"/>`;

/* ------------------------------------------------------------ ridgelines */
function ridgeScene({ w, h, seed = 3, horizon = 0.78, sea = true, glowX = 0.28, glowY = 0.3, layers: layerCount = 6, warmth = 1, topRatio = 0.36 }) {
  const N = makeNoise(seed);
  const colors = ['#E2EBF4', '#D0DFEE', '#B9D0E7', '#9DBCDD', '#7CA2CD', '#5A86B9', '#3C679C'].slice(-layerCount);
  const top = h * topRatio, bottom = h * horizon;
  let defs = grainDefs();
  defs += `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#DCE8F4"/><stop offset=".55" stop-color="#EEF3F8"/><stop offset="1" stop-color="${warmth ? '#F6F2EC' : '#F1F5F9'}"/></linearGradient>
    <radialGradient id="glow" cx="${glowX}" cy="${glowY}" r=".55">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".35" stop-color="#FBF8F3" stop-opacity=".45"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF3F8" stop-opacity="0"/><stop offset="1" stop-color="#EEF3F8" stop-opacity=".78"/></linearGradient>
    <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B86B6"/><stop offset=".3" stop-color="#3A6699"/><stop offset="1" stop-color="#1D3F68"/></linearGradient>
    <linearGradient id="fd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0F2238" stop-opacity=".16"/><stop offset="1" stop-color="#0F2238" stop-opacity="0"/></linearGradient>
    <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".2"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient>
    <linearGradient id="fluteShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0F2238" stop-opacity=".35"/></linearGradient>`;
  let body = `<rect width="${w}" height="${h}" fill="url(#sky)"/><rect width="${w}" height="${h}" fill="url(#glow)"/>`;

  // high thin clouds – long soft horizontal strokes
  for (let i = 0; i < 9; i++) {
    const y = h * (0.08 + N.rnd() * 0.22), x = w * (N.rnd() * 0.9 - 0.1), len = w * (0.25 + N.rnd() * 0.4);
    body += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(len)}" height="${f1(2 + N.rnd() * 5)}" rx="4" fill="#fff" opacity="${(0.25 + N.rnd() * 0.4).toFixed(2)}"/>`;
  }

  for (let L = 0; L < colors.length; L++) {
    const t = L / (colors.length - 1);
    const base = top + (bottom - top) * (0.22 + t * 0.62);
    const amp = h * (0.07 + t * 0.2) * (L === colors.length - 1 ? 1.05 : 1);
    const freq = 1.6 + L * 0.55;
    const pts = [];
    const step = 4;
    for (let x = -step; x <= w + step; x += step) {
      const u = x / w;
      const r1 = 1 - Math.abs(N.fbm(u * freq + L * 13.1, L * 3.7, 4));
      const r2 = 1 - Math.abs(N.n2(u * freq * 3.1 + L * 7, 11.3));
      // Koʻolau-like: steep, peaked, a rising massif on one side for the near layers
      const massif = L >= colors.length - 3 ? Math.pow(Math.max(0, Math.sin((u + 0.1 + L * 0.13) * Math.PI * 0.95)), 1.4) * 0.55 : 0.25;
      const y = base - amp * (Math.pow(r1, 2.2) * 0.75 + Math.pow(r2, 3) * 0.25 + massif);
      pts.push([x, y]);
    }
    const d = `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L')} L${w + step} ${h} L${-step} ${h} Z`;
    const clipId = `rc${L}`;
    defs += `<clipPath id="${clipId}"><path d="${d}"/></clipPath>`;
    defs += `<linearGradient id="lg${L}" gradientUnits="userSpaceOnUse" x1="0" y1="${f1(base - amp * 1.3)}" x2="0" y2="${f1(Math.min(bottom, base + h * 0.14))}"><stop offset="0" stop-color="${colors[L]}"/><stop offset=".6" stop-color="${colors[L]}"/><stop offset="1" stop-color="#D8E5F1"/></linearGradient>`;
    body += `<path d="${d}" fill="url(#lg${L})"/>`;

    // fluted cliffs – vertical erosion streaks on the nearer layers
    if (L >= colors.length - 4) {
      let flutes = '';
      for (let x = 0; x < w; x += 3 + N.rnd() * (10 + t * 8)) {
        const idx = Math.min(pts.length - 1, Math.max(0, Math.round((x + step) / step)));
        const yTop = pts[idx][1] - 2;
        const len = (base + h * 0.1 - yTop) * (0.25 + Math.pow(N.rnd(), 1.5) * 0.55);
        const dark = N.rnd() > 0.45;
        flutes += `<rect x="${f1(x)}" y="${f1(yTop)}" width="${f1(2 + N.rnd() * (5 + t * 9))}" height="${f1(Math.max(0, len))}" fill="url(#${dark ? 'fd' : 'fl'})" opacity="${(0.35 + N.rnd() * 0.65).toFixed(2)}"/>`;
      }
      body += `<g clip-path="url(#${clipId})">${flutes}<rect x="0" y="${f1(base - amp)}" width="${w}" height="${f1(h - base + amp)}" fill="url(#fluteShade)" opacity="${(0.1 + t * 0.25).toFixed(2)}"/></g>`;
    }
    // atmospheric haze at the foot of each layer (not the nearest)
    {
      const hz = h * (L < colors.length - 1 ? 0.09 : 0.05);
      body += `<rect x="0" y="${f1(base - hz * 0.9)}" width="${w}" height="${f1(hz * 1.6)}" fill="url(#haze)"/>`;
    }
  }

  if (sea) {
    const sy = h * horizon;
    body += `<rect x="0" y="${f1(sy)}" width="${w}" height="${f1(h - sy)}" fill="url(#seaG)"/>`;
    // glints: light on the water beneath the glow
    let glints = '';
    for (let i = 0; i < 260; i++) {
      const yy = sy + Math.pow(N.rnd(), 1.6) * (h - sy);
      const depth = (yy - sy) / (h - sy);
      const cx = w * glowX + (N.rnd() - 0.5) * w * (0.25 + depth * 0.9);
      const len = 6 + N.rnd() * (30 + depth * 140);
      glints += `<rect x="${f1(cx - len / 2)}" y="${f1(yy)}" width="${f1(len)}" height="${f1(1 + depth * 2.2)}" rx="1" fill="#EAF2F9" opacity="${(0.08 + N.rnd() * 0.45 * (1 - depth * 0.5)).toFixed(2)}"/>`;
    }
    body += glints + `<rect x="0" y="${f1(sy)}" width="${w}" height="1.5" fill="#EAF2F9" opacity=".55"/>`;
  }
  body += grainRect(w, h, 'grain', 0.08);
  return svgDoc(w, h, body, defs);
}

/* ------------------------------------------------------------ contours */
function heightField(seed, cols, rows, peaks) {
  const N = makeNoise(seed);
  const g = [];
  for (let j = 0; j <= rows; j++) {
    const row = [];
    for (let i = 0; i <= cols; i++) {
      const x = i / cols, y = j / rows;
      let h = 0;
      for (const p of peaks) {
        const dx = (x - p.x) / p.rx, dy = (y - p.y) / p.ry;
        h += p.h * Math.exp(-(dx * dx + dy * dy) * 1.6);
      }
      h += N.fbm(x * 3.2, y * 3.2, 5) * 0.55 + (1 - Math.abs(N.n2(x * 7, y * 7))) * 0.05;
      row.push(h);
    }
    g.push(row);
  }
  return g;
}
function marching(grid, level, sx, sy) {
  const segs = [];
  const rows = grid.length - 1, cols = grid[0].length - 1;
  const lerp = (a, b) => (level - a) / (b - a);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], d = grid[j + 1][i];
    const k = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
    if (k === 0 || k === 15) continue;
    const T = [(i + lerp(a, b)) * sx, j * sy], R = [(i + 1) * sx, (j + lerp(b, c)) * sy];
    const B = [(i + lerp(d, c)) * sx, (j + 1) * sy], Lf = [i * sx, (j + lerp(a, d)) * sy];
    const map = { 1: [[Lf, B]], 2: [[B, R]], 3: [[Lf, R]], 4: [[T, R]], 5: [[Lf, T], [B, R]], 6: [[T, B]], 7: [[Lf, T]], 8: [[Lf, T]], 9: [[T, B]], 10: [[T, R], [Lf, B]], 11: [[T, R]], 12: [[Lf, R]], 13: [[B, R]], 14: [[Lf, B]] };
    for (const s of map[k]) segs.push(s);
  }
  // join into polylines
  const key = (p) => `${Math.round(p[0] * 10)},${Math.round(p[1] * 10)}`;
  const adj = new Map();
  segs.forEach((s, idx) => { for (const p of s) { const k = key(p); if (!adj.has(k)) adj.set(k, []); adj.get(k).push(idx); } });
  const used = new Uint8Array(segs.length);
  const lines = [];
  for (let s = 0; s < segs.length; s++) {
    if (used[s]) continue;
    used[s] = 1;
    const line = [segs[s][0], segs[s][1]];
    for (const dir of [1, 0]) {
      let guard = 0;
      while (guard++ < 20000) {
        const end = dir ? line[line.length - 1] : line[0];
        const next = (adj.get(key(end)) || []).find((n) => !used[n]);
        if (next === undefined) break;
        used[next] = 1;
        const [p, q] = segs[next];
        const other = key(p) === key(end) ? q : p;
        dir ? line.push(other) : line.unshift(other);
      }
    }
    if (line.length > 3) lines.push(line);
  }
  return lines;
}
function smoothPath(line) {
  // Catmull-Rom → cubic bezier for silky contours
  if (line.length < 3) return '';
  let d = `M${f1(line[0][0])} ${f1(line[0][1])}`;
  for (let i = 0; i < line.length - 1; i++) {
    const p0 = line[i - 1] || line[i], p1 = line[i], p2 = line[i + 1], p3 = line[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}
function contourPaths({ w, h, seed, peaks, levels = 14, cols = 96, rows }) {
  rows = rows ?? Math.round(cols * (h / w));
  const g = heightField(seed, cols, rows, peaks);
  let min = Infinity, max = -Infinity;
  g.flat().forEach((v) => { min = Math.min(min, v); max = Math.max(max, v); });
  const out = [];
  for (let l = 1; l <= levels; l++) {
    const level = min + ((max - min) * l) / (levels + 1);
    const lines = marching(g, level, w / cols, h / rows);
    out.push({ l, d: lines.map(smoothPath).join('') });
  }
  return out;
}
function writeContourSvg(name, opts) {
  const { w, h } = opts;
  const paths = contourPaths(opts);
  const body = paths.map(({ l, d }) => `<path d="${d}" data-level="${l}"/>`).join('');
  fs.writeFileSync(path.join(OUT_VECTOR, `${name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke">${body}</svg>`);
  console.log('  ✓', `${name}.svg`, `${Math.round(fs.statSync(path.join(OUT_VECTOR, `${name}.svg`)).size / 1024)}KB`);
  return paths;
}

/* --------------------------------------------------- blueprint series */
function plate({ w = 1600, h = 1200, seed, tone = 0, motif }) {
  const N = makeNoise(seed);
  const bgA = ['#E6EFF8', '#E9F0F7', '#E3EDF7', '#EEF3F8'][tone % 4];
  const bgB = ['#C9DDF0', '#D3E3F2', '#BFD6EE', '#DCE7F3'][tone % 4];
  let defs = grainDefs() + `
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></linearGradient>
    <radialGradient id="light" cx=".22" cy=".18" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="22"/><feOffset dy="26"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="shadowS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dy="10"/><feComponentTransfer><feFuncA type="linear" slope=".14"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${C.blue}" stroke-opacity=".08" stroke-width="1"/></pattern>`;
  let body = `<rect width="${w}" height="${h}" fill="url(#bg)"/><rect width="${w}" height="${h}" fill="url(#grid)"/>`;
  // faint contour field
  const cps = contourPaths({ w, h, seed: seed + 100, levels: 11, cols: 72, peaks: [{ x: 0.75 + N.rnd() * 0.2, y: 0.8, rx: 0.5, ry: 0.45, h: 1.1 }] });
  body += `<g fill="none" stroke="${C.blue}" stroke-opacity=".13" stroke-width="1.3">${cps.map((p) => `<path d="${p.d}"/>`).join('')}</g>`;
  body += `<rect width="${w}" height="${h}" fill="url(#light)"/>`;
  body += motif({ w, h, N });
  // corner registration marks – the "blueprint" signature
  const m = 36, s = 18;
  body += `<g stroke="${C.deep}" stroke-opacity=".35" stroke-width="1.5">
    <path d="M${m} ${m + s}V${m}H${m + s}"/><path d="M${w - m - s} ${m}H${w - m}V${m + s}"/>
    <path d="M${m} ${h - m - s}V${h - m}H${m + s}"/><path d="M${w - m - s} ${h - m}H${w - m}V${h - m - s}"/></g>`;
  body += grainRect(w, h, 'grain', 0.06);
  return svgDoc(w, h, body, defs);
}
const stroke = (op = 0.9, sw = 2) => `fill="none" stroke="${C.blue}" stroke-opacity="${op}" stroke-width="${sw}"`;
const pill = (x, y, w, h, fill, op = 1, rx) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx ?? h / 2}" fill="${fill}" opacity="${op}"/>`;

function browser(x, y, w, h, filled, N) {
  let g = `<g ${filled ? 'filter="url(#shadow)"' : ''}>`;
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" ${filled ? `fill=\"${'#fff'}\"` : stroke(0.55, 2)}/>`;
  g += `<path d="M${x} ${y + 46}H${x + w}" ${stroke(filled ? 0.12 : 0.4, 1.5)}/>`;
  for (let i = 0; i < 3; i++) g += `<circle cx="${x + 26 + i * 18}" cy="${y + 23}" r="5" ${filled ? `fill=\"${C.powder}\"` : stroke(0.5, 1.5)}/>`;
  if (filled) {
    g += pill(x + 40, y + 90, w * 0.42, 22, C.navy, 0.9, 4) + pill(x + 40, y + 124, w * 0.3, 22, C.navy, 0.9, 4);
    g += pill(x + 40, y + 172, w * 0.36, 9, C.sky300, 0.8) + pill(x + 40, y + 190, w * 0.3, 9, C.sky300, 0.6);
    g += pill(x + 40, y + 228, 120, 38, C.blue, 1, 19);
    g += `<rect x="${x + w * 0.54}" y="${y + 80}" width="${w * 0.4}" height="${h - 120}" rx="12" fill="${C.sky100}"/>`;
    g += `<path d="M${x + w * 0.54} ${y + h - 40 - 60} Q ${x + w * 0.64} ${y + h - 190} ${x + w * 0.72} ${y + h - 120} T ${x + w * 0.94} ${y + h - 170} V ${y + h - 40} H ${x + w * 0.54} Z" fill="${C.powder}"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x + 40 + i * ((w - 80) / 3)}" y="${y + h - 30 - 0}" width="${(w - 80) / 3 - 16}" height="0" fill="none"/>`;
  } else {
    for (let i = 0; i < 4; i++) g += `<path d="M${x + 40} ${y + 90 + i * 34}H${x + 40 + w * (0.25 + N.rnd() * 0.35)}" ${stroke(0.35, 8)} stroke-linecap="round"/>`;
  }
  return g + '</g>';
}

const motifs = {
  'web-design': ({ w, h, N }) =>
    browser(250, 330, 760, 520, false, N) + browser(420, 250, 800, 560, false, N) + browser(560, 420, 820, 560, true, N) +
    `<path d="M${560 + 820 + 40} 420V980" ${stroke(0.5, 1.5)} stroke-dasharray="4 8"/><text/>`,
  'app-developer': ({ w, h, N }) => {
    let g = '';
    const phone = (cx, cy, rot, filled, sc = 1) => {
      const pw = 300 * sc, ph = 620 * sc;
      let p = `<g transform="rotate(${rot} ${cx} ${cy})" ${filled ? 'filter="url(#shadow)"' : ''}>`;
      p += `<rect x="${cx - pw / 2}" y="${cy - ph / 2}" width="${pw}" height="${ph}" rx="${46 * sc}" ${filled ? `fill=\"${'#fff'}\"` : stroke(0.55, 2)}/>`;
      p += `<rect x="${cx - 40 * sc}" y="${cy - ph / 2 + 18 * sc}" width="${80 * sc}" height="${18 * sc}" rx="${9 * sc}" ${filled ? `fill=\"${C.navy}\"` : stroke(0.4, 1.5)}/>`;
      if (filled) {
        p += `<rect x="${cx - pw / 2 + 22}" y="${cy - ph / 2 + 70}" width="${pw - 44}" height="${ph * 0.38}" rx="20" fill="${C.sky100}"/>`;
        p += `<path d="M${cx - pw / 2 + 22} ${cy - ph / 2 + 70 + ph * 0.38 - 20} Q ${cx - 40} ${cy - ph / 2 + 150} ${cx + 10} ${cy - ph / 2 + 190} T ${cx + pw / 2 - 22} ${cy - ph / 2 + 150} V ${cy - ph / 2 + 70 + ph * 0.38 - 20} Z" fill="${C.powder}"/>`;
        for (let i = 0; i < 3; i++) p += pill(cx - pw / 2 + 22, cy + 10 + i * 58, pw - 44, 44, i === 0 ? C.blue : C.mist, 1, 14);
        p += pill(cx - pw / 2 + 40, cy + 24, 110, 14, '#fff', 0.9);
      } else {
        for (let i = 0; i < 5; i++) p += `<path d="M${cx - pw / 2 + 30} ${cy - 140 + i * 50}H${cx - pw / 2 + 30 + (pw - 60) * (0.4 + N.rnd() * 0.6)}" ${stroke(0.3, 10)} stroke-linecap="round"/>`;
      }
      return p + '</g>';
    };
    g += phone(520, 620, -10, false, 0.95) + phone(1080, 620, 9, false, 0.95) + phone(800, 590, 0, true, 1.05);
    return g;
  },
  'google-ads': ({ w, h, N }) => {
    let g = '';
    const cx = 540, cy = 700;
    for (let r = 60; r < 900; r += 56) g += `<circle cx="${cx}" cy="${cy}" r="${r}" ${stroke(Math.max(0.06, 0.55 - r / 1500), 1.6)}/>`;
    g += `<circle cx="${cx}" cy="${cy}" r="16" fill="${C.blue}"/><circle cx="${cx}" cy="${cy}" r="34" fill="${C.blue}" opacity=".18"/>`;
    // ascending result card
    g += `<g filter="url(#shadow)"><rect x="820" y="300" width="560" height="560" rx="26" fill="#fff"/></g>`;
    const bars = [0.28, 0.36, 0.33, 0.48, 0.56, 0.62, 0.78];
    bars.forEach((b, i) => { g += pill(870 + i * 68, 800 - 380 * b, 40, 380 * b, i === bars.length - 1 ? C.blue : C.powder, 1, 8); });
    g += `<path d="M890 ${800 - 380 * 0.3 - 40} ${bars.map((b, i) => `L${890 + i * 68} ${800 - 380 * b - 40}`).join(' ')}" ${stroke(0.9, 3)}/>`;
    g += pill(870, 350, 180, 18, C.navy, 0.85, 5) + pill(870, 382, 120, 12, C.sky300, 0.8);
    return g;
  },
  seo: ({ w, h, N }) => {
    const cps = contourPaths({ w, h, seed: 77, levels: 16, cols: 90, peaks: [{ x: 0.58, y: 0.42, rx: 0.35, ry: 0.38, h: 2.4 }] });
    let g = `<g fill="none" stroke="${C.blue}" stroke-width="2">${cps.map((p, i) => `<path d="${p.d}" stroke-opacity="${(0.15 + (i / cps.length) * 0.7).toFixed(2)}"/>`).join('')}</g>`;
    // dotted route to summit
    const route = [[180, 1060], [360, 900], [520, 860], [640, 700], [760, 640], [850, 560], [928, 505]];
    g += `<path d="M${route.map((p) => p.join(' ')).join(' L')}" fill="none" stroke="${C.navy}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>`;
    g += `<g filter="url(#shadowS)"><circle cx="928" cy="505" r="26" fill="#fff"/></g><circle cx="928" cy="505" r="10" fill="${C.blue}"/>`;
    g += `<g filter="url(#shadowS)"><rect x="980" y="400" width="300" height="76" rx="38" fill="#fff"/></g>` + pill(1010, 428, 36, 20, C.blue, 1, 10) + pill(1060, 430, 190, 16, C.navy, 0.8, 5);
    return g;
  },
  branding: ({ w, h, N }) => {
    let g = '';
    const cx = 800, cy = 610;
    g += `<circle cx="${cx}" cy="${cy}" r="360" ${stroke(0.35, 1.5)}/><circle cx="${cx}" cy="${cy}" r="250" ${stroke(0.35, 1.5)}/>`;
    g += `<circle cx="${cx - 180}" cy="${cy + 120}" r="180" ${stroke(0.25, 1.5)}/><circle cx="${cx + 180}" cy="${cy + 120}" r="180" ${stroke(0.25, 1.5)}/>`;
    g += `<path d="M${cx - 520} ${cy}H${cx + 520}M${cx} ${cy - 440}V${cy + 440}" ${stroke(0.3, 1.2)} stroke-dasharray="6 8"/>`;
    g += `<path d="M${cx - 360} ${cy - 360}L${cx + 360} ${cy + 360}M${cx + 360} ${cy - 360}L${cx - 360} ${cy + 360}" ${stroke(0.18, 1.2)}/>`;
    // monogram built from horizon strokes (the brand mark)
    g += `<g filter="url(#shadow)"><rect x="${cx - 190}" y="${cy - 190}" width="380" height="380" rx="84" fill="${C.navy}"/></g>`;
    g += pill(cx - 120, cy - 70, 240, 30, C.powder, 1) + pill(cx - 120, cy - 10, 180, 30, C.sky300, 1) + pill(cx - 120, cy + 50, 120, 30, C.blue, 1);
    // swatches
    [C.navy, C.blue, C.sky300, C.powder, C.mist].forEach((c, i) => { g += `<g filter="url(#shadowS)"><rect x="${1150 + (i % 2) * 0}" y="${260 + i * 118}" width="190" height="96" rx="16" fill="${c}"/></g>`; });
    return g;
  },
  ecommerce: ({ w, h, N }) => {
    let g = '';
    // isometric parcels
    const iso = (x, y, s, hgt, fillTop, fillL, fillR) =>
      `<path d="M${x} ${y}l${s} ${-s * 0.5}l${s} ${s * 0.5}l${-s} ${s * 0.5}z" fill="${fillTop}"/>` +
      `<path d="M${x} ${y}l${s} ${s * 0.5}v${hgt}l${-s} ${-s * 0.5}z" fill="${fillL}"/>` +
      `<path d="M${x + s * 2} ${y}l${-s} ${s * 0.5}v${hgt}l${s} ${-s * 0.5}z" fill="${fillR}"/>`;
    g += `<g filter="url(#shadow)">${iso(300, 700, 170, 170, '#fff', C.sky100, C.powder)}${iso(560, 760, 130, 130, '#fff', C.sky100, C.powder)}${iso(390, 530, 110, 110, '#fff', C.sky100, C.sky300)}</g>`;
    // product card
    g += `<g filter="url(#shadow)"><rect x="880" y="220" width="460" height="700" rx="26" fill="#fff"/></g>`;
    g += `<rect x="910" y="250" width="400" height="360" rx="18" fill="${C.sky100}"/>`;
    g += `<path d="M910 560 Q 1010 430 1090 500 T 1310 470 V 610 H 910 Z" fill="${C.powder}"/>`;
    g += pill(910, 650, 240, 22, C.navy, 0.9, 5) + pill(910, 690, 150, 14, C.sky300, 0.9) + pill(910, 820, 400, 64, C.blue, 1, 32) + pill(1060, 845, 100, 14, '#fff', 0.9);
    return g;
  },
  software: ({ w, h, N }) => {
    let g = '';
    const nodes = [];
    for (let i = 0; i < 18; i++) nodes.push([240 + N.rnd() * 1120, 220 + N.rnd() * 760]);
    nodes.push([800, 600]);
    const links = [];
    nodes.forEach((a, i) => { nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1])]).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 2).forEach(([j]) => links.push([i, j])); });
    links.forEach(([i, j]) => { g += `<path d="M${f1(nodes[i][0])} ${f1(nodes[i][1])}L${f1(nodes[j][0])} ${f1(nodes[j][1])}" ${stroke(0.45, 1.6)}/>`; });
    nodes.slice(0, -1).forEach(([x, y], i) => { g += i % 3 === 0 ? `<g filter="url(#shadowS)"><rect x="${f1(x - 46)}" y="${f1(y - 26)}" width="92" height="52" rx="12" fill="#fff"/></g>` + pill(x - 26, y - 5, 52, 10, C.sky300, 1) : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i % 2 ? 7 : 11}" fill="${i % 2 ? C.blue : '#fff'}" stroke="${C.blue}" stroke-width="2"/>`; });
    g += `<g filter="url(#shadow)"><rect x="660" y="520" width="280" height="160" rx="24" fill="${C.navy}"/></g>` + pill(700, 562, 150, 16, C.powder, 1, 5) + pill(700, 594, 200, 10, C.sky300, 0.7) + pill(700, 616, 120, 10, C.sky300, 0.5);
    return g;
  },
  'ui-ux': ({ w, h, N }) => {
    let g = '';
    g += `<g filter="url(#shadow)"><rect x="260" y="260" width="520" height="340" rx="28" fill="#fff"/></g>`;
    g += pill(300, 300, 200, 20, C.navy, 0.9, 5) + pill(300, 340, 300, 12, C.sky300, 0.8);
    g += `<rect x="300" y="400" width="440" height="12" rx="6" fill="${C.sky100}"/><rect x="300" y="400" width="280" height="12" rx="6" fill="${C.blue}"/><circle cx="580" cy="406" r="18" fill="#fff" stroke="${C.blue}" stroke-width="3"/>`;
    g += pill(300, 480, 180, 70, C.blue, 1, 35) + pill(500, 480, 180, 70, C.mist, 1, 35);
    // toggles
    g += `<g filter="url(#shadow)"><rect x="850" y="220" width="480" height="240" rx="28" fill="#fff"/></g>`;
    [0, 1, 2].forEach((i) => { g += pill(890, 260 + i * 62, 220, 14, C.navy, 0.75, 5); const on = i !== 1; g += pill(1190, 250 + i * 62, 96, 44, on ? C.blue : C.sky100, 1, 22) + `<circle cx="${on ? 1264 : 1212}" cy="${272 + i * 62}" r="17" fill="#fff"/>`; });
    // cursor + wireflow
    g += `<g filter="url(#shadow)"><rect x="850" y="520" width="480" height="420" rx="28" fill="${C.navy}"/></g>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${890 + i * 140}" y="560" width="120" height="120" rx="16" fill="${i === 1 ? C.blue : '#1E3A5C'}"/>`;
    g += pill(890, 720, 260, 16, C.powder, 0.9, 5) + pill(890, 752, 380, 10, C.sky300, 0.5) + pill(890, 776, 320, 10, C.sky300, 0.5);
    g += `<path d="M1180 820 l0 64 l18 -16 l14 30 l12 -6 l-14 -30 l24 -2 z" fill="#fff"/>`;
    g += `<path d="M520 600 C 520 760, 700 760, 850 740" ${stroke(0.6, 2)} stroke-dasharray="6 10"/>`;
    return g;
  },
  'phone-systems': ({ w, h, N }) => {
    let g = '';
    for (let k = 0; k < 7; k++) {
      let d = '';
      for (let x = 120; x <= 1480; x += 8) {
        const env = Math.exp(-Math.pow((x - 800) / 420, 2));
        const y = 610 + Math.sin(x * (0.018 + k * 0.004) + k) * 170 * env * (1 - k * 0.11) + Math.sin(x * 0.07 + k * 2) * 12 * env;
        d += `${d ? 'L' : 'M'}${x} ${f1(y)}`;
      }
      g += `<path d="${d}" ${stroke(0.75 - k * 0.09, k === 0 ? 3 : 1.6)}/>`;
    }
    g += `<g filter="url(#shadow)"><circle cx="800" cy="610" r="110" fill="${C.navy}"/></g>`;
    g += `<path d="M770 560c-10 0-20 10-18 22 6 44 40 80 84 86 12 2 22-8 22-18v-20l-30-10-14 14c-18-8-32-22-40-40l14-14-10-30z" fill="#fff"/>`;
    [[330, 360], [1270, 360], [330, 860], [1270, 860]].forEach(([x, y]) => { g += `<g filter="url(#shadowS)"><circle cx="${x}" cy="${y}" r="44" fill="#fff"/></g><circle cx="${x}" cy="${y}" r="10" fill="${C.blue}"/><path d="M${x} ${y}L800 610" ${stroke(0.25, 1.4)} stroke-dasharray="3 9"/>`; });
    return g;
  },
  'website-hosting': ({ w, h, N }) => {
    let g = '';
    for (let i = 0; i < 5; i++) {
      const y = 300 + i * 132;
      g += `<g filter="url(#shadow)"><rect x="420" y="${y}" width="760" height="104" rx="20" fill="${i === 2 ? C.navy : '#fff'}"/></g>`;
      for (let k = 0; k < 3; k++) g += `<circle cx="${470 + k * 30}" cy="${y + 52}" r="8" fill="${i === 2 ? (k === 0 ? '#6EE7B7' : C.sky300) : k === 0 ? C.blue : C.powder}"/>`;
      for (let k = 0; k < 14; k++) g += `<rect x="${760 + k * 26}" y="${y + 30}" width="10" height="44" rx="4" fill="${i === 2 ? '#1E3A5C' : C.sky100}"/>`;
      g += pill(580, y + 44, 130, 16, i === 2 ? C.powder : C.navy, i === 2 ? 1 : 0.75, 5);
    }
    g += `<path d="M1180 562 C 1320 562, 1300 300, 1420 300" ${stroke(0.6, 2)} stroke-dasharray="4 10"/><path d="M420 694 C 280 694, 300 960, 180 960" ${stroke(0.6, 2)} stroke-dasharray="4 10"/>`;
    return g;
  },
  'social-media-marketing': ({ w, h, N }) => {
    let g = '';
    const x0 = 430, y0 = 190, s = 236, gap = 16;
    for (let i = 0; i < 9; i++) {
      const cx = x0 + (i % 3) * (s + gap), cy = y0 + Math.floor(i / 3) * (s + gap);
      const fills = [C.navy, C.powder, '#fff', C.sky100, C.blue, C.sky300, '#fff', C.powder, C.navy];
      g += `<g filter="url(#shadowS)"><rect x="${cx}" y="${cy}" width="${s}" height="${s}" rx="18" fill="${fills[i]}"/></g>`;
      if (i === 2 || i === 6) g += `<path d="M${cx} ${cy + s - 60} Q ${cx + 70} ${cy + 90} ${cx + 130} ${cy + 150} T ${cx + s} ${cy + 110} V ${cy + s - 18} a18 18 0 0 1 -18 18 H ${cx + 18} a18 18 0 0 1 -18 -18 Z" fill="${C.sky300}" opacity=".7"/>`;
      if (i === 4) g += `<path d="M${cx + s / 2 - 22} ${cy + s / 2 - 34}l60 34l-60 34z" fill="#fff"/>`;
    }
    g += `<g filter="url(#shadow)"><rect x="1150" y="720" width="260" height="96" rx="48" fill="#fff"/></g><path d="M1200 752c-12-14-36-4-28 14l28 26 28-26c8-18-16-28-28-14z" fill="${C.blue}"/>` + pill(1256, 758, 110, 20, C.navy, 0.8, 6);
    return g;
  },
  'mobile-search': ({ w, h, N }) => {
    let g = '';
    g += `<g filter="url(#shadow)"><rect x="590" y="160" width="420" height="860" rx="60" fill="#fff"/></g>`;
    g += `<rect x="760" y="186" width="80" height="20" rx="10" fill="${C.navy}"/>`;
    g += `<rect x="626" y="250" width="348" height="64" rx="32" fill="${C.mist}" stroke="${C.powder}" stroke-width="2"/><circle cx="668" cy="282" r="12" fill="none" stroke="${C.blue}" stroke-width="4"/><path d="M677 291l10 10" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>` + pill(700, 274, 180, 16, C.navy, 0.6, 5);
    for (let i = 0; i < 4; i++) g += pill(626, 360 + i * 150, 220, 18, i === 0 ? C.blue : C.navy, 0.85, 5) + pill(626, 392 + i * 150, 340, 11, C.sky300, 0.7) + pill(626, 414 + i * 150, 290, 11, C.sky300, 0.5);
    // signal arcs
    for (let r = 120; r < 520; r += 70) g += `<path d="M${1060} ${600 - r} A ${r} ${r} 0 0 1 ${1060} ${600 + r}" ${stroke(0.5 - r / 1300, 2)}/>`;
    for (let r = 120; r < 520; r += 70) g += `<path d="M${540} ${600 - r} A ${r} ${r} 0 0 0 ${540} ${600 + r}" ${stroke(0.5 - r / 1300, 2)}/>`;
    return g;
  },
};

/* ------------------------------------------------------------ tide lines */
function tideLines({ w, h, seed }) {
  const N = makeNoise(seed);
  let defs = grainDefs() + `<linearGradient id="tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16345A"/><stop offset="1" stop-color="#0D1F35"/></linearGradient>`;
  let body = `<rect width="${w}" height="${h}" fill="url(#tb)"/>`;
  for (let k = 0; k < 70; k++) {
    const y0 = (k / 70) * h;
    let d = '';
    for (let x = -10; x <= w + 10; x += 12) {
      const y = y0 + N.fbm(x / 900 + k * 0.03, k * 0.05, 4) * 90 + Math.sin(x / 140 + k * 0.4) * 4;
      d += `${d ? 'L' : 'M'}${x} ${f1(y)}`;
    }
    body += `<path d="${d}" fill="none" stroke="#B7D3ED" stroke-opacity="${(0.1 + (k / 70) * 0.28).toFixed(3)}" stroke-width="1.2"/>`;
  }
  body += grainRect(w, h, 'grain', 0.06);
  return svgDoc(w, h, body, defs);
}

/* ------------------------------------------------------------ brand */
const fontR = opentype.parse(fs.readFileSync(path.join(ROOT, 'scripts/fonts/GoogleSans-Regular.ttf')).buffer);
const fontM = opentype.parse(fs.readFileSync(path.join(ROOT, 'scripts/fonts/GoogleSans-Medium.ttf')).buffer);
const textPath = (font, text, x, y, size, fill, ls = 0) => {
  let d = '', cx = x;
  for (const ch of text) { const p = font.getPath(ch, cx, y, size); d += p.toPathData(1); cx += font.getAdvanceWidth(ch, size) + ls * size; }
  return `<path d="${d}" fill="${fill}"/>`;
};
const markSvg = (x, y, s, bg = C.navy) =>
  `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.24}" fill="${bg}"/>` +
  pill(x + s * 0.2, y + s * 0.3, s * 0.6, s * 0.1, C.powder, 1) + pill(x + s * 0.2, y + s * 0.46, s * 0.44, s * 0.1, C.sky300, 1) + pill(x + s * 0.2, y + s * 0.62, s * 0.28, s * 0.1, '#4E8FD6', 1);

async function main() {
  console.log('Ridgelines');
  await toWebp(ridgeScene({ w: 1800, h: 2250, seed: 11, horizon: 0.84, glowX: 0.3, glowY: 0.3, topRatio: 0.5 }), 'hero-ridgeline.webp', 86);
  await toWebp(ridgeScene({ w: 2400, h: 1400, seed: 29, horizon: 0.82, glowX: 0.68, glowY: 0.22, layers: 6 }), 'ridgeline-wide.webp', 84);
  await toWebp(ridgeScene({ w: 1600, h: 2000, seed: 5, horizon: 0.86, glowX: 0.7, glowY: 0.3, layers: 5, warmth: 0 }), 'studio-ridgeline.webp', 84);

  console.log('Tide lines');
  await toWebp(tideLines({ w: 2400, h: 1300, seed: 8 }), 'tide-lines.webp', 80);

  console.log('Blueprint series');
  const series = ['web-design', 'app-developer', 'google-ads', 'seo', 'branding', 'ecommerce', 'software', 'ui-ux', 'phone-systems', 'website-hosting', 'social-media-marketing', 'mobile-search'];
  for (const [i, key] of series.entries()) await toWebp(plate({ seed: 40 + i * 7, tone: i, motif: motifs[key] }), `service-${key}.webp`, 84);

  console.log('Contours (vector)');
  writeContourSvg('contours-oahu', { w: 1200, h: 800, seed: 21, levels: 13, cols: 110, peaks: [{ x: 0.36, y: 0.48, rx: 0.28, ry: 0.32, h: 1.6 }, { x: 0.68, y: 0.52, rx: 0.2, ry: 0.36, h: 1.3 }] });
  writeContourSvg('contours-summit', { w: 1000, h: 1000, seed: 64, levels: 15, cols: 90, peaks: [{ x: 0.5, y: 0.5, rx: 0.34, ry: 0.3, h: 2 }] });
  writeContourSvg('contours-band', { w: 1600, h: 400, seed: 91, levels: 9, cols: 140, peaks: [{ x: 0.3, y: 0.7, rx: 0.3, ry: 0.8, h: 1.2 }, { x: 0.8, y: 0.4, rx: 0.22, ry: 0.9, h: 1 }] });

  console.log('Brand');
  const fav = svgDoc(64, 64, markSvg(0, 0, 64));
  fs.writeFileSync(path.join(OUT_PUBLIC, 'favicon.svg'), fav);
  await sharp(Buffer.from(svgDoc(180, 180, `<rect width="180" height="180" fill="${C.navy}"/>` + markSvg(20, 20, 140))), { density: 72 }).png().toFile(path.join(OUT_PUBLIC, 'apple-touch-icon.png'));
  await sharp(Buffer.from(fav), { density: 72 }).resize(32, 32).png().toFile(path.join(OUT_PUBLIC, 'favicon-32.png'));
  await sharp(Buffer.from(svgDoc(512, 512, markSvg(0, 0, 512))), { density: 72 }).png().toFile(path.join(OUT_PUBLIC, 'icon-512.png'));

  // Open Graph image: ridgeline + wordmark in Google Sans (converted to paths)
  const ogBg = await sharp(Buffer.from(ridgeScene({ w: 1200, h: 630, seed: 29, horizon: 0.84, glowX: 0.72, glowY: 0.2 }))).png().toBuffer();
  const ogFg = svgDoc(1200, 630,
    `<rect width="1200" height="630" fill="#F3F7FA" opacity=".35"/>` + markSvg(72, 70, 56) +
    textPath(fontM, 'The Hawaii Agency', 146, 108, 30, C.navy) +
    textPath(fontR, 'Hawaii’s premier', 70, 300, 84, C.navy, -0.02) +
    textPath(fontR, 'web design agency.', 70, 392, 84, C.navy, -0.02) +
    textPath(fontM, 'WEB DESIGN · MOBILE APPS · GOOGLE ADS · SEO · BRANDING · HOSTING', 74, 470, 15, C.deep, 0.12));
  await sharp(ogBg).composite([{ input: Buffer.from(ogFg) }]).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT_PUBLIC, 'og/default.jpg'));
  console.log('  ✓ og/default.jpg');
}
main().catch((e) => { console.error(e); process.exit(1); });
