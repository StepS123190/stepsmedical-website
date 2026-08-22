# Steps Medical — website (Priority 1 pages)

Nine SEO-ready, production pages for **www.stepsmedical.com.au**, built from the approved
copy in *Steps Medical Website Copy and Mockups* and the structure in the *SEO Action Plan*.
Every backlink you build should point at one of these live pages, not at GitHub, the
`pages.dev` preview, or an image host.

## What's in here

```
/                              Homepage
/medical-animation-services/   Medical Animation Services (service hub)
/work/                         Work / Portfolio
/biotech-animation/            Biotech Animation
/pharmaceutical-animation/     Pharmaceutical Animation
/medical-device-animation/     Medical Device Animation
/digital-health-animation/     Digital Health Animation
/about/                        About Steps Medical
/contact/                      Contact
/404.html                      Custom 404 page (noindex)
/sitemap.xml
/robots.txt
/_redirects                    Cloudflare Pages redirect rules
/assets/css/style.css          Shared design system
/assets/js/main.js             Mobile nav toggle (no other JS/tracking)
/assets/images/og-default.png  Default social-share image (1200x630)
/favicon.svg
```

Each page is a self-contained, dependency-free `index.html` (folder-style URLs, e.g.
`/biotech-animation/index.html` → `stepsmedical.com.au/biotech-animation/`), so it works
identically on Cloudflare Pages, GitHub Pages, or any static host.

## SEO already built in

- Unique `<title>` and meta description on every page (verified — no duplicates)
- Exactly one `<h1>` per page
- `rel="canonical"` on every page pointing at the final `https://www.stepsmedical.com.au/...` URL
- Open Graph + Twitter Card tags, with a shared 1200×630 share image
- JSON-LD: `ProfessionalService` (site-wide), `BreadcrumbList` (every page), `Service` schema
  on the four industry pages and the services hub, `Person` schema for Jason on `/about/`,
  `ContactPage` schema on `/contact/`
- `robots.txt` + `sitemap.xml` (all 9 URLs)
- No `noindex` anywhere except the 404 page (which should never rank)
- Mobile-first responsive CSS, no layout-shift image placeholders, semantic headings
- Internal links only point to pages that actually exist in this build — nothing 404s

## ⚠️ Before you launch: placeholder art

There's no real photography or footage yet, so every hero image and work-grid tile is a
generated abstract grayscale graphic (an SVG "lab rig" motif) — a stand-in, not final art.
Swap these for real stills/video from `images.stepsmedical.com.au` before or shortly after
launch:

- Replace the `<div class="art">...</div>` blocks with `<img>`/`<video>` tags
- Use descriptive, hyphenated filenames (e.g. `biotech-mechanism-of-action-animation.webp`)
  and real alt text, per the Action Plan's image checklist
- Serve WebP or AVIF, sized and compressed for web

## Deploying: Porkbun + Cloudflare Pages + GitHub

This matches the architecture you confirmed (Porkbun owns the domain, Cloudflare Pages
hosts the site, Cloudflare R2 hosts images, GitHub holds source).

1. **Push this folder to GitHub** as the root of your `stepsmedical` repo (or a `main`
   branch subfolder — set the Cloudflare Pages build output directory accordingly).
2. **Cloudflare Pages** → Create a project → connect the GitHub repo → framework preset
   "None" (this is plain HTML/CSS/JS, no build step needed) → deploy.
3. **Custom domain**: in the Pages project, add `www.stepsmedical.com.au` as the custom
   domain. In Porkbun, point the domain's DNS to Cloudflare (or use Cloudflare as your
   nameserver, per Cloudflare's setup wizard) and add the CNAME Cloudflare gives you.
4. **Canonical host**: the included `_redirects` file 301-redirects the bare apex
   (`stepsmedical.com.au`) and any `http://` request to `https://www.stepsmedical.com.au`.
   Add `stepsmedical.com.au` as a second custom domain on the same Pages project so those
   redirects actually fire (otherwise the apex won't resolve to Cloudflare at all).
5. **Stop the preview URL competing with you**: in the Pages project settings, restrict
   which branches get preview deployments, and add `Disallow: /` via a per-preview
   `robots.txt` rule or Cloudflare Access on `*.pages.dev` if your plan supports it — the
   goal is that `your-project.pages.dev` never gets indexed.
6. **Images**: point `images.stepsmedical.com.au` at your R2 bucket (Cloudflare's docs cover
   the custom-domain-for-R2 setup), then swap the placeholder `<div class="art">` blocks for
   `<img src="https://images.stepsmedical.com.au/...">`.

## After launch

- Verify `https://www.stepsmedical.com.au/sitemap.xml` loads, then submit it in
  **Google Search Console** and **Bing Webmaster Tools**.
- Connect **Google Analytics** and set up conversion tracking on the contact form
  submission, the `mailto:` link, and (once you have one) any phone click.
- Claim/update your **Google Business Profile** with the final URL.
- Wire the enquiry system of your choice into the `/contact/` form (it currently
  `preventDefault()`s — it's markup only, no backend).
- Spot-check `https://www.stepsmedical.com.au/` and one or two other pages in
  Search Console's URL Inspection tool to confirm they're indexable (not blocked,
  no accidental noindex, canonical resolves correctly).

## What's not built yet (Priority 2 & 3, per the Action Plan)

These 9 pages are the Action Plan's **Priority 1 — launch foundation**. A number of pages
already **link internally** to Priority 2/3 URLs in the approved copy (e.g. Mechanism of
Action, Clinical Workflow, Process, Case Studies, Pricing) — those links were intentionally
left out of this build so nothing 404s at launch. Next up, per the Action Plan:

**Priority 2:** Mechanism of Action Animation, Investor Presentation Videos, Clinical
Workflow Animation, Process, Pricing Guide (`/medical-animation-cost/`), Case Studies.

**Priority 3:** Insights hub + first articles, `/medical-animation-australia/`,
`/medical-animation-melbourne/`.

Say the word and I'll build the next batch in the same system — same header/footer,
design system and SEO scaffolding, so it drops straight into this repo.
