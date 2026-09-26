/**
 * Motion engine — GSAP + ScrollTrigger + SplitText, with Lenis smooth scrolling
 * on precise pointers only. Every effect is opt-in through data attributes so
 * pages stay declarative:
 *
 *   data-split              masked line reveal for headings
 *   data-reveal[=fade|left] fade/slide in on enter
 *   data-stagger            children reveal in sequence
 *   data-clip[=left|center] clip-path image reveal (+ inner image settle)
 *   data-parallax="0.2"     scroll-linked drift (fraction of height)
 *   data-scrub-words        words light up as you read (scrubbed)
 *   data-draw               SVG paths draw themselves on scroll
 *   data-count              numbers count up when visible
 *   data-line               hairlines grow from the left
 *   data-horizontal         pinned horizontal panorama (≥1024px)
 *   data-magnetic           pointer-pull on buttons
 *   data-hero               children animate on load instead of on scroll
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

declare global {
  interface Window {
    __thaMotion?: boolean;
  }
}

const EASE = 'expo.out';

export async function initMotion() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  window.__thaMotion = true;

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const inHero = (el: Element) => Boolean(el.closest('[data-hero]'));
  const heroDelay = 0.15;

  /* -------------------------------------------------------- smooth scroll */
  if (fine) {
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: { offset: -90 }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.addEventListener('tha:scroll-lock', (e) => ((e as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start()));
  }

  /* -------------------------------------------------------- hero (on load) */
  const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero] [data-hero-item]');
  if (heroItems.length) {
    gsap.to(heroItems, { opacity: 1, y: 0, x: 0, duration: 1.2, ease: EASE, stagger: 0.08, delay: 0.55 });
  }

  /* -------------------------------------------------------- reveals */
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter((el) => !el.hasAttribute('data-hero-item'));
  reveals.forEach((el) => {
    const tween = { opacity: 1, x: 0, y: 0, duration: 1.1, ease: EASE, delay: Number(el.dataset.delay ?? 0) };
    if (inHero(el)) gsap.to(el, { ...tween, delay: heroDelay + 0.5 + tween.delay });
    else gsap.to(el, { ...tween, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
    gsap.to(el.children, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: EASE,
      stagger: Number(el.dataset.stagger || 0.08),
      scrollTrigger: inHero(el) ? undefined : { trigger: el, start: 'top 88%', once: true },
      delay: inHero(el) ? heroDelay + 0.6 : 0,
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => {
    gsap.to(el, {
      scaleX: 1,
      duration: 1.4,
      ease: 'expo.inOut',
      scrollTrigger: inHero(el) ? undefined : { trigger: el, start: 'top 92%', once: true },
      delay: inHero(el) ? heroDelay + 0.3 : 0,
    });
  });

  /* -------------------------------------------------------- image clips */
  gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({
      scrollTrigger: inHero(el) ? undefined : { trigger: el, start: 'top 85%', once: true },
      delay: inHero(el) ? heroDelay + 0.2 : 0,
    });
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0% round var(--clip-radius, 0px))', duration: 1.6, ease: 'expo.inOut' });
    // Explicit set → to (not .from): a refresh can never leave the image zoomed, and the
    // transform is cleared at the end so the full image shows and CSS hover effects take over.
    if (img) {
      gsap.set(img, { scale: 1.2 });
      tl.to(img, { scale: 1, duration: 2, ease: EASE, clearProps: 'transform' }, 0);
    }
  });

  /* -------------------------------------------------------- parallax */
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 0.15) * 100;
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  /* -------------------------------------------------------- SVG draw */
  gsap.utils.toArray<SVGSVGElement>('[data-draw]').forEach((svg) => {
    const paths = svg.querySelectorAll<SVGPathElement>('path');
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: {
        trigger: svg.closest('[data-draw-trigger]') ?? svg,
        start: 'top 85%',
        end: 'bottom 30%',
        scrub: 1.2,
      },
    });
  });

  /* -------------------------------------------------------- counters */
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const raw = el.textContent ?? '';
    const m = raw.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const grouping = num.includes(',');
    const obj = { v: 0 };
    el.textContent = `${pre}0${post}`;
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = `${pre}${obj.v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouping })}${post}`;
      },
    });
  });

  /* -------------------------------------------------------- horizontal */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    gsap.utils.toArray<HTMLElement>('[data-horizontal]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('[data-horizontal-track]');
      const progress = section.querySelector<HTMLElement>('[data-horizontal-progress]');
      if (!track) return;
      const distance = () => track.scrollWidth - track.clientWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => progress && gsap.set(progress, { scaleX: self.progress }),
        },
      });
    });
  });

  /* -------------------------------------------------------- magnetic */
  if (fine) {
    gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      el.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* -------------------------------------------------------- text (after fonts) */
  await document.fonts.ready;

  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    const hero = inHero(el);
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.25,
          ease: EASE,
          stagger: 0.09,
          delay: hero ? heroDelay + Number(el.dataset.delay ?? 0) : 0,
          scrollTrigger: hero ? undefined : { trigger: el, start: 'top 90%', once: true },
        });
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'scrub-word' });
    gsap.fromTo(
      split.words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true },
      },
    );
  });

  // Images and fonts can change layout; recalculate trigger positions once settled.
  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
}
