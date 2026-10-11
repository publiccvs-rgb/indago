const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Nav background and scroll progress bar */
const nav = document.querySelector('.nav');
const progress = document.getElementById('progress');
function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  nav.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* Reveal on scroll; siblings ease in slightly staggered */
const revealEls = document.querySelectorAll('.reveal');
const siblingIndex = new Map();
revealEls.forEach((el) => {
  const i = siblingIndex.get(el.parentElement) || 0;
  el.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
  siblingIndex.set(el.parentElement, i + 1);
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
revealEls.forEach((el) => observer.observe(el));

/* Production marquee: duplicate the slides so the strip loops seamlessly,
   and keep the speed constant however many screenshots there are */
const marquee = document.getElementById('marquee');
if (marquee) {
  const originals = Array.from(marquee.children);
  originals.forEach((slide) => {
    const copy = slide.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    marquee.appendChild(copy);
  });
  const PIXELS_PER_SECOND = 40;
  const setSpeed = () => {
    const distance = marquee.scrollWidth / 2;
    marquee.style.setProperty('--marquee-duration', `${distance / PIXELS_PER_SECOND}s`);
  };
  setSpeed();
  window.addEventListener('resize', setSpeed);
  window.addEventListener('load', setSpeed);
}

/* Instagram links: on phones, open the Instagram app instead of the mobile
   website (which asks visitors to log in). Desktop keeps the normal link.
   - Inside Instagram's own in-app browser, ig.me already opens the DM: leave it.
   - Android: an intent URL opens the app, or the Play Store if it's missing.
   - iOS: try the app's URL scheme; if the page is still showing shortly after,
     the app isn't installed, so send the visitor to the App Store. */
const IG_USERNAME = 'casimirdz';
const IG_APP_URL = `instagram://user?username=${IG_USERNAME}`;
const IG_APP_STORE = 'https://apps.apple.com/app/instagram/id389801252';
const IG_ANDROID_INTENT = `intent://user?username=${IG_USERNAME}#Intent;scheme=instagram;package=com.instagram.android;end`;

const ua = navigator.userAgent;
const inInstagramApp = /Instagram/i.test(ua);
const isAndroid = /Android/i.test(ua);
const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function bindInstagramLinks(root) {
  if (inInstagramApp || !(isAndroid || isIOS)) return;
  root.querySelectorAll('a[data-ig]:not([data-ig-bound])').forEach((link) => {
    link.setAttribute('data-ig-bound', '');
    link.removeAttribute('target');
    if (isAndroid) {
      link.href = IG_ANDROID_INTENT;
      return;
    }
    link.addEventListener('click', (e) => {
      e.preventDefault();
      let fallback = window.setTimeout(() => {
        if (document.visibilityState === 'visible') window.location.href = IG_APP_STORE;
      }, 1600);
      const cancel = () => { window.clearTimeout(fallback); fallback = null; };
      document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); }, { once: true });
      window.addEventListener('pagehide', cancel, { once: true });
      window.location.href = IG_APP_URL;
    });
  });
}
window.bindInstagramLinks = bindInstagramLinks;
bindInstagramLinks(document);

/* Starter DM messages: Instagram links can't pre-fill a message, so tapping a
   button with data-ig-msg copies a context-specific opener to the clipboard
   and tells the visitor they can paste it. Runs in the capture phase so it
   happens before the app redirect above. */
const toast = document.querySelector('.toast');
let toastTimer;
function showToast(text) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-on'), 3200);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-ig-msg]');
  if (!link || !navigator.clipboard) return;
  navigator.clipboard.writeText(link.dataset.igMsg)
    .then(() => showToast('Starter message copied. Paste it in the DM.'))
    .catch(() => {});
}, true);

/* Sticky join bar on phones: appears once the hero is out of view and hides
   again when the final call to action is on screen. */
const dock = document.querySelector('.dock');
const heroEl = document.querySelector('.hero');
const joinEl = document.getElementById('join');
if (dock && heroEl && joinEl) {
  let pastHero = false;
  let atJoin = false;
  const sync = () => {
    const on = pastHero && !atJoin;
    dock.classList.toggle('is-on', on);
    dock.setAttribute('aria-hidden', String(!on));
    dock.querySelector('a').tabIndex = on ? 0 : -1;
  };
  new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; sync(); }).observe(heroEl);
  new IntersectionObserver(([en]) => { atJoin = en.isIntersecting; sync(); }).observe(joinEl);
}

/* ---------- Motion ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Hero headline: split into words that rise in one after another. */
document.querySelectorAll('[data-words]').forEach((el) => {
  let i = 0;
  const wrap = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.style.setProperty('--i', i++);
          w.textContent = part;
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrap(child);
      }
    });
  };
  wrap(el);
  el.classList.add('is-split');
});

/* Count numbers up from zero when they scroll into view, keeping any
   prefix/suffix ("$", "%", "K", "~", " hrs") and thousands separators. */
const countEls = document.querySelectorAll('[data-count]');
const runCount = (el) => {
  const text = el.textContent.trim();
  const m = text.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const target = parseFloat(num.replace(/,/g, ''));
  const decimals = (num.split('.')[1] || '').length;
  const useComma = num.includes(',');
  const dur = 1400;
  const start = performance.now();
  const fmt = (v) => {
    const n = v.toFixed(decimals);
    return useComma ? Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals }) : n;
  };
  const tick = (t) => {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(2, -10 * p);
    el.textContent = pre + fmt(target * (p === 1 ? 1 : eased)) + post;
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = pre + fmt(0) + post;
  requestAnimationFrame(tick);
};
if (!reduceMotion) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { runCount(en.target); countObserver.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  countEls.forEach((el) => countObserver.observe(el));
}

/* Spotlight that follows the cursor across cards. */
if (finePointer) {
  document.querySelectorAll('.spot').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* Soft glow that trails the cursor (desktop only). */
const glow = document.querySelector('.cursor-glow');
if (glow && finePointer && !reduceMotion) {
  let x = innerWidth / 2, y = innerHeight / 3, gx = x, gy = y, running = false;
  const loop = () => {
    gx += (x - gx) * 0.12;
    gy += (y - gy) * 0.12;
    glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    if (Math.abs(x - gx) > 0.5 || Math.abs(y - gy) > 0.5) requestAnimationFrame(loop);
    else running = false;
  };
  window.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    glow.classList.add('is-on');
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
}
