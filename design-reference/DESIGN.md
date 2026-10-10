# Design reference: original Indago site

Reference for the next version of the site. It describes the styling of the
original indago.fyi (home, services and work with us pages) so a rebuild can
match its look and feel. Nothing in this folder is deployed (see `.vercelignore`).

The full original stylesheets are kept alongside this file as `original-*.css`.

## Overall feel

- Monochrome, dark, editorial. Pure black/near-black backgrounds, white type,
  everything else is white at reduced opacity. No brand color.
- Generous spacing, big confident display type, small tracked-out uppercase labels.
- Glassy cards: 1px faint white border, 3% white fill, light backdrop blur.
- Motion is slow and soft: things ease up from blur, the background grid drifts,
  a film grain flickers over everything.

## Color tokens

```css
--black: #000000;
--white: #ffffff;
--white-soft: rgba(255, 255, 255, 0.72);   /* body copy */
--white-faint: rgba(255, 255, 255, 0.45);  /* labels, meta */
```

Borders: `rgba(255,255,255,0.08)` (section dividers), `0.10–0.18` (cards, pills),
`0.25` (ghost buttons, inputs). Card fill: `rgba(255,255,255,0.03)`, hover `0.045`.

## Type

- Display: **Yapari ExtraBold** (trial license; needs a full license before reuse),
  weight 800, fallback Inter. Headlines up to `clamp(44px, 7.6vw, 168px)`, line-height ~1.05.
- Body: **Inter**, 15–17px, line-height 1.6–1.75, color `--white-soft`.
- Accent: **Playfair Display italic 500** for single emphasized words inside headlines.
- Labels/eyebrows: 11–13px, uppercase, letter-spacing 0.12–0.2em, `--white-faint`,
  often with a 26px × 1px line before them.
- Large screens (≥1024px) scale everything up with `clamp(..., Nvw, ...)` up to ~2000px wide.

## Background (services + work with us pages)

This is the background the current landing page uses (`style.css`, `.svc-bg` and `.grain`):

- Base: `linear-gradient(160deg, #050506 0%, #0c0c0e 45%, #060607 100%)`
- Soft white light pooling top-left, plus faint glows top-right and bottom-right (radial gradients).
- 58px grid of 1px lines at `rgba(255,255,255,0.055)`, layer opacity 0.4, drifting
  diagonally one cell per 60s.
- Bottom darkening overlay.
- Film grain: SVG fractal noise at 4.5% opacity, `mix-blend-mode: overlay`, jittering in 6 steps per 1.1s.

The home page instead used a blurred background video with a vignette (`.wave-bg`, `.bg-video`).

## Components

- **Nav**: fixed, transparent, links 13px `--white-soft` → white on hover, centered logo,
  Instagram handle on the right. Slides down on load.
- **Floating CTA pill**: fixed top-center (bottom-right on mobile), 999px radius,
  1px white 20% border, blurred glass fill, small white dot before the label.
- **Badge**: pill with 6px white dot, 11px uppercase bold, 0.07em tracking.
- **Buttons**: 8px radius, 13px bold. Primary = solid white on black text;
  ghost = transparent with 25% white border. Hover lifts 1px.
- **Stat pills**: small bordered tiles with a big display number and uppercase label.
- **Cards** (method / engagement / system blocks): 12–16px radius, bordered glass,
  lift 5–6px on hover, numbered with a faded large display numeral (`rgba(255,255,255,0.22)`).
- **Bullets**: 5px round dots at 40% white.
- **Work with us form**: one question per screen (Typeform style), big display question,
  underline-only inputs, lettered choice buttons that invert to white when selected,
  thin white progress bar across the top.
- **Page transition**: black overlay with the spinning small logo and a looping progress bar.

## Motion

- Reveal on scroll: fade + rise 24px over 0.8s, `cubic-bezier(.22,.61,.36,1)`,
  siblings staggered 90ms (max 360ms).
- Variants: fall from above, pop (scale 0.92 → 1), slide from left/right,
  "immersive" (blur 16px + scale 0.94 → sharp).
- Headline words drop in one by one with blur.
- Cursor glow: 620px soft white radial gradient following the pointer (desktop only).
- Scroll progress bar: 3px white bar at the top of the page.
