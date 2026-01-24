/* =========================
   /assets/links.js
   Single Source of Truth for ALL outgoing URLs.
   ========================= */
(function () {
  "use strict";

  window.LINKS = {
    // Used for robots/sitemap copy button fallback
    SITE_URL: "https://get-creative-now.vercel.app",

    // PAY FLOW (only /join/ uses these via JS injection)
    PAYPAL_SUPPORT_URL: "https://www.paypal.com/ncp/payment/DCFGC5QQVL6MQ",
    PAYPAL_DONATE_URL: "",

    // Affiliate (optional)
    SURFSHARK_URL:
      "https://links.surfsharkbiz.com/s/c/TkERedHK01U0KECqQqBFwmTw9UyST5DDwdeIWQnaqnCeuohjTG3DRe9EvPSS8BRBVo_smaXkzFFJzXMA7-aifVGaiZ1l-kes_V3ca5PHCrptcNYZpbPy8gjbvKKsr0u8s16v7W8w6ulj1Tz7fUR7ol0W93hG_jOgDSv-2dLX8ZrSAAyPlHK1ACxD1ZdF1SOJI5dCa0MaHm9il-G3f4r0M8PR3jyD7LpG8eVN-9LNz7-MFouNjJSn-6S3X_xNp225okgXdK_OQf70vyEZD4JWw48OKPPKoczdM1VML88EQ84ZT3zT3PdejYkGwGen6pyq__VcTQ5gmhkpfEF-CNhxkgf1u9jM4krZK3JKCBuLPLdDHOZ_YcUzoulYt3CsfB91sKmIFr7N1_1GVNeJzIw5Zkj4B7qTpWrjx5Waqvdu-Ul0qvI4W489pc3HnpmIuJ91KFIVvLdG9bA/CUQTnj1cbbGFNJWEUL12VhettBnS0DkX/17",
    MONICA_AFFILIATE_URL: "",

    // Approved tool names (locked list)
    BOT_NAMES: [
      "The Healers AI",
      "Gianni Dona",
      "Small Business Systems Guide",
      "Bad Energy Repeller",
      "Insight Engine",
      "Tool 06 (Coming soon)"
    ],

    // Tools/Bots: paste URLs here (only if/when you want them live)
    // Index mapping:
    // 0 => /go/bot-1/
    // 1 => /go/bot-2/
    // 2 => /go/bot-3/
    // 3 => /go/bot-4/
    // 4 => /go/bot-5/
    // 5 => /go/bot-6/
    BOTS: ["", "", "", "", "", ""]
  };
})();
