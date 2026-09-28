const config = window.siteConfig;
const comingSoon = config.comingSoon !== false;
const backgroundVideo = document.getElementById("background-video");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function syncBackgroundVideo() {
  if (reducedMotion.matches) backgroundVideo.pause();
  else backgroundVideo.play().catch(() => {});
}

reducedMotion.addEventListener("change", syncBackgroundVideo);
syncBackgroundVideo();

document.getElementById("title").textContent = config.title;

const list = document.getElementById("stream-list");
const template = document.getElementById("stream-row");
const languageControl = document.getElementById("language-control");
const languageTrigger = document.getElementById("language-trigger");
const languageMenu = document.getElementById("language-menu");
const languageOptions = [...languageMenu.querySelectorAll("button")];
const languageStorageKey = "fr2026-language";
let languagePreference = "auto";

try {
  const saved = localStorage.getItem(languageStorageKey);
  if (Object.hasOwn(config.locales, saved)) languagePreference = saved;
} catch {
  languagePreference = "auto";
}

function applyLanguage() {
  const browserLanguage = (navigator.languages.length ? navigator.languages : [navigator.language])
    .map((language) => language.toLowerCase().split("-")[0])
    .find((language) => Object.hasOwn(config.locales, language));
  const language = languagePreference === "auto" ? browserLanguage || "en" : languagePreference;
  const copy = config.locales[language];

  document.documentElement.lang = language;
  document.title = comingSoon ? copy.comingSoonPageTitle : copy.pageTitle;
  document.querySelector('meta[name="description"]').content = comingSoon
    ? copy.comingSoonTitle
    : copy.description.replace(/\n/g, " ");
  document.getElementById("coming-soon-title").textContent = copy.comingSoonTitle;
  for (const collaboration of document.querySelectorAll(".collaboration")) {
    collaboration.setAttribute("aria-label", copy.collaboration);
  }
  document.getElementById("eyebrow").textContent = copy.eyebrow;
  document.getElementById("description").textContent = copy.description;
  document.getElementById("language-current").textContent = copy.nativeName;
  languageTrigger.setAttribute("aria-label", `${copy.language}: ${copy.nativeName}`);
  languageMenu.setAttribute("aria-label", copy.language);
  for (const option of languageOptions) {
    option.setAttribute("aria-checked", String(option.dataset.language === language));
  }
  document.getElementById("stream-section").setAttribute("aria-label", copy.services);
  document.getElementById("spotify-player").setAttribute("aria-label", copy.player);
  const iframe = document.querySelector("#spotify-player iframe");
  if (iframe) iframe.title = copy.player;
  for (const status of list.querySelectorAll(".is-unpublished .stream-status")) {
    status.textContent = copy.upcoming;
  }
  const empty = list.querySelector(".empty");
  if (empty) empty.textContent = copy.empty;
}

function closeLanguageMenu(restoreFocus = false) {
  languageMenu.hidden = true;
  languageTrigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) languageTrigger.focus();
}

function openLanguageMenu(option = languageMenu.querySelector('[aria-checked="true"]')) {
  languageMenu.hidden = false;
  languageTrigger.setAttribute("aria-expanded", "true");
  option.focus({ preventScroll: true });
}

languageTrigger.addEventListener("click", () => {
  if (languageMenu.hidden) openLanguageMenu();
  else closeLanguageMenu();
});
languageTrigger.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    openLanguageMenu(event.key === "ArrowUp" ? languageOptions.at(-1) : languageOptions[0]);
  }
});
for (const option of languageOptions) {
  option.addEventListener("click", () => {
    languagePreference = option.dataset.language;
    applyLanguage();
    closeLanguageMenu(true);
    try {
      localStorage.setItem(languageStorageKey, languagePreference);
    } catch {
      return;
    }
  });
}
languageMenu.addEventListener("keydown", (event) => {
  const index = languageOptions.indexOf(document.activeElement);
  let next;
  if (event.key === "ArrowDown") next = (index + 1) % languageOptions.length;
  if (event.key === "ArrowUp") next = (index - 1 + languageOptions.length) % languageOptions.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = languageOptions.length - 1;
  if (next !== undefined) {
    event.preventDefault();
    languageOptions[next].focus();
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeLanguageMenu(true);
  }
  if (event.key === "Tab") closeLanguageMenu(true);
});
document.addEventListener("pointerdown", (event) => {
  if (!languageControl.contains(event.target)) closeLanguageMenu();
});
languageControl.addEventListener("focusout", (event) => {
  if (!languageControl.contains(event.relatedTarget)) closeLanguageMenu();
});
window.addEventListener("languagechange", applyLanguage);

function spotifyEmbedUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "open.spotify.com") return null;
    const match = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(?:embed\/)?(track|album)\/([A-Za-z0-9]{22})\/?$/);
    return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
  } catch {
    return null;
  }
}

function renderRelease() {
  const embedUrl = spotifyEmbedUrl(config.spotifyPlayerUrl);
  if (embedUrl) {
    const player = document.getElementById("spotify-player");
    const iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    iframe.title = "Spotify 음원 플레이어";
    iframe.width = "100%";
    iframe.height = "152";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    player.append(iframe);
    player.hidden = false;
  }

  for (const stream of config.streams) {
    const fragment = template.content.cloneNode(true);
    const row = fragment.querySelector(".stream-row");
    const icon = fragment.querySelector(".stream-icon");
    if (stream.icon) {
      icon.querySelector("img").src = stream.icon;
    } else {
      icon.remove();
    }
    fragment.querySelector(".stream-name").textContent = stream.name;
    const status = fragment.querySelector(".stream-status");
    let destination;

    try {
      const url = new URL(stream.url);
      if (url.protocol === "https:" || url.protocol === "http:") destination = url;
    } catch {
      destination = undefined;
    }

    if (destination) {
      const link = document.createElement("a");
      link.className = row.className;
      link.href = destination.href;
      status.textContent = destination.hostname;
      link.append(...row.childNodes);
      row.replaceWith(link);
    } else {
      row.classList.add("is-unpublished");
      row.querySelector(".arrow").remove();
    }

    list.append(fragment);
  }

  if (config.streams.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    list.append(empty);
  }
}

if (!comingSoon) renderRelease();
applyLanguage();
document.querySelector("main").classList.toggle("is-coming-soon", comingSoon);
document.getElementById("release-content").hidden = comingSoon;
document.getElementById("coming-soon").hidden = !comingSoon;
languageControl.hidden = false;
