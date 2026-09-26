/**
 * Cursor-following image preview for index lists ([data-hover-preview]).
 * Each item carries data-preview-src; the floating figure is purely
 * decorative (aria-hidden) — the links themselves carry all meaning.
 */
export function initPreviews() {
  const lists = document.querySelectorAll<HTMLElement>('[data-hover-preview]');
  if (!lists.length) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  lists.forEach((list) => {
    const fig = list.querySelector<HTMLElement>('[data-preview-figure]');
    if (!fig) return;
    const imgs = fig.querySelectorAll<HTMLElement>('[data-preview-key]');
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf = 0,
      active = false;

    const loop = () => {
      const k = reduce.matches ? 1 : 0.14;
      x += (tx - x) * k;
      y += (ty - y) * k;
      const rot = reduce.matches ? 0 : Math.max(-6, Math.min(6, (tx - x) * 0.04));
      fig.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
      raf = active ? requestAnimationFrame(loop) : 0;
    };

    list.addEventListener('pointermove', (e) => {
      if (!fine.matches) return;
      const r = list.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!active) {
        active = true;
        x = tx;
        y = ty;
        raf = requestAnimationFrame(loop);
      }
    });
    list.addEventListener('pointerleave', () => {
      active = false;
      fig.classList.remove('is-visible');
      cancelAnimationFrame(raf);
    });
    list.querySelectorAll<HTMLElement>('[data-preview-item]').forEach((item) => {
      item.addEventListener('pointerenter', () => {
        if (!fine.matches) return;
        fig.classList.add('is-visible');
        imgs.forEach((img) => img.classList.toggle('is-active', img.dataset.previewKey === item.dataset.previewItem));
      });
    });
  });
}
