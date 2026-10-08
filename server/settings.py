"""Parse deployment settings without exposing the destination to the client."""

from datetime import datetime
from pathlib import Path
from typing import ClassVar, Final

from pydantic import AwareDatetime, HttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT: Final = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Immutable, server-only release configuration."""

    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        frozen=True,
        env_prefix="FR2026_",
        env_file=ROOT / ".env",
        env_ignore_empty=True,
        extra="forbid",
    )

    release_at: AwareDatetime = datetime.fromisoformat("2026-10-11T17:00:00+09:00")
    redirect_url: HttpUrl | None = None
