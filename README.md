# Indago

One-page recruiting site for casimir.cfd: plain HTML, CSS and a little JS, no build step and no CMS.

- `index.html` — the page
- `style.css` — styles, including the background grid from the original site
- `main.js` — scroll reveal, nav, progress bar, the production carousel and Instagram app links on phones
- `pathways.js` — the "Pathways to Financial Freedom" guide (captive vs. brokerage trail and calculator); its example figures live at the top of the file
- `production/` — production screenshots shown in the carousel (add a `<figure class="slide">` per image in `index.html`)
- `favicon.svg` — tab icon (black in light mode, white in dark mode)
- `brand/` — logo SVGs: `casimir-logo-white.svg` for dark backgrounds, `casimir-logo-black.svg` for light ones
- `design-reference/` — styling of the original site, kept as a guide for the next version (not deployed)

## Deployment

The repo is linked to the Vercel project `indago-marketing`. Pushing to `main` deploys to production; other branches get preview deployments.
