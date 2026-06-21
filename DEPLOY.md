# Deploying CapXRx splash → Cloudflare Pages → capxrx.com / www.capxrx.com

> ## ⚡ How to deploy now: `./deploy.sh`
>
> This site ships by **direct upload** to the `capxrx-web` Pages project — NOT
> by Git push. Just run `./deploy.sh` from this folder. Done.
>
> **Why not Git auto-deploy?** The `capxrx-web` Pages project's Git integration
> had been connected to the **wrong repo** (the CapBx *app*), so every app deploy
> published the app's unbuilt source onto `capxrx.com` and broke the marketing
> page (blank screen — browser trying to load `/src/main.jsx`). The Git
> integration is now **disconnected** on purpose; direct upload is the source of
> truth. If you ever reconnect Git, point it at **`CHASDepot/capxrx-web`** only.

This is a **zero-build static site**. Historically it was set up as: GitHub repo →
Cloudflare Pages Git auto-deploy. That's the setup the sections below describe, and
it's fine — *as long as the project is connected to this repo and not the app repo.*
Your `capxrx.com` zone is already on Cloudflare (it runs your email routing), so the
DNS records get created for you automatically when you attach the domain.

---

## 1. Push to GitHub

From this folder:

```bash
cd capxrx-web
git init
git add -A
git commit -m "CapXRx marketing splash page"
git branch -M main

# create the repo (pick ONE):
gh repo create capxrx-web --public --source=. --remote=origin --push
# …or, if you made the repo in the GitHub UI:
# git remote add origin https://github.com/<you>/capxrx-web.git
# git push -u origin main
```

---

## 2. Create the Cloudflare Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
2. Authorize GitHub and pick the **`capxrx-web`** repo.
3. Build settings — leave them empty / framework preset **None**:
   - **Build command:** _(blank)_
   - **Build output directory:** `/`
   - **Root directory:** `/`
4. **Save and Deploy.** You'll get a preview URL like
   `capxrx-web.pages.dev`. Confirm the page looks right there first.

Every future `git push` to `main` auto-deploys. Done — no build pipeline to babysit.

---

## 3. Attach the domain (this creates the DNS for you)

In the Pages project → **Custom domains** → **Set up a custom domain**:

1. Add **`www.capxrx.com`** → Cloudflare detects the zone and offers to create the
   record → click **Activate**. It adds (proxied):

   | Type | Name | Target | Proxy |
   |------|------|--------|-------|
   | CNAME | `www` | `capxrx-web.pages.dev` | Proxied (orange cloud) |

2. Add **`capxrx.com`** (the apex/root) the same way → **Activate**. Cloudflare uses
   CNAME flattening at the root:

   | Type | Name | Target | Proxy |
   |------|------|--------|-------|
   | CNAME | `capxrx.com` (`@`) | `capxrx-web.pages.dev` | Proxied (orange cloud) |

SSL certs are issued automatically (give it a few minutes). The `_redirects` file in
this repo then 301s the apex → `www.capxrx.com` so `www` is canonical.

> **If you'd rather make the apex canonical** (no `www`), just delete `_redirects`
> and instead add a Cloudflare **Redirect Rule**: `www.capxrx.com/* → capxrx.com/$1`.

---

## 4. ⚠️ Do NOT touch the email records

Your `capxrx.com` zone already has **MX**, **SPF (`v=spf1 … include … -all`)**,
**DKIM**, and **DMARC** records powering Postmark + Cloudflare Email Routing.

Adding the website only touches the `www` CNAME and the apex CNAME — those are
independent of mail. **Leave every `MX` / `TXT` mail record exactly as-is.** In
particular keep the **single** `v=spf1` record (one SPF record only — the cardinal
rule).

---

## 5. Manual DNS fallback (only if the zone were NOT on Cloudflare)

You shouldn't need this, but if `capxrx.com` ever moves off Cloudflare DNS:

| Type | Host | Value | Notes |
|------|------|-------|-------|
| CNAME | `www` | `capxrx-web.pages.dev` | the website |
| ALIAS/ANAME | `@` | `capxrx-web.pages.dev` | apex — only if your registrar supports ALIAS/flattening |

A plain registrar that can't do ALIAS at the apex can't point the root at Pages
cleanly — that's the main reason to keep the zone on Cloudflare.

---

## Checklist

- [ ] Repo pushed to GitHub
- [ ] Pages project deploys `*.pages.dev` and looks correct
- [ ] `www.capxrx.com` custom domain → **Active**
- [ ] `capxrx.com` apex custom domain → **Active**
- [ ] `https://capxrx.com` 301-redirects to `https://www.capxrx.com`
- [ ] Email (MX/SPF/DKIM/DMARC) untouched and still flowing
