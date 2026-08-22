# Steps Medical — website (Priority 1, 2 & 3 pages + project pages)

Nineteen SEO-ready, production pages for **www.stepsmedical.com.au**, covering the full
build order in the *SEO Action Plan* (Priority 1 launch foundation, Priority 2 high-intent
expansion, Priority 3 authority building) plus the first individual project case study.
Every backlink you build should point at one of these live pages, not at GitHub, the
`pages.dev` preview, or an image host.

## What's in here

```
/                                    Homepage
/medical-animation-services/         Medical Animation Services (service hub)
/work/                               Work / Portfolio
/work/alcidion-miya-precision/       Project: Alcidion — Miya Precision explainer video
/biotech-animation/                  Biotech Animation
/pharmaceutical-animation/           Pharmaceutical Animation
/medical-device-animation/           Medical Device Animation
/digital-health-animation/           Digital Health Animation
/about/                              About Steps Medical
/contact/                            Contact
/mechanism-of-action-animation/      Mechanism of Action Animation
/investor-presentation-videos/       Investor Presentation Videos
/clinical-workflow-animation/        Clinical Workflow Animation
/process/                            Our Process
/medical-animation-cost/             Pricing Guide
/case-studies/                       Case Studies
/insights/                           Insights hub (20 topic cards)
/medical-animation-australia/        Australia location page
/medical-animation-melbourne/        Melbourne location page
/404.html                            Custom 404 page (noindex)
/sitemap.xml                         All 19 URLs
/robots.txt
/_redirects                          Cloudflare Pages redirect rules
/assets/css/style.css                Shared design system
/assets/js/main.js                   Mobile nav toggle (no other JS/tracking)
/assets/images/og-default.png        Default social-share image (1200x630)
/favicon.svg
```

Each page is a self-contained, dependency-free `index.html` (folder-style URLs, e.g.
`/biotech-animation/index.html` → `stepsmedical.com.au/biotech-animation/`), so it works
identically on Cloudflare Pages, GitHub Pages, or any static host.

## SEO already built in

- Unique `<title>` and meta description on every page (verified — no duplicates across all 18)
- Exactly one `<h1>` per page
- `rel="canonical"` on every page pointing at the final `https://www.stepsmedical.com.au/...` URL
- Open Graph + Twitter Card tags, with a shared 1200×630 share image
- JSON-LD: `ProfessionalService` (site-wide), `BreadcrumbList` (every page), `Service` schema
  on every service/industry/application page, `Person` schema for Jason on `/about/`,
  `ContactPage` schema on `/contact/`, `CollectionPage` on Work, Case Studies and Insights
- `robots.txt` + `sitemap.xml` (all 18 URLs)
- No `noindex` anywhere except the 404 page (which should never rank)
- Mobile-first responsive CSS, no layout-shift image placeholders, semantic headings
- Full internal-linking pass: every page in this build links to and from the other pages
  it's meant to per the Action Plan's internal-linking table (services ↔ process ↔ pricing,
  case studies ↔ industries, biotech ↔ investor videos, etc.) — nothing 404s
- The Insights hub carries all 20 article ideas from the Action Plan as topic cards, each
  linking straight through to the most relevant live page today (honest "coming soon" framing
  — no dead links to unwritten articles)

## ⚠️ Before you launch: placeholder art

There's no real photography or footage yet, so every hero image and work-grid tile is a
generated abstract grayscale graphic (an SVG "lab rig" motif) — a stand-in, not final art.
Swap these for real stills/video from `images.stepsmedical.com.au` before or shortly after
launch:

- Replace the `<div class="art">...</div>` blocks with `<img>`/`<video>` tags
- Use descriptive, hyphenated filenames (e.g. `biotech-mechanism-of-action-animation.webp`)
  and real alt text, per the Action Plan's image checklist
- Serve WebP or AVIF, sized and compressed for web

## Deploying: Porkbun + Cloudflare Workers + GitHub

Same architecture you confirmed (Porkbun owns the domain, Cloudflare hosts the site,
Cloudflare R2 hosts images, GitHub holds source) — one update: Cloudflare now steers new
static-site projects to **Workers (with static assets)** rather than classic **Pages**.
Pages still works and nothing here would need to change to use it instead, but Workers is
where Cloudflare is putting new features going forward, so this folder is set up for it:
`wrangler.jsonc`, `.assetsignore`, `package.json` and `index.js` at the root are the
Workers config. It's almost entirely static — `index.js` is a small script whose only job
is redirecting the bare apex (`stepsmedical.com.au`) and any `http://` request to
`https://www.stepsmedical.com.au`, then handing everything else straight to the static
files, same as before. That logic lives in `index.js` rather than the `_redirects` file
because Workers' `_redirects` only matches relative paths, not hostnames — it can't tell
`stepsmedical.com.au` and `www.stepsmedical.com.au` apart, so it can't do this
canonicalization itself the way it could on Pages. `_redirects` is still there for any
plain path-to-path redirect you want later (e.g. an old URL that moved).

**Option A — Git integration (recommended, closest to the original Pages plan):**

1. **Push this folder to GitHub** as the root of your `stepsmedical` repo. If your repo
   ends up with these files nested inside a subfolder (e.g. from a drag-and-drop upload),
   that's fine — set that subfolder as the **Root directory** / **Path** in step 2 rather
   than re-uploading.
