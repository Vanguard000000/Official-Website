/* ── Navbar shrink on scroll ── */
const nav = document.querySelector('.nav-container');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('nav-scrolled', y > 60);
  lastScroll = y;
});

/* ── Active nav link (hash links only) ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const hashLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  let current = '';
  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  hashLinks.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

if (hashLinks.length) window.addEventListener('scroll', updateActiveLink);

/* ── Smooth scroll for hash nav links ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburgerBtn');
const dropdown = document.getElementById('menuDropdown');

if (hamburger && dropdown) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
      hamburger.classList.remove('open');
      dropdown.classList.remove('open');
    }
  });
}

/* ── Scroll-to-top button ── */
(function() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });

  btn.addEventListener('click', () => {
    const start = window.scrollY;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - progress));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
})();

