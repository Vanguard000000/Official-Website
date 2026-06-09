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

/* ── Cursor trail (only while moving) ── */
(function() {
  const container = document.createElement('div');
  container.className = 'cursor-trail';
  document.documentElement.appendChild(container);

  let x = 0, y = 0;
  let interval = null;
  let idleTimer = null;

  function spawn() {
    const p = document.createElement('div');
    p.className = 'trail-particle';
    const size = 5 + Math.random() * 9;
    const hue = Math.random() > 0.5 ? 190 + Math.random() * 40 : 260 + Math.random() * 40;
    const sat = 70 + Math.random() * 30;
    const light = 50 + Math.random() * 30;
    p.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:hsl(${hue},${sat}%,${light}%);box-shadow:0 0 ${size*3}px hsl(${hue},${sat}%,${light}%)`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }

  function start() {
    if (interval) return;
    spawn();
    interval = setInterval(spawn, 35);
  }

  function stop() {
    if (interval) { clearInterval(interval); interval = null; }
  }

  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    start();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(stop, 120);
  });
})();
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

/* ── Dark / Light mode toggle ── */
const toggleBtn = document.getElementById('darkModeToggle');

if (toggleBtn) {
  const html = document.documentElement;

  if (localStorage.getItem('theme') === 'light') {
    html.classList.add('light');
    toggleBtn.textContent = '🌙 Dark Mode';
  }

  toggleBtn.addEventListener('click', () => {
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    toggleBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/* ── Current date mm/dd/yyyy ── */
const dateEl = document.getElementById('currentDate');
if (dateEl) {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  dateEl.textContent = `${mm}/${dd}/${yyyy}`;
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

  function smoothScrollToTop() {
    const start = window.scrollY;
    if (start < 1) return;
    document.documentElement.style.scrollBehavior = 'auto';

    let velocity = Math.max(start * 0.0167, 1);
    let lastDecay = performance.now();

    function tick(now) {
      const currentY = window.scrollY;

      if (now - lastDecay >= 500) {
        velocity *= 0.5;
        lastDecay = now;
      }

      const step = Math.ceil(velocity);

      if (currentY <= step) {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
        return;
      }

      window.scrollTo(0, currentY - step);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  btn.addEventListener('click', smoothScrollToTop);
})();


