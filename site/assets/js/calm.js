// Respect user preference by defaulting to reduced motion when requested.
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) document.documentElement.classList.add('reduced-motion');
document.getElementById('calmToggle')?.addEventListener('click', () => {
  const active = document.documentElement.classList.toggle('reduced-motion');
  document.getElementById('calmToggle').setAttribute('aria-pressed', String(active));
});
