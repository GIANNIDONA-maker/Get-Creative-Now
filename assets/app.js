// assets/app.js
(function () {
  function pick(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function bind(id, url) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (!url) return;
      window.location.href = url;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Expect links.js to define these:
    // window.SURFSHARK_URL
    // window.MONICA_AFFILIATE_URL
    // window.BOTS = [url1..url6]
    // window.DIGISTORE = [urls...]

    // Random product (Digistore pool)
    var randomProduct = pick(window.DIGISTORE || []);

    // Wire common buttons if they exist on the page
    bind("go-surfshark", window.SURFSHARK_URL);
    bind("go-monica", window.MONICA_AFFILIATE_URL);
    bind("go-random", randomProduct);

    // Bot routing (same code for bot-1 .. bot-6 pages)
    var botIndex = document.body.getAttribute("data-bot-index");
    if (botIndex && window.BOTS && window.BOTS[botIndex]) {
      bind("go-bot", window.BOTS[botIndex]);
    }

    // Any element with data-go="digistore" will route to random product
    document.querySelectorAll("[data-go='digistore']").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (!randomProduct) return;
        window.location.href = randomProduct;
      });
    });

    // Any element with data-go="url" and data-url="https://..."
    document.querySelectorAll("[data-go='url']").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var u = el.getAttribute("data-url");
        if (!u) return;
        window.location.href = u;
      });
    });
  });
})();
