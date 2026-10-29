// YouTube Shorts Blocker
// - /shorts/<id> 주소는 일반 플레이어(/watch?v=<id>)로 돌려보낸다.
// - 홈/구독/검색/채널/사이드바의 Shorts 요소를 CSS로 숨긴다.
// Safari 웹 확장(content script)과 유저스크립트 양쪽에서 그대로 쓰도록 의존성 없이 작성.
(() => {
  'use strict';

  if (window.__shortsBlockerLoaded) return;
  window.__shortsBlockerLoaded = true;

  const SHORTS_LINK = 'a[href^="/shorts/"], a[href^="https://www.youtube.com/shorts/"], a[href^="https://m.youtube.com/shorts/"]';

  const HIDE_SELECTORS = [
    // 데스크톱: Shorts 선반(홈, 검색, 구독, 추천)
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model)',
    'grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)',
    'ytm-shorts-lockup-view-model',
    'ytm-shorts-lockup-view-model-v2',

    // 데스크톱: Shorts로 연결되는 개별 영상 카드
    `ytd-rich-item-renderer:has(${SHORTS_LINK})`,
    `ytd-video-renderer:has(${SHORTS_LINK})`,
    `ytd-grid-video-renderer:has(${SHORTS_LINK})`,
    `ytd-compact-video-renderer:has(${SHORTS_LINK})`,
    `yt-lockup-view-model:has(${SHORTS_LINK})`,

    // 데스크톱: 왼쪽 사이드바 / 미니 사이드바의 Shorts 메뉴
    'ytd-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[aria-label="Shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])',

    // 데스크톱: 채널 페이지의 Shorts 탭
    'yt-tab-shape[tab-title="Shorts"]',
    'tp-yt-paper-tab:has(a[href$="/shorts"])',

    // 모바일(m.youtube.com)
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

  // 사이드바 Shorts 메뉴는 속성이 자주 바뀌어서, 표시 텍스트로도 한 번 더 찾아 숨긴다.
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

  // Shorts 링크 클릭을 가로채서 Shorts 플레이어가 아예 뜨지 않게 한다.
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

  // YouTube는 SPA라 페이지 이동 시 새로고침이 없다. 내비게이션 이벤트 + 주소 폴링으로 감지.
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
