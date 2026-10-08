import { locales } from "./locales.js";
import { startCountdown } from "./poll.js";

const languageControl = document.getElementById("language-control");
const trigger = document.getElementById("language-trigger");
const menu = document.getElementById("language-menu");
const options = [...menu.querySelectorAll("button")];
const storageKey = "fr2026-language";
let preference = "auto";
let language = "ko";
let status;

try {
  const saved = localStorage.getItem(storageKey);
  if (Object.hasOwn(locales, saved)) preference = saved;
} catch {
  preference = "auto";
}

function renderCountdown() {
  const copy = locales[language];
  const seconds = status?.remaining_seconds;
  const values = seconds === undefined ? null : {
    days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60,
  };
  for (const element of document.querySelectorAll("[data-value]")) {
    element.textContent = values ? String(values[element.dataset.value]).padStart(2, "0") : "--";
  }
  document.getElementById("countdown-message").textContent = status === undefined
    ? copy.checking : status === null ? copy.retrying : "";
  document.getElementById("countdown-retry").textContent = copy.retry;
  document.getElementById("countdown-retry").hidden = status !== null;
  const releaseTime = document.getElementById("release-time");
  if (status) releaseTime.dateTime = status.release_at;
  releaseTime.textContent = `${new Intl.DateTimeFormat(language, {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(releaseTime.dateTime))} · ${copy.koreaTime}`;
}

function applyLanguage() {
  const browserLanguage = (navigator.languages.length ? navigator.languages : [navigator.language])
    .map(value => value.toLowerCase().split("-")[0]).find(value => Object.hasOwn(locales, value));
  language = preference === "auto" ? browserLanguage || "en" : preference;
  const copy = locales[language];
  document.documentElement.lang = language;
  document.title = copy.pageTitle;
  document.querySelector('meta[name="description"]').content = copy.collaboration + ". " + copy.title;
  document.getElementById("coming-soon-title").textContent = copy.title;
  document.getElementById("collaboration").setAttribute("aria-label", copy.collaboration);
  document.getElementById("countdown").setAttribute("aria-label", copy.countdown);
  document.getElementById("language-current").textContent = copy.nativeName;
  trigger.setAttribute("aria-label", `${copy.language}: ${copy.nativeName}`);
  menu.setAttribute("aria-label", copy.language);
  for (const option of options) option.setAttribute("aria-checked", String(option.dataset.language === language));
  for (const label of document.querySelectorAll("[data-label]")) label.textContent = copy[label.dataset.label];
  renderCountdown();
}

function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) trigger.focus();
}

function openMenu(option = menu.querySelector('[aria-checked="true"]')) {
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  option.focus({ preventScroll: true });
}

trigger.addEventListener("click", () => menu.hidden ? openMenu() : closeMenu());
trigger.addEventListener("keydown", event => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    openMenu(event.key === "ArrowUp" ? options.at(-1) : options[0]);
  }
});
for (const option of options) {
  option.addEventListener("click", () => {
    preference = option.dataset.language;
    applyLanguage();
    closeMenu(true);
    try { localStorage.setItem(storageKey, preference); } catch { return; }
  });
}
menu.addEventListener("keydown", event => {
  const index = options.indexOf(document.activeElement);
  let next;
  if (event.key === "ArrowDown") next = (index + 1) % options.length;
  if (event.key === "ArrowUp") next = (index - 1 + options.length) % options.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = options.length - 1;
  if (next !== undefined) { event.preventDefault(); options[next].focus(); }
  if (event.key === "Escape") { event.preventDefault(); closeMenu(true); }
  if (event.key === "Tab") closeMenu(true);
});
document.addEventListener("pointerdown", event => {
  if (!languageControl.contains(event.target)) closeMenu();
});
languageControl.addEventListener("focusout", event => {
  if (!languageControl.contains(event.relatedTarget)) closeMenu();
});
window.addEventListener("languagechange", applyLanguage);

const video = document.getElementById("background-video");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function syncVideo() {
  if (reducedMotion.matches) video.pause();
  else video.play().catch(() => {});
}
reducedMotion.addEventListener("change", syncVideo);
syncVideo();
applyLanguage();
languageControl.hidden = false;
startCountdown(value => { status = value; renderCountdown(); });
