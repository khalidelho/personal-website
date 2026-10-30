// Runs inline in <head> before first paint (Base.astro). astro.config.mjs hashes this exact
// string into the Content-Security-Policy, so edit it here, not in the built page.
export const boot = `
// Apply a saved theme choice before paint (no flash of the wrong theme).
try {
  const t = localStorage.getItem('theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch {}
// Opt into entrance animations before first paint. If the animation
// script hasn't run within 3s, drop the class so nothing stays hidden.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion');
  setTimeout(() => {
    if (!window.__motionReady) document.documentElement.classList.remove('motion');
  }, 3000);
}
`;
