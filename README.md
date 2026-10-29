# Safari YouTube Shorts Blocker

Safari에서 YouTube Shorts를 막는 확장 프로그램입니다.

- `/shorts/<id>` 주소로 들어가면 일반 플레이어(`/watch?v=<id>`)로 바로 이동
- 홈·구독·검색·추천·채널 탭·사이드바의 Shorts 선반과 카드 숨김
- 데스크톱(`www.youtube.com`)과 모바일(`m.youtube.com`) 모두 지원

코드는 `extension/content.js` 하나이며, 두 가지 방식으로 설치할 수 있습니다.

## 방법 A: Userscripts 앱 (Xcode 없이, Mac·iPhone·iPad)

1. App Store에서 무료 앱 **Userscripts** (Justin Wasack) 설치 후, 앱에서 스크립트 폴더 지정
   (iCloud Drive의 `Userscripts` 폴더로 하면 Mac·iPhone이 같은 파일을 씀)
2. 스크립트 설치 — 둘 중 하나:
   - Safari에서 [youtube-shorts-blocker.user.js](https://raw.githubusercontent.com/SSSSS-kj/safari-shorts-blocker/main/dist/youtube-shorts-blocker.user.js)를 열고 Userscripts 팝업에서 설치
   - 또는 `dist/youtube-shorts-blocker.user.js` 를 스크립트 폴더에 직접 복사
3. 확장 켜기
   - **Mac**: Safari 설정 → 확장 프로그램 → Userscripts 체크, `youtube.com` 허용
   - **iPhone/iPad**: 설정 → 앱 → Safari → 확장 프로그램 → Userscripts 켜기.
     그다음 Safari에서 YouTube를 열고 주소창 **aA → Userscripts → 항상 허용**
4. YouTube 새로고침

확인: `youtube.com/shorts/...` 주소를 열었을 때 `/watch?v=...` 로 바뀌면 동작 중입니다.

코드를 고친 뒤에는 `./scripts/build-userscript.sh` 로 `dist/` 를 다시 만드세요.

## 방법 B: 네이티브 Safari 웹 확장 (Xcode 필요)

Safari 확장은 macOS 앱 안에 담겨야 해서 **전체 Xcode**(Command Line Tools만으로는 불가)가 필요합니다.

```sh
xcrun safari-web-extension-converter extension/ \
  --project-location xcode --app-name "Shorts Blocker" \
  --bundle-identifier com.example.shortsblocker --macos-only --no-open
```

1. 생성된 `xcode/Shorts Blocker/Shorts Blocker.xcodeproj` 를 Xcode로 열고 Run (⌘R)
2. 개인 서명 없이 실행했다면 Safari 설정 → 고급 → "웹 개발자용 기능 보기" 켜고,
   개발자 메뉴 → **"서명되지 않은 확장 프로그램 허용"** 체크 (Safari 재시작 시마다 필요)
3. Safari 설정 → 확장 프로그램 → Shorts Blocker 켜기 → `youtube.com` 접근 허용

iOS용도 원하면 `--macos-only` 를 빼면 iOS 타깃이 함께 생성됩니다(실기기 설치엔 Apple ID 서명 필요).

## 참고

YouTube가 마크업을 바꾸면 일부 Shorts가 다시 보일 수 있습니다. 그럴 때는
`extension/content.js` 의 `HIDE_SELECTORS` 에 새 셀렉터를 추가하면 됩니다.
