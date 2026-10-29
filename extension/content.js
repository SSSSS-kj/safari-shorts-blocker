// YouTube Shorts Blocker
// - Redirects /shorts/<id> URLs to the regular player (/watch?v=<id>).
// - Hides Shorts elements on Home/Subscriptions/Search/channels/sidebar via CSS.
// Dependency-free so it runs unchanged as a Safari Web Extension content script and as a userscript.
(() => {
  'use strict';

  if (window.__shortsBlockerLoaded) return;
  window.__shortsBlockerLoaded = true;

  const SHORTS_LINK = 'a[href^="/shorts/"], a[href^="https://www.youtube.com/shorts/"], a[href^="https://m.youtube.com/shorts/"]';

  const HIDE_SELECTORS = [
    // Desktop: Shorts shelves (Home, Search, Subscriptions, recommendations)
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)',
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
    'ytm-shorts-lockup-view-model',
    'ytm-shorts-lockup-view-model-v2',

    // Desktop: individual video cards linking to Shorts
    `ytd-rich-item-renderer:has(${SHORTS_LINK})`,
    `ytd-video-renderer:has(${SHORTS_LINK})`,
    `ytd-grid-video-renderer:has(${SHORTS_LINK})`,
    `ytd-compact-video-renderer:has(${SHORTS_LINK})`,
    `yt-lockup-view-model:has(${SHORTS_LINK})`,

    // Desktop: Shorts entry in the left sidebar / mini sidebar
    'ytd-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[aria-label="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])',

    // Desktop: Shorts tab on channel pages
    'yt-tab-shape[tab-title="Shorts"]',
    'tp-yt-paper-tab:has(a[href$="/shorts"])',

    // Mobile (m.youtube.com)
    'ytm-reel-shelf-renderer',
    'ytm-rich-section-renderer:has(ytm-shorts-lockup-view-model)',
    'ytm-rich-section-renderer:has(ytm-shorts-lockup-view-model-v2)',
    `ytm-video-with-context-renderer:has(${SHORTS_LINK})`,
    `ytm-rich-item-renderer:has(${SHORTS_LINK})`,
    `ytm-compact-video-renderer:has(${SHORTS_LINK})`,
    'ytm-pivot-bar-item-renderer:has(.pivot-shorts)',
  ];

  const CSS = `${HIDE_SELECTORS.join(',\n')} { display: none !important; }`;

  function injectStyle() {
    if (document.getElementById('shorts-blocker-style')) return;
    const style = document.createElement('style');
    style.id = 'shorts-blocker-style';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // The sidebar Shorts entry's attributes change often, so also match it by its visible text.
  const NAV_ENTRIES = 'ytd-mini-guide-entry-renderer, ytd-guide-entry-renderer, ytm-pivot-bar-item-renderer';

  function hideShortsNavEntries() {
    for (const entry of document.querySelectorAll(NAV_ENTRIES)) {
      if (entry.style.display === 'none') continue;
      if (entry.textContent.trim() === 'Shorts') entry.style.setProperty('display', 'none', 'important');
    }
  }

  function watchUrlFor(url) {
    const match = url.pathname.match(/^\/shorts\/([\w-]+)/);
    if (!match) return null;
    return `${url.origin}/watch?v=${match[1]}`;
  }

  function redirectIfShorts() {
    const target = watchUrlFor(location);
    if (target) location.replace(target);
  }

  // Intercept clicks on Shorts links so the Shorts player never opens.
  function onClick(event) {
    const link = event.target instanceof Element && event.target.closest('a[href*="/shorts/"]');
    if (!link) return;
    const target = watchUrlFor(new URL(link.href, location.href));
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(target);
  }

  console.info('[Shorts Blocker] loaded');
  redirectIfShorts();
  injectStyle();
  document.addEventListener('DOMContentLoaded', injectStyle);
  document.addEventListener('click', onClick, true);

  // YouTube is an SPA with no reloads between pages, so detect navigation via its events plus URL polling.
  window.addEventListener('yt-navigate-start', redirectIfShorts);
  window.addEventListener('yt-navigate-finish', redirectIfShorts);
  window.addEventListener('popstate', redirectIfShorts);
  let lastHref = location.href;
  setInterval(() => {
    hideShortsNavEntries();
    if (location.href === lastHref) return;
    lastHref = location.href;
    redirectIfShorts();
  }, 300);
})();
