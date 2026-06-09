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

/* ── Animate progress bars (re-triggers on scroll, excluding JS card) ── */
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const bar = entry.target.querySelector('.progress');
      if (!bar) return;
      if (entry.isIntersecting) {
        if (bar.dataset.playing === 'true') return;
        bar.dataset.playing = 'true';
        bar.removeAttribute('data-filled');
        const w = bar.dataset.width || bar.style.width || '0%';
        bar.style.transition = 'none';
        bar.style.width = '0%';
        void bar.offsetHeight;
        bar.style.transition = '';
        bar.style.width = w;
      } else {
        bar.dataset.playing = 'false';
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-card').forEach((el, i) => {
  if (i !== 2) progressObserver.observe(el);
});

/* ── Trigger JS progress bar after all card slide animations settle ── */
const jsCard = document.querySelector('.skill-card:nth-child(3)');
const jsProgress = jsCard?.querySelector('.progress');

function animateJsBar() {
  if (!jsProgress || jsProgress.dataset.playing === 'true') return;
  jsProgress.dataset.playing = 'true';
  jsProgress.removeAttribute('data-filled');
  const w = jsProgress.dataset.width || jsProgress.style.width || '0%';
  jsProgress.style.transition = 'none';
  jsProgress.style.width = '0%';
  void jsProgress.offsetHeight;
  jsProgress.style.transition = '';
  jsProgress.style.width = w;
}

function resetJsBar() {
  if (!jsProgress) return;
  jsProgress.dataset.playing = 'false';
  jsProgress.removeAttribute('data-filled');
}

if (jsCard && jsProgress) {
  const cs = getComputedStyle(jsCard);
  const dur = parseFloat(cs.transitionDuration) * 1000 || 700;
  const del = parseFloat(cs.transitionDelay) * 1000 || 240;
  const waitMs = dur + del + 350;
  let timer = null;

  const revealCheck = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        if (jsCard.classList.contains('visible')) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(animateJsBar, waitMs);
        }
      }
    });
  });
  revealCheck.observe(jsCard, { attributes: true });

  const jsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          resetJsBar();
          if (timer) { clearTimeout(timer); timer = null; }
        }
      });
    },
    { threshold: 0 }
  );
  jsObserver.observe(jsCard);
}

/* ── Spark burst on JS skill progress completion ── */
if (jsProgress) {
  jsProgress.addEventListener('transitionend', () => {
    const w = jsProgress.style.width;
    if (!w || w === '0%' || w === '0px') return;
    jsProgress.setAttribute('data-filled', '');
    const rect = jsProgress.getBoundingClientRect();
    const x = rect.right;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      const size = 3 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const hue = Math.random() > 0.5 ? 190 : 270;
      s.style.cssText = `
        left:${x}px; top:${y}px;
        width:${size}px; height:${size}px;
        background:hsl(${hue}, 80%, 60%);
        box-shadow:0 0 ${size * 3}px hsl(${hue}, 80%, 60%);
      `;
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 700);
    }
  });
}

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
document.querySelectorAll('.nav-links a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Rocket scroll progress ── */
const rocket = document.getElementById('rocket');
const rocketFill = document.getElementById('rocketFill');
const track = document.querySelector('.rocket-track');

function updateRocket() {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

  if (rocketFill) {
    rocketFill.style.height = `${pct * 100}%`;
  }

  if (rocket && track) {
    const r = track.getBoundingClientRect();
    const centerX = window.innerWidth - 24 - 2 - 15;
    const y = r.top + pct * r.height;

    const scale = 0.8 + pct * 3;
    rocket.style.fontSize = `${scale}rem`;
    rocket.style.left = `${centerX}px`;
    rocket.style.top = `${y}px`;
    rocket.style.transform = 'translate(-50%, -50%) rotate(135deg)';

    track.style.width = `${4 + pct * 16}px`;
  }
}

window.addEventListener('scroll', updateRocket);
window.addEventListener('resize', updateRocket);
updateRocket();

/* ── Animated counter ── */
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

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const num = entry.target.querySelector('.counter-number');
        if (num && !num.dataset.played) {
          num.dataset.played = 'true';
          animateCounter(num);
        }
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter-card').forEach((el) => counterObserver.observe(el));

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

/* ── Cursor trail particles ── */
const trail = document.createElement('div');
trail.className = 'cursor-trail';
document.body.appendChild(trail);

let mouseX = 0, mouseY = 0;
let particles = [];
const maxParticles = 20;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function spawnTrailParticle() {
  const p = document.createElement('div');
  p.className = 'trail-particle';
  const size = 4 + Math.random() * 6;
  const hue = Math.random() > 0.5 ? 190 : 270;
  p.style.cssText = `
    left:${mouseX}px; top:${mouseY}px;
    width:${size}px; height:${size}px;
    background:hsl(${hue}, 80%, 60%);
    box-shadow:0 0 ${size * 2}px hsl(${hue}, 80%, 60%);
  `;
  trail.appendChild(p);
  particles.push(p);

  if (particles.length > maxParticles) {
    const old = particles.shift();
    old.remove();
  }

  requestAnimationFrame(() => { p.style.opacity = '0'; p.style.transform = 'scale(0)'; });

  setTimeout(() => { p.remove(); }, 600);
}

let trailTick = 0;
document.addEventListener('mousemove', () => {
  trailTick++;
  if (trailTick % 2 !== 0) return;
  spawnTrailParticle();
});
