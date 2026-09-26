/** Fills every [data-clock] with the current time in Honolulu (HST, no DST). */
export function initClock() {
  const els = document.querySelectorAll<HTMLTimeElement>('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Pacific/Honolulu',
    hour: 'numeric',
    minute: '2-digit',
  });
  const tick = () => {
    const now = new Date();
    const text = `${fmt.format(now)} HST`;
    els.forEach((el) => {
      el.textContent = text;
      el.dateTime = now.toISOString();
    });
  };
  tick();
  window.setInterval(tick, 30_000);
}