2. In the Cloudflare dashboard → **Workers & Pages** → **Create** → connect **GitHub**,
   pick the repo. Leave **Build command** blank. Set **Project name** to match the `name`
   field in `wrangler.jsonc` (currently `steps-medical`) — Cloudflare requires these to be
   identical or the deploy fails. **Deploy command** stays as the default
   `npx wrangler deploy`.
3. **Domain**: point `stepsmedical.com.au`'s nameservers at Cloudflare in Porkbun (or
   follow Cloudflare's DNS setup wizard), then in the Worker's **Settings → Domains &
   Routes**, add both `www.stepsmedical.com.au` and `stepsmedical.com.au` as **Custom
   Domains** (both need to be attached for `index.js`'s apex→www redirect to fire —
   otherwise the apex won't resolve to Cloudflare at all).
4. Every push to the connected branch redeploys automatically.

**Option B — Wrangler CLI**, from inside this folder, once you're authenticated
(`npx wrangler login`):

```
npm install
npx wrangler deploy --dry-run   # validates wrangler.jsonc first
npx wrangler deploy
```

`wrangler.jsonc` already lists both `www.stepsmedical.com.au` and `stepsmedical.com.au`
as Custom Domain routes — the first real `wrangler deploy` will create them, provided the
domain is already an active zone in this Cloudflare account.

**Either way:**

- **Stop preview URLs competing with you**: in the Worker's settings, restrict which
  branches get preview builds, and keep the `workers.dev` subdomain disabled (Settings →
  Domains & Routes) so it never gets indexed instead of `www.stepsmedical.com.au`.
- **Images**: R2 isn't enabled on this account yet (enable it from the Cloudflare
  dashboard first). Once it is, create a bucket, point `images.stepsmedical.com.au` at it
  (Cloudflare's docs cover the custom-domain-for-R2 setup), then swap the placeholder
  `<div class="art">` blocks for `<img src="https://images.stepsmedical.com.au/...">`.

## After launch

- Verify `https://www.stepsmedical.com.au/sitemap.xml` loads, then submit it in
  **Google Search Console** and **Bing Webmaster Tools**.
- Connect **Google Analytics** and set up conversion tracking on the contact form
  submission, the `mailto:` link, and (once you have one) any phone click.
- Claim/update your **Google Business Profile** with the final URL.
- Wire the enquiry system of your choice into the `/contact/` form (it currently
  `preventDefault()`s — it's markup only, no backend).
- Spot-check `https://www.stepsmedical.com.au/` and a few other pages in Search
  Console's URL Inspection tool to confirm they're indexable (not blocked, no
  accidental noindex, canonical resolves correctly).

## Individual project pages

Nested under `/work/`, these are full case-study pages for specific client projects —
more detailed than the summary blurbs on `/work/` and `/case-studies/`, which link through
to them. First one built:

1. **Alcidion — Miya Precision** (`/work/alcidion-miya-precision/`) — done.
2. through 8. — 7 more to come; send the client, platform/product name and a link to their
   site for each and I'll research and build them the same way.

### Template: video hero + image grid

Every project page follows a fixed layout: the section right under the page header is
always a video (not the abstract placeholder art the rest of the site uses), and the
section right below that is always a grid of images.

- **Video block** (`hero_video()` in `build.py`): a poster frame with a centred play
  button, linking out (new tab) to the hosted cut. Alcidion currently links to
  `https://framerate.tv/watch/87b00c4a-2803-45ec-8416-4784306b9f5c`. This is a
  click-through, not an embedded `<iframe>` player — FrameRate's watch pages are a
  client-rendered app with no confirmed public embed/oEmbed markup, so a real iframe
  risks silently breaking (blocked by `X-Frame-Options`, or requiring the video to be
  set to public). Two ways to upgrade this later:
  - Ask FrameRate/Jason for the official embed `<iframe>` code for a video once it's
    published (Share → Embed, if that's on your plan), and swap it in — happy to wire it
    in the moment you have that snippet.
  - Better for SEO and control: once the final export exists, host the MP4 on
    `images.stepsmedical.com.au` (R2) and swap in a native `<video>` tag with a real
    poster frame. Self-hosted video is also what lets you add valid `VideoObject`
    schema (needs a real thumbnail + upload date, which a third-party embed can't
    reliably give you).
- **Image grid** (`image_grid()` in `build.py`): a responsive grid (4 tiles → 3 → 2 on
  mobile) of the abstract placeholder art, standing in for real stills pulled from the
  project. Swap these `<div class="art">` blocks for `<img>` tags the same way as the
  rest of the placeholder art (see "Before you launch" above).

## What's left, per the Action Plan

All three build-order priorities (18 pages) plus the first project page are now built.
What's genuinely still open:

- **The remaining 7 project pages** under `/work/` (see above).
- **Real photography/video** to replace the placeholder art (see above) — the single
  biggest thing standing between this and a real launch.
- **The first full Insights articles.** The hub is live and links to 20 planned topics;
  writing the articles themselves is the Action Plan's Weeks 11–12 step. Say the word and
  I'll draft them into this same system.
- **City pages beyond Melbourne** (Sydney, Brisbane, Perth, Adelaide) — the Action Plan
  is explicit that these should wait until there's genuine local proof, to avoid thin
  doorway pages. Don't build these until you have real examples/clients in that city.
- **Client testimonials and confirmed permissions** — several sections (client logos,
  case-study specifics) are written from the material you supplied; double-check usage
  permission before launch, per the Action Plan's guidance.
