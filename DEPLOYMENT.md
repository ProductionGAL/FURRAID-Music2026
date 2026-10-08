# 공개 방법

GitHub Pages의 `main` 브랜치, `/ (root)`를 사용합니다. 별도 서버는 필요 없습니다.

`site-config.js`의 `redirectUrl`이 비어 있으면 공개 예정 화면을 표시합니다.
공개할 때 이동할 HTTPS 주소를 입력하고 `main`에 푸시하세요.

```js
redirectUrl: "https://example.com/release",
```

GitHub 웹사이트에서 `site-config.js`를 편집하고 **Commit changes**를 눌러도 됩니다.
**Actions → pages build and deployment**가 완료되면 새로 방문하거나 새로고침한
사용자부터 설정한 주소로 이동합니다. 배포는 즉시 끝나지 않을 수 있습니다.

다시 공개 예정 화면으로 바꾸려면 `redirectUrl`을 빈 문자열로 돌리고 푸시하세요.
자동 이동에는 JavaScript가 필요합니다.
