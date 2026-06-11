/* ── Shared navigation stamp ── */
(function () {
  var path = window.location.pathname;
  var parts = path.split('/').filter(Boolean);
  var filename = parts[parts.length - 1] || 'index.html';
  var page = filename.replace(/\.html$/, '') || 'index';
  var isHome = page === 'index';

  var links = [
    { href: 'about.html',   label: 'About' },
    { href: 'skills.html',  label: 'Skills' },
    { href: '#projects',    label: 'Projects',   homeOnly: true },
    { href: 'portfolio.html', label: 'Portfolio' },
    { href: 'frc.html',     label: 'FRC' },
    { href: 'goals.html',   label: 'Goals' },
    { href: 'journey.html', label: 'Journey' },
    { href: 'contact.html', label: 'Contact' }
  ];

  var currentFile = page + '.html';

  var nav = document.createElement('nav');
  nav.className = 'nav-container';

  var linksHtml = links.map(function (l) {
    if (l.homeOnly && !isHome) return '';
    var isActive;
    if (l.href === '#projects') {
      isActive = false; // hash links never get active state
    } else {
      isActive = l.href === currentFile;
    }
    var cls = isActive ? ' class="active"' : '';
    return '<a href="' + l.href + '"' + cls + '>' + l.label + '</a>';
  }).join('');

  nav.innerHTML =
    '<a href="index.html" class="logo">PS</a>' +
    '<div class="nav-right">' +
      '<button class="hamburger" id="hamburgerBtn" aria-label="Menu">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<div class="menu-dropdown" id="menuDropdown">' +
        linksHtml +
        '<button id="darkModeToggle">☀️ Light Mode</button>' +
      '</div>' +
    '</div>';

  document.body.insertBefore(nav, document.body.firstChild);
})();
