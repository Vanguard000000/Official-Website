/* ── Scroll-triggered reveal (fires on every scroll, not just once) ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* ── Hero section reveal (re-triggers on scroll back to top) ── */
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const els = entry.target.querySelectorAll('.hero-title, .hero-motto, .hero-subtitle, .hero-tagline, .cta-button');
      els.forEach((el) => el.classList.toggle('visible', entry.isIntersecting));
    });
  },
  { threshold: 0.3 }
);

const hero = document.querySelector('.hero');
if (hero) heroObserver.observe(hero);

/* ── About section reveal (requires 80% visible) ── */
const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  { threshold: 0.8 }
);

const aboutSection = document.querySelector('.about');
if (aboutSection) aboutObserver.observe(aboutSection);



/* ── Metric counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

setTimeout(() => {
  document.querySelectorAll('.metric-number').forEach((el) => {
    el.textContent = '0';
    animateCounter(el);
  });
}, 600);

/* ── Random Idle Animation ── */
(function() {
  const selectors = '.project-card, .flip-card, .skill-card, .about-card, .journal-entry, .hero-title, .hero-subtitle, .section-title, .btn, button, .nav-container > .logo, .form-group label, .back-home';
  const anims = ['idle-breathe', 'idle-wobble', 'idle-glow'];

  function applyIdle() {
    const els = document.querySelectorAll(selectors);
    if (!els.length) return;
    const el = els[Math.floor(Math.random() * els.length)];
    const anim = anims[Math.floor(Math.random() * anims.length)];
    el.classList.add(anim);
    el.addEventListener('animationend', () => el.classList.remove(anim), { once: true });
  }

  setInterval(applyIdle, 4000 + Math.random() * 3000);

  /* extra rare sparkle: every ~15s add a longer wobble */
  setInterval(() => {
    const els = document.querySelectorAll(selectors);
    if (!els.length) return;
    const el = els[Math.floor(Math.random() * els.length)];
    el.style.transition = 'transform 0.3s ease';
    el.style.transform = 'rotate(1.5deg)';
    setTimeout(() => { el.style.transform = ''; }, 400);
  }, 15000 + Math.random() * 5000);
})();
