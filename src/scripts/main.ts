/**
 * Entry point for all pages. Core behaviour is tiny and always runs;
 * the motion engine (GSAP + ScrollTrigger + Lenis) is code-split and only
 * loaded when the visitor has not requested reduced motion.
 */
import { initHeader } from './core/header';
import { initClock } from './core/clock';
import { initForms } from './core/form';
import { initPreviews } from './core/preview';

initHeader();
initClock();
initForms();
initPreviews();

const root = document.documentElement;
if (root.classList.contains('motion')) {
  import('./motion')
    .then(({ initMotion }) => initMotion())
    .catch((err) => {
      console.warn('[motion] disabled:', err);
      root.classList.remove('motion');
    });
}
