import { animate } from 'motion/mini';
import { inView, stagger } from 'motion';

// Base.astro adds `motion` to <html> before paint (unless the visitor prefers
// reduced motion), which hides the elements below until they animate in.
const root = document.documentElement;
const ease = [0.22, 1, 0.36, 1] as const;
const rise = { opacity: [0, 1], transform: ['translateY(24px)', 'none'] };
const margin = '0px 0px -5% 0px';

// Write the end state inline first: the WAAPI animation plays over it, and
// the element stays visible after it finishes instead of falling back to the
// hidden CSS state.
const settle = (els: Element[], style: Partial<CSSStyleDeclaration>) => {
  els.forEach((el) => Object.assign((el as HTMLElement).style, style));
  return els;
};

// Index numbers count up from zero, keeping their zero padding.
const counters = [...document.querySelectorAll<HTMLElement>('[data-count]')].filter((el) =>
  /^\d+$/.test(el.textContent?.trim() ?? ''),
);
counters.forEach((el) => (el.dataset.count = el.textContent!.trim()));
// Set once the final values are shown (print), so in-flight counts stop.
let countsShown = false;
const showCounts = () => {
  countsShown = true;
  counters.forEach((el) => (el.textContent = el.dataset.count!));
};

const countUp = (el: HTMLElement) => {
  const target = el.dataset.count!;
  const n = Number(target);
  const start = performance.now();
  const step = (now: number) => {
    if (countsShown) return;
    const t = Math.min((now - start) / 800, 1);
    el.textContent = String(Math.round(n * (1 - (1 - t) ** 3))).padStart(target.length, '0');
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// Hovering a project row with a mouse scrambles its name, which then
// resolves left to right. Random letters follow the case of the original.
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = upper.toLowerCase();
const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
const scramble = (el: HTMLElement) => {
  const text = el.textContent ?? '';
  let frame = 0;
  (el.closest('.row') ?? el).addEventListener('pointerenter', (e) => {
    if ((e as PointerEvent).pointerType !== 'mouse') return;
    cancelAnimationFrame(frame);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / 450, 1);
      const done = Math.floor(t * text.length);
      el.textContent = [...text]
        .map((c, i) => (i < done || !/[a-z]/i.test(c) ? c : pick(c === c.toUpperCase() ? upper : lower)))
        .join('');
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  });
};

if (root.classList.contains('motion')) {
  try {
    // Hero: each line of the name slides up from behind its own mask.
    const lines = settle([...document.querySelectorAll('[data-line]')], { transform: 'none' });
    if (lines.length) {
      animate(lines, { transform: ['translateY(105%)', 'none'] }, { duration: 0.9, delay: stagger(0.08), ease });
    }

    // Single blocks fade and rise as they enter the viewport. The callbacks
    // return nothing, so inView unobserves each element after its first entry.
    inView(
      '[data-reveal]',
      (el) => {
        animate(settle([el], { opacity: '1' }), rise, { duration: 0.7, ease });
      },
      { margin },
    );

    // Lists: children stagger in together.
    inView(
      '[data-reveal-group]',
      (group) => {
        animate(settle([...group.children], { opacity: '1' }), rise, { duration: 0.6, delay: stagger(0.07), ease });
      },
      { margin },
    );

    inView('[data-count]', (el) => countUp(el as HTMLElement), { margin });
    document.querySelectorAll<HTMLElement>('[data-scramble]').forEach(scramble);

    // The Tools marquee runs for as long as the page is open, so it needs a
    // pause control (hover also pauses it, via CSS).
    document.querySelectorAll('.marquee-toggle').forEach((btn) =>
      btn.addEventListener('click', () => {
        const paused = btn.closest('.tools')!.classList.toggle('paused');
        btn.textContent = paused ? 'Play' : 'Pause';
        btn.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} scrolling tools`);
      }),
    );

    // Zero the counters last, so a setup error above leaves the real numbers.
    // Printing before a counter has scrolled into view still shows the value.
    counters.forEach((el) => (el.textContent = '0'.padStart(el.dataset.count!.length, '0')));
    addEventListener('beforeprint', showCounts);

    // Only now tell Base.astro's 3s fallback that the reveals are wired up.
    (window as any).__motionReady = true;
  } catch (err) {
    // Never leave content hidden because an animation failed to set up.
    root.classList.remove('motion');
    showCounts();
    console.error(err);
  }
}
