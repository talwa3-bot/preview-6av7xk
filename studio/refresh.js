(() => {
  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduced-motion');
  // count the firm figures once, when they come into view
  const band = document.querySelector('.firm-figures');
  const count = () => {
    if (calm()) return;
    band.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count, t0 = performance.now(), d = 1400;
      const step = t => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };
  if (band && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { count(); io.disconnect(); } }, { threshold: .5 });
    io.observe(band);
  }
  // portraits lean slightly toward the pointer
  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('#partners .portrait').forEach(p => {
      p.addEventListener('pointermove', e => {
        if (calm()) return;
        const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        p.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg'); p.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      });
      p.addEventListener('pointerleave', () => { p.style.setProperty('--rx', '0deg'); p.style.setProperty('--ry', '0deg'); });
    });
  }
})();
