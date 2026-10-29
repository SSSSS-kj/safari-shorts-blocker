# Safari YouTube Shorts Blocker

Blocks YouTube Shorts in Safari on macOS, iOS, and iPadOS.

- Opening a `/shorts/<id>` URL sends you to the regular player (`/watch?v=<id>`)
- Hides Shorts shelves and cards on Home, Subscriptions, Search, recommendations, channel tabs, and the sidebar
- Works on both desktop (`www.youtube.com`) and mobile (`m.youtube.com`)

All the logic lives in `extension/content.js`, and there are two ways to install it.

## Option A: Userscripts app (no Xcode, Mac / iPhone / iPad)

1. Install the free **Userscripts** app (by Justin Wasack) from the App Store, then choose a scripts folder in the app
   (pick an iCloud Drive `Userscripts` folder so your Mac and iPhone share the same file)
2. Install the script, either way:
   - Open [youtube-shorts-blocker.user.js](https://raw.githubusercontent.com/SSSSS-kj/safari-shorts-blocker/main/dist/youtube-shorts-blocker.user.js) in Safari and install it from the Userscripts popup
   - Or copy `dist/youtube-shorts-blocker.user.js` into your scripts folder
3. Enable the extension
   - **Mac**: Safari Settings → Extensions → check Userscripts, and allow `youtube.com`
   - **iPhone/iPad**: Settings → Apps → Safari → Extensions → turn on Userscripts.
     Then open YouTube in Safari and tap **aA → Userscripts → Always Allow**
4. Reload YouTube

To check that it's working, open a `youtube.com/shorts/...` URL. It should change to `/watch?v=...`.

After editing the code, run `./scripts/build-userscript.sh` to rebuild `dist/`.

## Option B: Native Safari Web Extension (requires Xcode)

Safari extensions must ship inside a macOS app, so you need the **full Xcode** (Command Line Tools alone won't work).

```sh
xcrun safari-web-extension-converter extension/ \
  --project-location xcode --app-name "Shorts Blocker" \
  --bundle-identifier com.example.shortsblocker --macos-only --no-open
```

1. Open the generated `xcode/Shorts Blocker/Shorts Blocker.xcodeproj` in Xcode and Run (⌘R)
2. If you built without signing, go to Safari Settings → Advanced and turn on "Show features for web developers",
   then check **Develop → Allow Unsigned Extensions** (required again after every Safari restart)
3. Safari Settings → Extensions → enable Shorts Blocker and allow `youtube.com`

For iOS, drop `--macos-only` to also generate an iOS target (installing on a real device requires signing with an Apple ID).

## Notes

If YouTube changes its markup, some Shorts may show up again. When that happens,
add new selectors to `HIDE_SELECTORS` in `extension/content.js`.
