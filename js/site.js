'use strict';

const root = document.documentElement;
const button = document.getElementById('theme-toggle');
const preference = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme, remember) {
  root.dataset.theme = theme;
  button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  button.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#181818' : '#ffffff';
  if (remember) {
    try { localStorage.setItem('rr-theme', theme); } catch (_) { /* Storage may be unavailable */ }
  }
}

setTheme(root.dataset.theme || (preference.matches ? 'dark' : 'light'), false);
button.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

// Follow system changes only if the visitor has not selected a preference
preference.addEventListener('change', event => {
  let saved = null;
  try { saved = localStorage.getItem('rr-theme'); } catch (_) { /* Storage may be unavailable */ }
  if (saved !== 'light' && saved !== 'dark') setTheme(event.matches ? 'dark' : 'light', false);
});

// Mark the active in-page navigation link as the reader scrolls
const tracked = ['top', 'research', 'projects'];
const navLinks = [...document.querySelectorAll('.nav-link[data-section]')];
function updateActiveLink() {
  const scrollPosition = window.scrollY + 150;
  let active = 'top';
  for (const id of tracked.slice(1)) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPosition) active = id;
  }
  navLinks.forEach(link => {
    const selected = link.dataset.section === active;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('hashchange', updateActiveLink);
updateActiveLink();
