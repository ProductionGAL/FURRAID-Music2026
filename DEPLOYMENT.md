# Python 서버

Python 3.12 이상과 [uv](https://docs.astral.sh/uv/getting-started/installation/)를 사용합니다.

```sh
uv sync --locked --no-dev
cp .env.example .env
```

`.env`의 `FR2026_REDIRECT_URL`에 이동할 HTTPS 주소를 입력합니다.
공개 시각은 `FR2026_RELEASE_AT=2026-10-11T17:00:00+09:00`입니다.
`.env`는 Git에서 제외되며 서버에서만 보관합니다.

```sh
uv run --no-dev uvicorn server.app:create_app --factory --host 127.0.0.1 --port 8000
```

로컬에서 `http://127.0.0.1:8000`으로 확인할 수 있습니다.
운영 서버에서는 위 프로세스를 systemd 같은 서비스 관리자로 계속 실행하고,
HTTPS 웹 서버가 `music.furraid.kr`의 요청을 Python 서버로 전달하게 설정합니다.
서버 시계는 운영체제의 시간 동기화 기능으로 유지합니다.
`/`, `/index.html`, `/go`, `/api/release` 응답은 캐시하지 않습니다.
웹 서버에서도 이 경로의 응답을 캐시하거나 정적 `index.html`을 직접 제공하지 않습니다.

공개 전 홈페이지는 카운트다운을 표시하고 `/go`는 홈페이지로 돌려보냅니다.
공개 시각부터 홈페이지와 `/go`는 서버 설정의 목적지로 HTTP 302 이동합니다.
열린 탭은 서버를 주기적으로 확인한 뒤 `/go`로 이동합니다.
외부 목적지 주소를 이미 아는 방문자의 직접 접속은 차단하지 않습니다.

GitHub는 소스 보관에 사용합니다. 기존 GitHub Pages는 Python을 실행하지 않으므로
도메인을 Python 서버로 연결하기 전에는 기존 공개 예정 화면이 계속 표시됩니다.

검증:

```sh
uv run pytest
uv run basedpyright
uv run ruff check
uv run ruff format --check
```
