// assets/app.js
// Small non-module helpers that can run on every page safely.
// Keeps behavior consistent across pages (404, go/* redirects, bots pages, etc.)

(() => {
  // Set current year if element exists
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Safety net: ensure all absolute links open in new tab
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  // Optional: smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });
})();
