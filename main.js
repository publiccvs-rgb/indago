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
