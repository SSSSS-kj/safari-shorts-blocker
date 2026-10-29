#!/bin/sh
# extension/content.js 에 유저스크립트 헤더를 붙여 dist/youtube-shorts-blocker.user.js 를 만든다.
set -eu
cd "$(dirname "$0")/.."

version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' extension/manifest.json)
mkdir -p dist
{
  cat <<EOF
// ==UserScript==
// @name         YouTube Shorts Blocker
// @version      ${version}
// @description  YouTube Shorts를 숨기고 Shorts 주소를 일반 영상 플레이어로 돌려보냅니다.
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://youtube.com/*
// @run-at       document-start
// @grant        none
// @homepageURL  https://github.com/SSSSS-kj/safari-shorts-blocker
// @updateURL    https://raw.githubusercontent.com/SSSSS-kj/safari-shorts-blocker/main/dist/youtube-shorts-blocker.user.js
// @downloadURL  https://raw.githubusercontent.com/SSSSS-kj/safari-shorts-blocker/main/dist/youtube-shorts-blocker.user.js
// ==/UserScript==

EOF
  cat extension/content.js
} > dist/youtube-shorts-blocker.user.js

echo "built dist/youtube-shorts-blocker.user.js"
