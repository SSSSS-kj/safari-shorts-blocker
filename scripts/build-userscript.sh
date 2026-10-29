#!/bin/sh
# Builds dist/youtube-shorts-blocker.user.js by prepending a userscript header to extension/content.js.
set -eu
cd "$(dirname "$0")/.."

version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' extension/manifest.json)
mkdir -p dist
{
  cat <<EOF
// ==UserScript==
// @name         YouTube Shorts Blocker
// @version      ${version}
// @description  Hides YouTube Shorts and redirects Shorts URLs to the regular video player.
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
