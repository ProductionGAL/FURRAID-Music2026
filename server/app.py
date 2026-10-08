"""Serve a countdown until the server clock permits an external redirect."""

from collections.abc import Callable
from datetime import UTC, datetime
from math import ceil
from typing import ClassVar

from fastapi import FastAPI, Response
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import AwareDatetime, BaseModel, ConfigDict

from server.settings import ROOT, Settings


class DestinationRequiredError(RuntimeError):
    """The server cannot start without a configured destination."""


class ReleaseStatus(BaseModel):
    """Public countdown information, deliberately excluding the destination."""

    model_config: ClassVar[ConfigDict] = ConfigDict(frozen=True)

    release_at: AwareDatetime
    remaining_seconds: int
    released: bool


def server_time() -> datetime:
    """Read the server's UTC wall clock for each request."""
    return datetime.now(UTC)


def create_app(
    settings: Settings | None = None,
    clock: Callable[[], datetime] = server_time,
) -> FastAPI:
    """Construct the HTTP app with a server-owned clock and configuration."""
    config = settings if settings is not None else Settings()
    destination = config.redirect_url
    if destination is None:
        message = "Set FR2026_REDIRECT_URL in the server environment or .env file."
        raise DestinationRequiredError(message)

    app = FastAPI(
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )

    @app.api_route("/", methods=["GET", "HEAD"], response_model=None)
    @app.api_route("/index.html", methods=["GET", "HEAD"], response_model=None)
    def homepage() -> Response:
        if clock() >= config.release_at:
            return RedirectResponse(
                str(destination), status_code=302, headers={"Cache-Control": "no-store"}
            )
        return FileResponse(
            ROOT / "server" / "templates" / "countdown.html",
            headers={"Cache-Control": "no-store"},
        )

    @app.api_route("/go", methods=["GET", "HEAD"])
    def redirect() -> RedirectResponse:
        url = str(destination) if clock() >= config.release_at else "/"
        return RedirectResponse(
            url, status_code=302, headers={"Cache-Control": "no-store"}
        )

    @app.get("/api/release")
    def release_status(response: Response) -> ReleaseStatus:
        remaining = (config.release_at - clock()).total_seconds()
        response.headers["Cache-Control"] = "no-store"
        return ReleaseStatus(
            release_at=config.release_at,
            remaining_seconds=max(0, ceil(remaining)),
            released=remaining <= 0,
        )

    @app.get("/styles.css")
    def styles() -> FileResponse:
        return FileResponse(ROOT / "styles.css")

    @app.get("/favicon.ico")
    def favicon() -> FileResponse:
        return FileResponse(ROOT / "favicon.ico")

    app.mount("/countdown", StaticFiles(directory=ROOT / "countdown"))
    app.mount("/assets", StaticFiles(directory=ROOT / "assets"))
    return app
