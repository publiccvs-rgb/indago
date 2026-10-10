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
