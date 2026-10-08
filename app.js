function initializeSite() {
  const config = window.siteConfig;
  try {
    const destination = new URL(config.redirectUrl);
    if (destination.protocol === "https:" && destination.href !== window.location.href) {
      window.location.replace(destination.href);
      return;
    }
  } catch {}

  const backgroundVideo = document.getElementById("background-video");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function syncBackgroundVideo() {
    if (reducedMotion.matches) backgroundVideo.pause();
    else backgroundVideo.play().catch(() => {});
  }
  reducedMotion.addEventListener("change", syncBackgroundVideo);
  syncBackgroundVideo();

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
      .map(language => language.toLowerCase().split("-")[0])
      .find(language => Object.hasOwn(config.locales, language));
    const language = languagePreference === "auto" ? browserLanguage || "en" : languagePreference;
    const copy = config.locales[language];
    document.documentElement.lang = language;
    document.title = copy.comingSoonPageTitle;
    document.querySelector('meta[name="description"]').content = copy.comingSoonTitle;
    document.getElementById("coming-soon-title").textContent = copy.comingSoonTitle;
    document.getElementById("collaboration").setAttribute("aria-label", copy.collaboration);
    document.getElementById("language-current").textContent = copy.nativeName;
    languageTrigger.setAttribute("aria-label", `${copy.language}: ${copy.nativeName}`);
    languageMenu.setAttribute("aria-label", copy.language);
    for (const option of languageOptions) {
      option.setAttribute("aria-checked", String(option.dataset.language === language));
    }
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
  languageTrigger.addEventListener("keydown", event => {
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
      try { localStorage.setItem(languageStorageKey, languagePreference); } catch { return; }
    });
  }
  languageMenu.addEventListener("keydown", event => {
    const index = languageOptions.indexOf(document.activeElement);
    let next;
    if (event.key === "ArrowDown") next = (index + 1) % languageOptions.length;
    if (event.key === "ArrowUp") next = (index - 1 + languageOptions.length) % languageOptions.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = languageOptions.length - 1;
    if (next !== undefined) { event.preventDefault(); languageOptions[next].focus(); }
    if (event.key === "Escape") { event.preventDefault(); closeLanguageMenu(true); }
    if (event.key === "Tab") closeLanguageMenu(true);
  });
  document.addEventListener("pointerdown", event => {
    if (!languageControl.contains(event.target)) closeLanguageMenu();
  });
  languageControl.addEventListener("focusout", event => {
    if (!languageControl.contains(event.relatedTarget)) closeLanguageMenu();
  });
  window.addEventListener("languagechange", applyLanguage);
  applyLanguage();
  languageControl.hidden = false;
}

initializeSite();
