# Indago

Static landing page for casimir.cfd: plain HTML and CSS, no build step and no CMS.

- `index.html` — the page
- `style.css` — styles, including the background grid from the original site
- `favicon.svg` — tab icon (black in light mode, white in dark mode)
- `brand/` — logo SVGs: `casimir-logo-white.svg` for dark backgrounds, `casimir-logo-black.svg` for light ones
- `design-reference/` — styling of the original site, kept as a guide for the next version (not deployed)

## Deployment

The repo is linked to the Vercel project `indago-marketing`. Pushing to `main` deploys to production; other branches get preview deployments.
