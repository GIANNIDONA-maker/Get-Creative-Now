// assets/link.js
// Link list renderer + copy-to-clipboard toast + global FX hooks.
// Used by index.html (type="module") and can be reused by other pages.

export function renderLinkList({ mountId, list }) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  mount.innerHTML = "";
  list.forEach((item) => mount.appendChild(linkRow(item)));
}

function getToastEl() {
  return document.getElementById("toast");
}

let toastTimer = null;

export function showToast(message = "Copied ✅") {
  const toast = getToastEl();
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1400);
}

export async function copyToClipboard(text) {
  const value = String(text ?? "");
  if (!value) {
    showToast("Nothing to copy");
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    showToast("Copied ✅");
    return true;
  } catch {
    // fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Copied ✅");
      return true;
    } catch {
      showToast("Copy blocked");
      return false;
    }
  }
}

function isHttpUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

function linkRow({ label, url }) {
  const row = document.createElement("div");
  row.className = "linkRow";

  const left = document.createElement("div");

  const l = document.createElement("p");
  l.className = "label";
  l.textContent = label || "Link";

  const u = document.createElement("p");
  u.className = "url";
  u.textContent = url || "";

  left.appendChild(l);
  left.appendChild(u);

  const right = document.createElement("div");
  right.className = "miniBtns";

  const open = document.createElement("a");
  open.textContent = "Open ↗";
  open.href = isHttpUrl(url) ? url : "#";
  open.target = "_blank";
  open.rel = "noopener noreferrer";

  open.addEventListener("click", (e) => {
    if (!isHttpUrl(url)) {
      e.preventDefault();
      showToast("Invalid link");
    }
  });

  const cp = document.createElement("button");
  cp.type = "button";
  cp.textContent = "Copy";
  cp.addEventListener("click", () => copyToClipboard(url));

  right.appendChild(open);
  right.appendChild(cp);

  row.appendChild(left);
  row.appendChild(right);

  return row;
}

/**
 * setupGlobalFX()
 * - Makes all absolute links open in new tab
 * - Initializes subtle tilt on .tilt cards (safe on mobile)
 * - Starts optional background particles if #fxCanvas exists
 */
export function setupGlobalFX() {
  // Force all external links to open in new tab (safety net)
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  setupTilt();
  setupParticles();
}

/* ---------------- Tilt ---------------- */

function setupTilt() {
  const cards = Array.from(document.querySelectorAll(".tilt"));
  if (!cards.length) return;

  const finePointer = window.matchMedia?.("(pointer:fine)")?.matches ?? false;
  if (!finePointer) return; // avoid weirdness on touch devices

  const MAX = 6; // degrees
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  cards.forEach((card) => {
    let raf = null;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0..1
      const py = (e.clientY - rect.top) / rect.height; // 0..1

      const ry = clamp((px - 0.5) * (MAX * 2), -MAX, MAX);
      const rx = clamp((0.5 - py) * (MAX * 2), -MAX, MAX);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.setProperty("--rx", `0deg`);
      card.style.setProperty("--ry", `0deg`);
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
  });
}

/* ---------------- Background Particles (Lightweight) ---------------- */

function setupParticles() {
  const canvas = document.getElementById("fxCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (prefersReduced) return;

  const dots = [];
  const DOTS = 60;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // reset dots
    dots.length = 0;
    for (let i = 0; i < DOTS; i++) {
      dots.push(spawn());
    }
  }

  function spawn() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.8 + Math.random() * 1.8,
      vx: -0.12 + Math.random() * 0.24,
      vy: -0.10 + Math.random() * 0.20,
      a: 0.18 + Math.random() * 0.20,
      hue: 190 + Math.random() * 90, // cyan -> purple
    };
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // dots
    for (const p of dots) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        Object.assign(p, spawn());
        p.x = Math.random() * w;
        p.y = Math.random() * h;
      }

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // subtle connections (limit to keep fast)
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(step);
}
