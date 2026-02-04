/* seeded-svgs.js
   Deterministic SVG decorations based on URL + slide identity.
   No dependencies. No build required.
*/
(function () {
  "use strict";

  const DEFAULTS = {
    targetSelector: ".slide",
    position: "afterbegin",
    seedMode: "hash+slide",
    inset: "1em",
    density: 24,
    layers: 3,
    colors: ["#0B3D91", "#00A3A3", "#FFB000", "#E84855", "#5E2BFF"],
    background: "transparent",
    opacityRange: [0.08, 0.22],
    strokeWidthRange: [1, 3],
    shapes: { circles: true, triangles: true, lines: true, confetti: true, blobs: true },
    avoidCenter: true,
    centerAvoidRadius: 0.22,
    zIndex: 0,
    themeByHash: {}
  };

  function cfg() {
    const user = (window.SeededSVG && typeof window.SeededSVG === "object") ? window.SeededSVG : {};
    return mergeDeep(DEFAULTS, user);
  }

  function mergeDeep(base, override) {
    const out = Array.isArray(base) ? base.slice() : { ...base };
    for (const k in override) {
      const bv = out[k];
      const ov = override[k];
      if (bv && typeof bv === "object" && !Array.isArray(bv) && ov && typeof ov === "object" && !Array.isArray(ov)) {
        out[k] = mergeDeep(bv, ov);
      } else {
        out[k] = ov;
      }
    }
    return out;
  }

  // xfnv1a: Hash string to 32-bit int
  function xfnv1a(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // mulberry32: Seeded PRNG
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function parseInsetPx(inset, el) {
    if (typeof inset === "number") return inset;
    const s = String(inset).trim();
    if (s.endsWith("px")) return parseFloat(s);
    if (s.endsWith("em")) {
      const em = parseFloat(s);
      const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
      return em * fs;
    }
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 16;
  }

  function makeSeedStr(mode, slideEl) {
    const loc = window.location;
    const pathname = loc.pathname || "";
    const search = loc.search || "";
    const hash = loc.hash || "#";
    const href = loc.href || "";
    const slideId = slideEl && slideEl.id ? slideEl.id : "";

    if (mode === "hash") return hash;
    if (mode === "path") return pathname + search;
    if (mode === "full") return href;
    if (mode === "hash+path") return (pathname + search) + hash;
    return hash + "|" + slideId + "|" + pathname;
  }

  function ensureBaseStyles() {
    if (document.getElementById("seeded-svg-style")) return;
    const style = document.createElement("style");
    style.id = "seeded-svg-style";
    style.textContent = `
      .seeded-svg-container { position: relative; }
      .seeded-svg-overlay {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  function shouldAvoidCenter(cfgObj, x, y, w, h) {
    if (!cfgObj.avoidCenter) return false;
    const r = cfgObj.centerAvoidRadius ?? 0.22;
    const cx = w / 2, cy = h / 2;
    const minDim = Math.min(w, h);
    const dx = x - cx, dy = y - cy;
    return (dx * dx + dy * dy) < (r * minDim) * (r * minDim);
  }

  function genCircle(rng, cfgObj, w, h, placedShapes) {
    const r = lerp(10, Math.min(w, h) * 0.12, rng());
    let x, y;
    let attempts = 0;
    do {
      const rx = rng(), ry = rng();
      const xBias = 1 - (1 - rx) * (1 - rx);
      const yBias = 1 - (1 - ry) * (1 - ry);
      x = xBias * w;
      y = yBias * h;
      attempts++;
    } while (attempts < 20 && (shouldAvoidCenter(cfgObj, x, y, w, h) || overlapsAny(x - r, y - r, r * 2, r * 2, placedShapes)));
    
    if (attempts >= 20) return null;
    
    placedShapes.push({ x: x - r, y: y - r, w: r * 2, h: r * 2 });
    const fill = pick(rng, cfgObj.colors);
    const opacity = lerp(cfgObj.opacityRange[0], cfgObj.opacityRange[1], rng());
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" fill-opacity="${opacity.toFixed(3)}" />`;
  }

  function genLine(rng, cfgObj, w, h, placedShapes) {
    let x1, y1;
    let attempts = 0;
    do {
      const rx = rng(), ry = rng();
      const xBias = 1 - (1 - rx) * (1 - rx);
      const yBias = 1 - (1 - ry) * (1 - ry);
      x1 = xBias * w;
      y1 = yBias * h;
      attempts++;
    } while (attempts < 20 && shouldAvoidCenter(cfgObj, x1, y1, w, h));
    
    const angle = rng() * Math.PI * 2;
    const len = lerp(Math.min(w, h) * 0.15, Math.min(w, h) * 0.65, rng());
    const x2 = x1 + Math.cos(angle) * len;
    const y2 = y1 + Math.sin(angle) * len;
    
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    const sw = lerp(cfgObj.strokeWidthRange[0], cfgObj.strokeWidthRange[1], rng());
    
    if (overlapsAny(minX - sw, minY - sw, maxX - minX + sw * 2, maxY - minY + sw * 2, placedShapes)) {
      return null;
    }
    
    placedShapes.push({ x: minX - sw, y: minY - sw, w: maxX - minX + sw * 2, h: maxY - minY + sw * 2 });
    const stroke = pick(rng, cfgObj.colors);
    const opacity = lerp(cfgObj.opacityRange[0], cfgObj.opacityRange[1], rng());
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${sw.toFixed(2)}" stroke-opacity="${opacity.toFixed(3)}" stroke-linecap="round" />`;
  }

  function genTriangle(rng, cfgObj, w, h, placedShapes) {
    let x, y;
    let attempts = 0;
    do {
      const rx = rng(), ry = rng();
      const xBias = 1 - (1 - rx) * (1 - rx);
      const yBias = 1 - (1 - ry) * (1 - ry);
      x = xBias * w;
      y = yBias * h;
      attempts++;
    } while (attempts < 20 && shouldAvoidCenter(cfgObj, x, y, w, h));
    
    const size = lerp(16, Math.min(w, h) * 0.18, rng());
    const rot = rng() * Math.PI * 2;
    const p1 = [x + Math.cos(rot) * size, y + Math.sin(rot) * size];
    const p2 = [x + Math.cos(rot + 2.1) * size, y + Math.sin(rot + 2.1) * size];
    const p3 = [x + Math.cos(rot + 4.2) * size, y + Math.sin(rot + 4.2) * size];
    
    const minX = Math.min(p1[0], p2[0], p3[0]);
    const minY = Math.min(p1[1], p2[1], p3[1]);
    const maxX = Math.max(p1[0], p2[0], p3[0]);
    const maxY = Math.max(p1[1], p2[1], p3[1]);
    
    if (overlapsAny(minX, minY, maxX - minX, maxY - minY, placedShapes)) {
      return null;
    }
    
    placedShapes.push({ x: minX, y: minY, w: maxX - minX, h: maxY - minY });
    const fill = pick(rng, cfgObj.colors);
    const opacity = lerp(cfgObj.opacityRange[0], cfgObj.opacityRange[1], rng());
    return `<polygon points="${p1.map(n => n.toFixed(1)).join(",")} ${p2.map(n => n.toFixed(1)).join(",")} ${p3.map(n => n.toFixed(1)).join(",")}" fill="${fill}" fill-opacity="${opacity.toFixed(3)}" />`;
  }

  function genConfetti(rng, cfgObj, w, h, placedShapes) {
    const count = Math.floor(lerp(6, 18, rng()));
    let out = "";
    for (let i = 0; i < count; i++) {
      let x, y;
      let attempts = 0;
      do {
        const rx = rng(), ry = rng();
        const xBias = 1 - (1 - rx) * (1 - rx);
        const yBias = 1 - (1 - ry) * (1 - ry);
        x = xBias * w;
        y = yBias * h;
        attempts++;
      } while (attempts < 10 && shouldAvoidCenter(cfgObj, x, y, w, h));
      
      const ww = lerp(6, 18, rng());
      const hh = lerp(3, 10, rng());
      
      if (overlapsAny(x - ww / 2, y - hh / 2, ww, hh, placedShapes)) {
        continue;
      }
      
      placedShapes.push({ x: x - ww / 2, y: y - hh / 2, w: ww, h: hh });
      const rot = lerp(-35, 35, rng());
      const fill = pick(rng, cfgObj.colors);
      const opacity = lerp(cfgObj.opacityRange[0], cfgObj.opacityRange[1], rng());
      out += `<rect x="${(x - ww / 2).toFixed(1)}" y="${(y - hh / 2).toFixed(1)}" width="${ww.toFixed(1)}" height="${hh.toFixed(1)}" fill="${fill}" fill-opacity="${opacity.toFixed(3)}" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" rx="${(hh / 2).toFixed(1)}" />`;
    }
    return out;
  }

  function genBlob(rng, cfgObj, w, h, placedShapes) {
    let cx, cy;
    let attempts = 0;
    do {
      const rx = rng(), ry = rng();
      const xBias = 1 - (1 - rx) * (1 - rx);
      const yBias = 1 - (1 - ry) * (1 - ry);
      cx = xBias * w;
      cy = yBias * h;
      attempts++;
    } while (attempts < 20 && shouldAvoidCenter(cfgObj, cx, cy, w, h));
    
    const base = lerp(Math.min(w, h) * 0.08, Math.min(w, h) * 0.22, rng());
    const blobSize = base * 1.35 * 2;
    
    if (overlapsAny(cx - blobSize / 2, cy - blobSize / 2, blobSize, blobSize, placedShapes)) {
      return null;
    }
    
    placedShapes.push({ x: cx - blobSize / 2, y: cy - blobSize / 2, w: blobSize, h: blobSize });
    
    const points = 7 + Math.floor(rng() * 5);
    let d = "";
    for (let i = 0; i < points; i++) {
      const a = (i / points) * Math.PI * 2;
      const jitter = lerp(0.65, 1.35, rng());
      const r = base * jitter;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      d += (i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    d += " Z";
    const fill = pick(rng, cfgObj.colors);
    const opacity = lerp(cfgObj.opacityRange[0], cfgObj.opacityRange[1], rng());
    return `<path d="${d}" fill="${fill}" fill-opacity="${opacity.toFixed(3)}" />`;
  }

  function overlapsAny(x, y, w, h, placedShapes) {
    for (const shape of placedShapes) {
      if (!(x + w < shape.x || x > shape.x + shape.w || y + h < shape.y || y > shape.y + shape.h)) {
        return true;
      }
    }
    return false;
  }

  function buildContent(rng, cfgObj, w, h) {
    const gens = [];
    if (cfgObj.shapes?.circles) gens.push(genCircle);
    if (cfgObj.shapes?.triangles) gens.push(genTriangle);
    if (cfgObj.shapes?.lines) gens.push(genLine);
    if (cfgObj.shapes?.confetti) gens.push(genConfetti);
    if (cfgObj.shapes?.blobs) gens.push(genBlob);
    if (gens.length === 0) return "";

    const density = clamp(cfgObj.density ?? 24, 0, 400);
    const layers = clamp(cfgObj.layers ?? 3, 1, 10);
    const placedShapes = [];

    let content = "";
    for (let layer = 0; layer < layers; layer++) {
      const layerCount = Math.floor(density / layers) + (layer === 0 ? density % layers : 0);
      for (let i = 0; i < layerCount; i++) {
        const gen = pick(rng, gens);
        const shape = gen(rng, cfgObj, w, h, placedShapes);
        if (shape) content += shape;
      }
    }
    return content;
  }

  function removeOldOverlay(el) {
    const old = el.querySelector(":scope > .seeded-svg-overlay");
    if (old) old.remove();
  }

  function renderOne(el, baseCfg) {
    if (!el) return;
    el.classList.add("seeded-svg-container");

    const hash = window.location.hash || "#";
    const themed = baseCfg.themeByHash?.[hash] ? mergeDeep(baseCfg, baseCfg.themeByHash[hash]) : baseCfg;

    removeOldOverlay(el);

    const rect = el.getBoundingClientRect();
    const w = Math.max(10, Math.floor(rect.width));
    const h = Math.max(10, Math.floor(rect.height));

    const insetPx = parseInsetPx(themed.inset ?? "1em", el);
    const innerW = Math.max(10, w - insetPx * 2);
    const innerH = Math.max(10, h - insetPx * 2);

    const seedStr = makeSeedStr(themed.seedMode, el);
    const seed = xfnv1a(seedStr);
    const rng = mulberry32(seed);

    const bg = themed.background && themed.background !== "transparent"
      ? `<rect x="0" y="0" width="${w}" height="${h}" fill="${themed.background}" />`
      : "";

    const content = buildContent(rng, themed, innerW, innerH);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "seeded-svg-overlay");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.style.zIndex = String(themed.zIndex ?? 0);

    svg.innerHTML = `
      ${bg}
      <g transform="translate(${insetPx.toFixed(1)} ${insetPx.toFixed(1)})">
        ${content}
      </g>
    `;

    if (themed.position === "beforeend") {
      el.appendChild(svg);
    } else {
      el.insertBefore(svg, el.firstChild);
    }
  }

  function renderAll() {
    const baseCfg = cfg();
    const els = document.querySelectorAll(baseCfg.targetSelector);
    els.forEach(el => renderOne(el, baseCfg));
  }

  function setup() {
    ensureBaseStyles();
    renderAll();

    window.addEventListener("hashchange", renderAll, { passive: true });

    const baseCfg = cfg();
    const els = document.querySelectorAll(baseCfg.targetSelector);
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => renderAll());
      els.forEach(el => ro.observe(el));
    } else {
      window.addEventListener("resize", renderAll, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
