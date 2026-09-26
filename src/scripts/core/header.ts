/** Header scroll states, services panel (disclosure) and the mobile menu dialog. */

const FOCUSABLE = 'a[href], button:not([disabled]), summary, input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  /* ---------------------------------------------------- scroll state */
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > 240) header.classList.add('is-hidden');
    else if (goingUp || y < 240) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true },
  );
  onScroll();
  // Keyboard users tabbing into a hidden header should see it.
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  /* ---------------------------------------------------- services panel */
  const panel = header.querySelector<HTMLElement>('[data-panel]');
  const toggle = header.querySelector<HTMLButtonElement>('[data-panel-toggle]');
  const panelRoot = header.querySelector<HTMLElement>('[data-panel-root]');
  if (panel && toggle && panelRoot) {
    let closeTimer: number | undefined;
    const setOpen = (open: boolean) => {
      window.clearTimeout(closeTimer);
      if (open === !panel.hidden) return;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      header.classList.toggle('panel-open', open);
    };
    toggle.addEventListener('click', () => setOpen(Boolean(panel.hidden)));

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const scheduleClose = () => {
      closeTimer = window.setTimeout(() => setOpen(false), 220);
    };
    [panelRoot, panel].forEach((el) => {
      el.addEventListener('pointerenter', () => canHover.matches && setOpen(true));
      el.addEventListener('pointerleave', () => canHover.matches && scheduleClose());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!panel.hidden && !header.contains(e.target as Node)) setOpen(false);
    });
    panel.addEventListener('focusout', (e) => {
      const next = e.relatedTarget as Node | null;
      if (next && !panel.contains(next) && !panelRoot.contains(next)) setOpen(false);
    });

    // preview image follows the hovered/focused link
    const imgs = panel.querySelectorAll<HTMLElement>('[data-preview-img]');
    panel.querySelectorAll<HTMLElement>('[data-preview]').forEach((link) => {
      const show = () => imgs.forEach((img) => img.classList.toggle('is-active', img.dataset.previewImg === link.dataset.preview));
      link.addEventListener('pointerenter', show);
      link.addEventListener('focus', show);
    });
  }

  /* ---------------------------------------------------- mobile menu */
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const openBtn = header.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeBtn = menu?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (menu && openBtn && closeBtn) {
    const siblings = () => [...document.body.children].filter((el) => el !== menu && el.tagName !== 'SCRIPT') as HTMLElement[];
    const open = () => {
      menu.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      siblings().forEach((el) => el.setAttribute('inert', ''));
      window.dispatchEvent(new CustomEvent('tha:scroll-lock', { detail: true }));
      requestAnimationFrame(() => closeBtn.focus());
    };
    const close = (restoreFocus = true) => {
      if (menu.hidden) return;
      menu.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      siblings().forEach((el) => el.removeAttribute('inert'));
      window.dispatchEvent(new CustomEvent('tha:scroll-lock', { detail: false }));
      if (restoreFocus) openBtn.focus();
    };
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', () => close());
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const items = [...menu.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    // Close before navigating so the page underneath is interactive again.
    menu.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link) close(false);
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && close(false));
  }
}
