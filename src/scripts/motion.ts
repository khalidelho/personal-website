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

    // Only now tell Base.astro's 3s fallback that the reveals are wired up.
    (window as any).__motionReady = true;
  } catch (err) {
    // Never leave content hidden because an animation failed to set up.
    root.classList.remove('motion');
    console.error(err);
  }
}
