# Get Creative Now (Static)

Static site designed for Vercel (or any static host) with:

- **Single source of truth** for ALL outgoing URLs: `/assets/links.js`
- Tools route through internal **`/go/*` redirect pages**
- Tools show **READY / LOCKED** based on whether a URL is set in `LINKS.BOTS[]`
- **Join** page is the only pay page (PayPal links are **injected via JS**)
- **No third-party external URLs in HTML markup**
- Clean URLs with **trailing slashes** (matches `vercel.json`)

## File tree

/
- `vercel.json`
- `README.md`
- `index.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `/assets`
  - `app.css`
  - `app.js`
  - `links.js`
  - `favicon.svg`
  - `site.webmanifest`
- `/tools`
  - `index.html`
- `/join`
  - `index.html`
  - `index.css`
- `/go`
  - `/surfshark/index.html`
  - `/monica-affiliate/index.html`
  - `/bot-1/index.html`
  - `/bot-2/index.html`
  - `/bot-3/index.html`
  - `/bot-4/index.html`
  - `/bot-5/index.html`
  - `/bot-6/index.html`

## Update links (the only file you edit)

Edit: **`/assets/links.js`**

- `PAYPAL_SUPPORT_URL`
- `PAYPAL_DONATE_URL` (optional)
- `SURFSHARK_URL` (optional)
- `MONICA_AFFILIATE_URL` (optional)
- `BOTS[]` (Tool/Bot URLs)

### BOTS[] mapping

- `BOTS[0]` → `/go/bot-1/`
- `BOTS[1]` → `/go/bot-2/`
- `BOTS[2]` → `/go/bot-3/`
- `BOTS[3]` → `/go/bot-4/`
- `BOTS[4]` → `/go/bot-5/`
- `BOTS[5]` → `/go/bot-6/`

If `BOTS[i]` is empty, that tool shows **LOCKED** and the button is disabled.

## How routing works

- Tools page buttons always point to internal routes (`/go/bot-*/`).
- Each `/go/*` page reads a key from `<body data-go="...">`,
  resolves it to a URL from `window.LINKS` (in `links.js`),
  then redirects with a visible fallback “Continue” button.

## Deploy (Vercel)

1. Push this repo to GitHub
2. Import into Vercel
3. Deploy

No build step required.

## Security / headers

`vercel.json` sets:
- CSP restricting scripts/styles to `'self'`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- aggressive immutable caching for `/assets/*`

If you add third-party scripts later, you must update the CSP.

## Notes

- If a redirect key has no URL set, `/go/*` shows an error message and does not redirect.
- If PayPal links are not set, the Join buttons remain hidden.
