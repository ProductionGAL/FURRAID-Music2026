from datetime import datetime, timedelta
from typing import Final

import pytest
from fastapi.testclient import TestClient
from pydantic import HttpUrl, ValidationError

from server.app import DestinationRequiredError, ReleaseStatus, create_app
from server.settings import Settings

RELEASE_AT: Final = datetime.fromisoformat("2026-10-11T17:00:00+09:00")
DESTINATION: Final = "https://example.invalid/release"


@pytest.mark.parametrize("path", ["/", "/index.html", "/go"])
@pytest.mark.parametrize("method", ["GET", "HEAD"])
@pytest.mark.parametrize("offset", [-1, 0, 1])
def test_redirect_obeys_server_boundary(path: str, method: str, offset: int) -> None:
    settings = Settings(release_at=RELEASE_AT, redirect_url=HttpUrl(DESTINATION))
    now = RELEASE_AT + timedelta(microseconds=offset)
    with TestClient(create_app(settings, clock=lambda: now)) as client:
        response = client.request(method, path, follow_redirects=False)

    if offset >= 0:
        assert response.status_code == 302
        assert response.headers["location"] == DESTINATION
    elif path == "/go":
        assert response.status_code == 302
        assert response.headers["location"] == "/"
    else:
        assert response.status_code == 200
        assert "location" not in response.headers
    assert response.headers["cache-control"] == "no-store"


@pytest.mark.parametrize("offset", [-1, 0, 1])
def test_status_matches_boundary_without_destination(offset: int) -> None:
    settings = Settings(release_at=RELEASE_AT, redirect_url=HttpUrl(DESTINATION))
    now = RELEASE_AT + timedelta(microseconds=offset)
    with TestClient(create_app(settings, clock=lambda: now)) as client:
        response = client.get("/api/release")

    status = ReleaseStatus.model_validate_json(response.content)
    assert status.released == (offset >= 0)
    assert status.remaining_seconds == (1 if offset < 0 else 0)
    assert status.release_at == RELEASE_AT
    assert DESTINATION not in response.text
    assert response.headers["cache-control"] == "no-store"


def test_client_time_and_destination_overrides_cannot_open_redirect() -> None:
    settings = Settings(release_at=RELEASE_AT, redirect_url=HttpUrl(DESTINATION))
    now = RELEASE_AT - timedelta(seconds=30)
    with TestClient(create_app(settings, clock=lambda: now)) as client:
        response = client.get(
            "/go?released=true&now=2099-01-01&url=https://other.invalid",
            headers={"Date": "Thu, 01 Jan 2099 00:00:00 GMT", "X-Release-Time": "0"},
            follow_redirects=False,
        )

    assert response.headers["location"] == "/"


@pytest.mark.parametrize(
    "path", ["/.env", "/server/app.py", "/pyproject.toml", "/countdown/index.html"]
)
def test_private_files_are_not_served(path: str) -> None:
    settings = Settings(release_at=RELEASE_AT, redirect_url=HttpUrl(DESTINATION))
    with TestClient(create_app(settings)) as client:
        response = client.get(path)

    assert response.status_code == 404


def test_missing_destination_prevents_server_start() -> None:
    with pytest.raises(DestinationRequiredError):
        _ = create_app(Settings(redirect_url=None))


def test_naive_release_time_is_rejected() -> None:
    with pytest.raises(ValidationError):
        _ = Settings(release_at=RELEASE_AT.replace(tzinfo=None))
