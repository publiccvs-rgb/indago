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

/* Testimonial carousel */
const track = document.getElementById('carousel');
const dotsEl = document.getElementById('dots');
const buttons = document.querySelectorAll('.ctrl');
if (track) {
  const slides = Array.from(track.children);
  const dots = slides.map(() => dotsEl.appendChild(document.createElement('span')));

  const step = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16);

  function update() {
    const index = Math.round(track.scrollLeft / step());
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    buttons[0].disabled = track.scrollLeft <= 4;
    buttons[1].disabled = atEnd;
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: 'smooth' });
    });
  });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      track.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * step(), behavior: 'smooth' });
    }
  });

  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}
