# CapXRx — Marketing Splash Page

The public landing page for **CapXRx**, served at **https://www.capxrx.com**.

> _Capital budgeting, prescribed with precision._

This is a zero-build static site (plain HTML/CSS/JS). No framework, no bundler — it
deploys to **Cloudflare Pages** straight from GitHub with no build step.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The page (single splash page, anchored sections) |
| `styles.css` | All styling, animations, responsive rules |
| `script.js` | Scroll reveals, count-ups, gauge/chart animation, sticky nav |
| `_headers` | Cloudflare Pages security + cache headers |
| `_redirects` | Apex `capxrx.com` → `www.capxrx.com` 301 |
| `robots.txt`, `sitemap.xml` | SEO |

## Local preview

```bash
cd capxrx-web
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

See **[DEPLOY.md](DEPLOY.md)** for the full GitHub → Cloudflare Pages → DNS walkthrough.
Short version: push this folder to a GitHub repo, connect it as a Cloudflare Pages
project (build command: _none_, output dir: `/`), then attach `www.capxrx.com`.
