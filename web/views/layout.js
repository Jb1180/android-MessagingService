'use strict';

const { escapeHtml } = require('./format');

const NAV_LINKS = [
    { href: '/messages', label: 'Messages', key: 'messages' },
    { href: '/settings', label: 'Configuration', key: 'settings' }
];

function renderNavLink(link, active) {
    const current = link.key === active;
    return '<a class="nav__link' + (current ? ' is-active' : '') + '" href="' + link.href + '"' +
        (current ? ' aria-current="page"' : '') + '>' + link.label + '</a>';
}

function renderPage({ title, active, body }) {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)} · Messaging Sample</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<header class="site-header">
  <a class="brand" href="/messages">
    <span class="brand__mark" aria-hidden="true">M</span>
    <span class="brand__name">Messaging Sample</span>
  </a>
  <nav class="nav" aria-label="Sections">
    ${NAV_LINKS.map((link) => renderNavLink(link, active)).join('\n    ')}
  </nav>
</header>
<main class="page">
${body}
</main>
<script src="/app.js" defer></script>
</body>
</html>
`;
}

module.exports = { renderPage };
