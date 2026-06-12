/* ── Dark / Light mode toggle ── */
const toggleBtn = document.getElementById('darkModeToggle');

if (toggleBtn) {
  const html = document.documentElement;

  if (localStorage.getItem('theme') === 'light') {
    html.classList.add('light');
    toggleBtn.textContent = '🌙 Dark Mode';
  }

  toggleBtn.addEventListener('click', () => {
    if (toggleBtn.disabled) return;
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    toggleBtn.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/* ── Seasonal Theme ── */
(function() {
  const html = document.documentElement;
  const menu = document.querySelector('.menu-dropdown');
  if (!menu) return;

  const dmBtn = document.getElementById('darkModeToggle');

  const sep = document.createElement('hr');
  sep.style.cssText = 'border: none; border-top: 1px solid var(--border); margin: 8px 0;';

  const summerBtn = document.createElement('button');
  summerBtn.id = 'seasonThemeToggle';
  summerBtn.textContent = '☀️ Summer Theme';
  summerBtn.style.cssText =
    'width:100%;padding:10px;font-size:0.9rem;border:1px solid var(--border);' +
    'border-radius:var(--radius-sm);background:var(--glass);color:var(--text);' +
    'cursor:pointer;transition:all var(--transition);font-family:inherit;margin-bottom:4px;';

  const defaultBtn = document.createElement('button');
  defaultBtn.id = 'defaultThemeToggle';
  defaultBtn.textContent = '🚀 Space Theme';
  defaultBtn.style.cssText =
    'width:100%;padding:10px;font-size:0.9rem;border:1px solid var(--border);' +
    'border-radius:var(--radius-sm);background:var(--glass);color:var(--text-muted);' +
    'cursor:pointer;transition:all var(--transition);font-family:inherit;';
  defaultBtn.style.display = 'none';

  const countdownEl = document.createElement('div');
  countdownEl.id = 'seasonCountdown';
  countdownEl.style.cssText =
    'font-size:0.75rem;color:var(--text-muted);text-align:center;padding:2px 0 6px;' +
    'font-family:monospace;display:none;';

  if (dmBtn) {
    menu.insertBefore(sep, dmBtn);
    menu.insertBefore(countdownEl, dmBtn);
    menu.insertBefore(defaultBtn, dmBtn);
    menu.insertBefore(summerBtn, dmBtn);
  } else {
    menu.appendChild(sep);
    menu.appendChild(summerBtn);
    menu.appendChild(defaultBtn);
    menu.appendChild(countdownEl);
  }

  const solstices = [
    { season: 'spring', date: new Date(2026, 2, 20) },
    { season: 'summer', date: new Date(2026, 5, 21) },
    { season: 'fall', date: new Date(2026, 8, 22, 20, 5) },
    { season: 'winter', date: new Date(2026, 11, 21) },
  ];

  const seasonNext = { spring: '☀️ Summer', summer: '🍂 Fall', fall: '❄️ Winter', winter: '🌸 Spring' };

  function getNextSeason() {
    const now = new Date();
    for (const s of solstices) {
      if (s.date > now) return s;
    }
    return { season: 'spring', date: new Date(2027, 2, 20) };
  }

  function updateCountdown() {
    if (html.classList.contains('season-summer')) {
      const next = getNextSeason();
      const diff = next.date - new Date();
      if (diff > 0) {
        const days = Math.floor(diff / 86400000);
        const hrs = Math.floor((diff % 86400000) / 3600000);
        const min = Math.floor((diff % 3600000) / 60000);
        countdownEl.textContent = `${seasonNext[next.season]} in ${days}d ${hrs}h ${min}m`;
        countdownEl.style.display = 'block';
      }
    } else {
      countdownEl.style.display = 'none';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 60000);

  function syncUI() {
    const isSummer = html.classList.contains('season-summer');
    if (isSummer) {
      summerBtn.style.background = 'var(--primary)';
      summerBtn.style.color = '#fff';
      summerBtn.style.borderColor = 'var(--primary)';
      defaultBtn.style.display = 'block';
    } else {
      summerBtn.style.background = 'var(--glass)';
      summerBtn.style.color = 'var(--text)';
      summerBtn.style.borderColor = 'var(--border)';
      defaultBtn.style.display = 'none';
    }
  }

  if (localStorage.getItem('season') === 'summer') {
    html.classList.add('season-summer');
  }
  syncUI();

  summerBtn.addEventListener('click', () => {
    if (html.classList.contains('season-summer')) return;
    html.classList.add('season-summer');
    localStorage.setItem('season', 'summer');
    syncUI();
  });

  defaultBtn.addEventListener('click', () => {
    html.classList.remove('season-summer');
    localStorage.removeItem('season');
    syncUI();
  });
})();

/* ── Celestial Background ── */
(function() {
  const container = document.createElement('div');
  container.className = 'celestial-bg';
  document.body.prepend(container);

  const bodies = [
    { type: 'sun', size: 140, color: 'rgba(251,191,36,0.5)', left: 5, top: 3 },
    { type: 'planet', size: 70, color: 'rgba(96,165,250,0.45)', left: 68, top: 12, ring: true },
    { type: 'planet', size: 50, color: 'rgba(252,129,129,0.4)', left: 78, top: 48 },
    { type: 'planet', size: 80, color: 'rgba(196,129,255,0.45)', left: 85, top: 60, ring: true },
    { type: 'moon', size: 30, color: 'rgba(203,213,225,0.4)', left: 35, top: 14 },
    { type: 'moon', size: 22, color: 'rgba(203,213,225,0.35)', left: 55, top: 35 },
    { type: 'planet', size: 45, color: 'rgba(74,222,128,0.4)', left: 12, top: 68 },
  ];

  bodies.forEach(b => {
    const el = document.createElement('div');
    el.className = 'cbody';
    if (b.ring) el.classList.add('ring');
    if (b.type === 'sun') el.classList.add('sun');
    el.style.cssText =
      `width:${b.size}px;height:${b.size}px;left:${b.left}%;top:${b.top}%;` +
      `background:radial-gradient(circle at 30% 30%, white 0%, ${b.color} 60%, transparent 100%);` +
      `border:2px solid ${b.color};box-shadow:0 0 50px ${b.color}, inset 0 0 30px ${b.color};` +
      `color:${b.color};animation-delay:${Math.random() * -20}s;animation-duration:${18 + Math.random() * 12}s;`;
    container.appendChild(el);
  });

  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'cbody star';
    const size = 2 + Math.random() * 4;
    s.style.cssText =
      `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
      `background:rgba(255,255,255,0.8);box-shadow:0 0 ${size * 2}px rgba(255,255,255,0.4);` +
      `animation-delay:${Math.random() * -5}s;animation-duration:${2 + Math.random() * 5}s;`;
    container.appendChild(s);
  }
})();

/* ── Season Countdown Widget ── */
(function() {
  const solstices = [
    { emoji: '🌸', name: 'Spring', date: new Date(2026, 2, 20) },
    { emoji: '☀️', name: 'Summer', date: new Date(2026, 5, 21) },
    { emoji: '🍂', name: 'Fall',   date: new Date(2026, 8, 22) },
    { emoji: '❄️', name: 'Winter', date: new Date(2026, 11, 21) },
  ];
  const nextYearSpring = new Date(2027, 2, 20);

  function getNext() {
    const now = new Date();
    const m = now.getMonth();
    let idx;
    if (m >= 2 && m <= 4) idx = 0;
    else if (m >= 5 && m <= 7) idx = 1;
    else if (m >= 8 && m <= 10) idx = 2;
    else idx = 3;
    const nextIdx = (idx + 1) % 4;
    if (nextIdx === 0) return { emoji: '🌸', name: 'Spring', date: nextYearSpring };
    return solstices[nextIdx];
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const el = document.createElement('div');
  el.className = 'season-countdown';
  el.innerHTML =
    '<div class="sc-label">Next Season</div>' +
    '<div class="sc-emoji" id="scEmoji" style="font-size:1.8rem;line-height:1.2;"></div>' +
    '<div class="sc-season" id="scSeason"></div>' +
    '<div class="sc-time" id="scTime"></div>' +
    '<div class="sc-tz" id="scTz"></div>';
  document.body.appendChild(el);

  const emojiEl = document.getElementById('scEmoji');
  const seasonEl = document.getElementById('scSeason');
  const timeEl = document.getElementById('scTime');
  const tzEl = document.getElementById('scTz');
  tzEl.textContent = tz;

  function tick() {
    const next = getNext();
    seasonEl.textContent = next.name;
    emojiEl.textContent = next.emoji;
    const diff = next.date - new Date();
    if (diff <= 0) { timeEl.textContent = '—'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    timeEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }

  tick();
  setInterval(tick, 1000);


})();
