// Central redirect engine.
// All /go/* pages load this and forward using links.js.

(function () {
  function getSlug() {
    // /go/bot-1/  -> bot-1
    // /go/surfshark/ -> surfshark
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts[1] || "";
  }

  function resolve(slug) {
    const L = window.LINKS || {};

    switch (slug) {
      case "surfshark":
        return L.SURFSHARK_URL;

      case "bot-1":
        return L.BOT_1_URL;
      case "bot-2":
        return L.BOT_2_URL;
      case "bot-3":
        return L.BOT_3_URL;
      case "bot-4":
        return L.BOT_4_URL;
      case "bot-5":
        return L.BOT_5_URL;
      case "bot-6":
        return L.BOT_6_URL;

      default:
        return null;
    }
  }

  const slug = getSlug();
  const target = resolve(slug);

  if (target && target.startsWith("http")) {
    window.location.replace(target);
  } else {
    document.body.innerHTML =
      "<div style='font-family:system-ui;padding:24px;color:#eef2ff;background:#07080b'>" +
      "<b>Link not configured.</b><br><br>" +
      "Set this URL in <code>assets/links.js</code> for: <code>" +
      slug +
      "</code></div>";
  }
})();

