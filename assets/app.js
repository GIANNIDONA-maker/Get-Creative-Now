/* =========================
   /assets/app.js
   - Injects PayPal links from /assets/links.js
   - Tools READY/LOCKED UI driven by LINKS.BOTS[]
   - /go/* redirect pages
   - Over-the-top FX: particles + cursor glow + 3D tilt (desktop only)
   ========================= */
(function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function safeText(el, txt) { if (el) el.textContent = txt; }
  function safeHref(el, href) { if (el) el.setAttribute("href", href); }
  function show(el) { if (el) el.classList.remove("is-hidden"); }
  function hide(el) { if (el) el.classList.add("is-hidden"); }

  function links() { return (window.LINKS || {}); }

  function preventClick(e) { e.preventDefault(); e.stopPropagation(); }

  function setDisabledLink(a, disabled) {
    if (!a) return;
    if (disabled) {
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("tabindex", "-1");
      a.addEventListener("click", preventClick, { passive: false });
    } else {
      a.removeAttribute("aria-disabled");
      a.removeAttribute("tabindex");
    }
  }

  function initCommon() {
    safeText($("#year"), String(new Date().getFullYear()));
    const L = links();

    // Bot/tool names
    const names = Array.isArray(L.BOT_NAMES) ? L.BOT_NAMES : [];
    $all("[data-bot-name]").forEach((el) => {
      const idx = parseInt(el.getAttribute("data-bot-name"), 10);
      if (!Number.isNaN(idx) && names[idx]) safeText(el, names[idx]);
    });

    // Join page pay links (injected via JS)
    const pay = $("#payLink");
    const donate = $("#donateLink");

    if (pay) {
      const url = (L.PAYPAL_SUPPORT_URL || "").trim();
      if (url) {
        safeHref(pay, url);
        pay.setAttribute("target", "_blank");
        pay.setAttribute("rel", "noopener noreferrer");
        show(pay);
      } else hide(pay);
    }

    if (donate) {
      const url = (L.PAYPAL_DONATE_URL || "").trim();
      if (url) {
        safeHref(donate, url);
        donate.setAttribute("target", "_blank");
        donate.setAttribute("rel", "noopener noreferrer");
        show(donate);
      } else hide(donate);
    }

    // Copy site url button
    const copyBtn = $("#copySiteUrl");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const url = (L.SITE_URL || location.origin).trim();
        try {
          await navigator.clipboard.writeText(url);
          safeText(copyBtn, "Copied");
          setTimeout(() => safeText(copyBtn, "Copy link"), 900);
        } catch (_) {
          safeText(copyBtn, "Copy failed");
          setTimeout(() => safeText(copyBtn, "Copy link"), 900);
        }
      });
    }

    // Tools: READY/LOCKED (driven by LINKS.BOTS)
    const bots = Array.isArray(L.BOTS) ? L.BOTS : [];
    $all("[data-bot-link]").forEach((a) => {
      const idx = parseInt(a.getAttribute("data-bot-link"), 10);
      if (Number.isNaN(idx)) return;

      const url = (bots[idx] || "").trim();
      const card = a.closest(".card");
      const pill = card ? card.querySelector("[data-bot-pill]") : null;
      const hint = card ? card.querySelector("[data-bot-hint]") : null;

      if (url) {
        setDisabledLink(a, false);
        a.classList.add("primary");
        safeText(a, "Open");
        if (pill) { pill.className = "pill ready"; safeText(pill, "READY"); }
        if (hint) safeText(hint, "Open the room.");
      } else {
        setDisabledLink(a, true);
        a.classList.remove("primary");
        safeText(a, "Locked");
        if (pill) { pill.className = "pill locked"; safeText(pill, "LOCKED"); }
        if (hint) safeText(hint, "Not set yet. Add a URL in links.js to activate.");
      }
    });
  }

  function resolveGoTarget(key) {
    const L = links();
    if (key === "SURFSHARK_URL") return (L.SURFSHARK_URL || "").trim();
    if (key === "MONICA_AFFILIATE_URL") return (L.MONICA_AFFILIATE_URL || "").trim();

    if (key && key.startsWith("BOT_")) {
      const idx = parseInt(key.replace("BOT_", ""), 10);
      const arr = Array.isArray(L.BOTS) ? L.BOTS : [];
      return (arr[idx] || "").trim();
    }
    return "";
  }

  function initGoRedirect() {
    const goKey = document.body.getAttribute("data-go");
    if (!goKey) return;

    const L = links();
    const target = resolveGoTarget(goKey);

    safeText($("#siteHost"), (L.SITE_URL || location.origin).replace(/^https?:\/\//, ""));
    safeText($("#goKey"), goKey);

    const status = $("#goStatus");
    const btn = $("#goBtn");
    const msg = $("#goMsg");

    function setButton(url) {
      if (!btn) return;
      btn.setAttribute("href", url || "#");
      if (url) {
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "noopener noreferrer");
        btn.classList.add("primary");
        safeText(btn, "Continue");
      } else {
        btn.removeAttribute("target");
        btn.removeAttribute("rel");
        btn.classList.remove("primary");
        safeText(btn, "Link not set");
      }
    }

    if (!target) {
      if (status) status.className = "notice bad";
      safeText(msg, "This link is not set yet. Paste the URL into /assets/links.js then redeploy.");
      setButton("");
      return;
    }

    if (status) status.className = "notice good";
    safeText(msg, "Redirecting…");
    setButton(target);

    setTimeout(() => {
      try { window.location.replace(target); }
      catch (_) { window.location.href = target; }
    }, 450);
  }

  // -------------------------
  // FX: particles + cursor glow + 3D tilt
  // -------------------------
  function fxAllowed() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return !reduce && !coarse;
  }

  function ensureFxLayers() {
    if (!fxAllowed()) return { canvas: null, ctx: null, glow: null };

    let canvas = document.getElementById("fx-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "fx-canvas";
      document.body.appendChild(canvas);
    }

    let glow = document.getElementById("cursor-glow");
    if (!glow) {
      glow = document.createElement("div");
      glow.id = "cursor-glow";
      document.body.appendChild(glow);
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    return { canvas, ctx, glow };
  }

  function initCursorGlow(glowEl) {
    if (!glowEl) return;
    let active = false;

    window.addEventListener("mousemove", (e) => {
      active = true;
      glowEl.style.left = e.clientX + "px";
      glowEl.style.top = e.clientY + "px";
      glowEl.style.opacity = "1";
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      glowEl.style.opacity = "0";
    }, { passive: true });

    // fade in on first move only
    setTimeout(() => { if (!active) glowEl.style.opacity = "0"; }, 600);
  }

  function initTilt() {
    if (!fxAllowed()) return;

    const cards = $all(".card");
    if (!cards.length) return;

    const maxTilt = 8; // degrees
    const maxLift = 6; // px

    cards.forEach((card) => {
      let raf = 0;

      function onMove(e) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;

        const rotY = (px - 0.5) * (maxTilt * 2);
        const rotX = (0.5 - py) * (maxTilt * 2);
        const lift = maxLift;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `translateY(${-lift}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
      }

      function onLeave() {
        cancelAnimationFrame(raf);
        card.style.transform = "";
      }

      card.addEventListener("mousemove", onMove, { passive: true });
      card.addEventListener("mouseleave", onLeave, { passive: true });
    });
  }

  function initParticles(canvas, ctx) {
    if (!canvas || !ctx || !fxAllowed()) return;

    let w = 0, h = 0, dpr = 1;
    const stars = [];
    const STAR_COUNT = 120; // keep light

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min, max) { return min + Math.random() * (max - min); }

    function seed() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          z: rand(0.25, 1.0),
          r: rand(0.7, 1.8),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.05, 0.07),
        });
      }
    }

    let mx = w * 0.5, my = h * 0.5;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    function tick() {
      ctx.clearRect(0, 0, w, h);

      // soft vignette
      const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.7);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        // drift
        s.x += s.vx * (1.5 / s.z);
        s.y += s.vy * (1.5 / s.z);

        // wrap
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20;
        if (s.y > h + 20) s.y = -20;

        // parallax towards cursor (subtle)
        const dx = (mx - w/2) * 0.0008 * (1.2 - s.z);
        const dy = (my - h/2) * 0.0008 * (1.2 - s.z);

        const x = s.x + dx * w;
        const y = s.y + dy * h;

        // color shift by depth
        const a = 0.45 * (1.1 - s.z);
        ctx.fillStyle = `rgba(0,229,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // occasional magenta spark
        if (s.z < 0.35 && (s.x + s.y) % 19 < 0.35) {
          ctx.fillStyle = `rgba(255,43,214,${a * 0.55})`;
          ctx.beginPath();
          ctx.arc(x + 6, y - 4, s.r * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(tick);
    }

    window.addEventListener("resize", () => { resize(); seed(); }, { passive: true });
    resize();
    seed();
    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCommon();
    initGoRedirect();

    // FX (desktop only, respects reduced motion)
    const fx = ensureFxLayers();
    initCursorGlow(fx.glow);
    initParticles(fx.canvas, fx.ctx);
    initTilt();
  });
})();
