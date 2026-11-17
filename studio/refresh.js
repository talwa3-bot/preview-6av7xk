(() => {
  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduced-motion');
  const fine = matchMedia('(pointer:fine)').matches;

  // header lifts once the page scrolls
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // figures count up once, when they come into view
  const band = document.querySelector('.firm-figures');
  const count = () => {
    if (calm()) return;
    band.querySelectorAll('[data-count]').forEach(el => {
      const to = +el.dataset.count, t0 = performance.now(), d = 1500;
      const step = t => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  };
  if (band && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { count(); io.disconnect(); } }, { threshold: .5 });
    io.observe(band);
  }

  // a soft light follows the pointer across the department tiles
  document.querySelectorAll('[data-spot]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    el.addEventListener('pointerleave', () => { el.style.removeProperty('--mx'); el.style.removeProperty('--my'); });
  });

  // portraits lean toward the pointer on desktop
  if (fine) {
    document.querySelectorAll('#partners .portrait').forEach(p => {
      p.addEventListener('pointermove', e => {
        if (calm()) return;
        const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        p.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg'); p.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      });
      p.addEventListener('pointerleave', () => { p.style.setProperty('--rx', '0deg'); p.style.setProperty('--ry', '0deg'); });
    });
  }

  // on touch screens, portraits turn to colour when they reach the middle of the screen
  if (!fine && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => en.target.classList.toggle('in-view', en.isIntersecting)), { rootMargin: '-30% 0px -30% 0px' });
    document.querySelectorAll('#partners .partner-card').forEach(c => io.observe(c));
  }
})();

(() => {
  // "who are you?": highlights matching departments and presses the existing client filter below
  const chips = [...document.querySelectorAll('.persona-chip')], tiles = document.querySelector('.hero-departments');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const on = chip.getAttribute('aria-pressed') !== 'true', who = chip.dataset.client;
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', String(on));
    if (tiles) {
      tiles.classList.toggle('filtered', on);
      tiles.querySelectorAll('.dept-tile').forEach(t => t.classList.toggle('match', on && (t.dataset.for || '').split(' ').includes(who)));
    }
    document.querySelectorAll('.client-button').forEach(b => {
      const pressed = b.getAttribute('aria-pressed') === 'true', want = on && b.dataset.client === who;
      if (pressed !== want) b.click();
    });
  }));

  // red reading thread
  const thread = document.createElement('div'); thread.className = 'read-thread'; thread.setAttribute('aria-hidden', 'true'); thread.innerHTML = '<i></i>';
  document.body.append(thread);
  const bar = thread.firstChild;
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(3) : 0); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // tap feedback on touch screens
  if (!matchMedia('(pointer:fine)').matches) document.querySelectorAll('.button,.persona-chip,.dept-tile,.mobile-bar a').forEach(el => {
    el.addEventListener('pointerdown', () => { el.classList.remove('tap-flash'); void el.offsetWidth; el.classList.add('tap-flash'); });
  });
})();
