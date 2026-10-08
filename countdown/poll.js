export function startCountdown(onStatus) {
  let timer;
  let inFlight = false;

  async function refresh() {
    if (inFlight || document.hidden) return;
    clearTimeout(timer);
    inFlight = true;
    try {
      const response = await fetch("/api/release", {
        cache: "no-store", signal: AbortSignal.timeout(5000), redirect: "error",
      });
      if (!response.ok) throw new Error("Countdown unavailable");
      const status = await response.json();
      if (!Number.isSafeInteger(status.remaining_seconds) || status.remaining_seconds < 0
        || typeof status.released !== "boolean" || typeof status.release_at !== "string"
        || !Number.isFinite(Date.parse(status.release_at))) {
        throw new Error("Invalid countdown response");
      }
      if (status.released) window.location.replace("/go");
      else onStatus(status);
    } catch {
      onStatus(null);
    } finally {
      inFlight = false;
      if (!document.hidden) timer = setTimeout(refresh, 1000);
    }
  }

  document.addEventListener("visibilitychange", () => {
    clearTimeout(timer);
    if (!document.hidden) refresh();
  });
  refresh();
}
