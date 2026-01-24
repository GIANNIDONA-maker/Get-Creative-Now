/* =========================
   /assets/app.js
   - Wires labels/buttons
   - Handles /go/* redirects (no external URLs in markup)
   - Tools READY/LOCKED driven by LINKS.BOTS[]
   ========================= */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function safeText(el, txt) { if (el) el.textContent = String(txt ?? ""); }
  function safeHref(el, href) { if (el) el.setAttribute("href", href); }
  function show(el) { if (el) el.classList.remove("is-hidden"); }
  function hide(el) { if (el) el.classList.add("is-hidden"); }

  function links() { return (window.LINKS || {}); }

  function preventClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function setDisabledLink(a, disabled) {
    if (!a) return;
    if (disabled) {
      a.setAttribute("aria-disabled", "true");
      a.setAttribute("tabindex", "-1");
      // ensure we don't stack listeners on hot reloads
      a.addEventListener("click", preventClick, { passive: false });
    } else {
      a.removeAttribute("aria-disabled");
      a.removeAttribute("tabindex");
    }
  }

  function initCommon() {
    safeText($("#year"), new Date().getFullYear());

    const L = links();

    // Bot/tool names
    const names = Array.isArray(L.BOT_NAMES) ? L.BOT_NAMES : [];
    $all("[data-bot-name]").forEach((el) => {
      const idx = parseInt(el.getAttribute("data-bot-name") || "", 10);
      if (!Number.isNaN(idx) && names[idx]) safeText(el, names[idx]);
    });

    // Join page pay links (injected via JS)
    const pay = $("#payLink");
    const donate = $("#donateLink");

    if (pay) {
      const url = String(L.PAYPAL_SUPPORT_URL || "").trim();
      if (url) {
        safeHref(pay, url);
        pay.setAttribute("target", "_blank");
        pay.setAttribute("rel", "noopener noreferrer");
        show(pay);
      } else {
        hide(pay);
      }
    }

    if (donate) {
      const url = String(L.PAYPAL_DONATE_URL || "").trim();
      if (url) {
        safeHref(donate, url);
        donate.setAttribute("target", "_blank");
        donate.setAttribute("rel", "noopener noreferrer");
        show(donate);
      } else {
        hide(donate);
      }
    }

    // Copy site url button
    const copyBtn = $("#copySiteUrl");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const url = String(L.SITE_URL || location.origin).trim();
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

    // Tools: READY/LOCKED state (driven by LINKS.BOTS)
    const bots = Array.isArray(L.BOTS) ? L.BOTS : [];
    $all("[data-bot-link]").forEach((a) => {
      const idx = parseInt(a.getAttribute("data-bot-link") || "", 10);
      if (Number.isNaN(idx)) return;

      const url = String(bots[idx] || "").trim();
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

    if (key === "SURFSHARK_URL") return String(L.SURFSHARK_URL || "").trim();
    if (key === "MONICA_AFFILIATE_URL") return String(L.MONICA_AFFILIATE_URL || "").trim();

    if (key && key.indexOf("BOT_") === 0) {
      const idx = parseInt(key.replace("BOT_", ""), 10);
      const arr = Array.isArray(L.BOTS) ? L.BOTS : [];
      return String(arr[idx] || "").trim();
    }

    return "";
  }

  function initGoRedirect() {
    const goKey = document.body.getAttribute("data-go");
    if (!goKey) return;

    const L = links();
    const target = resolveGoTarget(goKey);

    safeText($("#siteHost"), String(L.SITE_URL || location.origin).replace(/^https?:\/\//, ""));
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

    // quick redirect with visible fallback
    setTimeout(() => {
      try { window.location.replace(target); }
      catch (_) { window.location.href = target; }
    }, 450);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCommon();
    initGoRedirect();
  });
})();
