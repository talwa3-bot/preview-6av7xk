/* design-v4.3 · progressive enhancement only: the page is complete without this file */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* mobile menu */
  const mb = $('.menu-btn'), mn = $('#mnav');
  if (mb && mn) {
    mb.addEventListener('click', () => { const o = mb.getAttribute('aria-expanded') === 'true'; mb.setAttribute('aria-expanded', String(!o)); mn.hidden = o; });
    mn.addEventListener('click', e => { if (e.target.closest('a')) { mb.setAttribute('aria-expanded', 'false'); mn.hidden = true; } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mn.hidden) { mn.hidden = true; mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
  }

  /* scroll reveals: one restrained motion per section (CSS decides what moves) */
  const rev = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    rev.forEach(el => io.observe(el));
  } else rev.forEach(el => el.classList.add('in'));

  const still = () => document.documentElement.classList.contains('a11y-still');   // v4.3 accessibility menu
  const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches;

  /* hero depth: the building drifts slightly with scroll, and with the mouse on fine pointers (transform only) */
  const media = $('[data-parallax]'), hero = $('.hero');
  if (media && hero && motionOK) {
    let mx = 0, my = 0, tick = false;
    const paint = () => {
      tick = false;
      if (still()) { media.style.setProperty('--px', '0px'); media.style.setProperty('--py', '0px'); return; }
      const h = hero.offsetHeight, y = Math.min(Math.max(scrollY, 0), h);
      const py = Math.min(40, y * 0.12) + my * 8, px = mx * 14;
      media.style.setProperty('--px', px.toFixed(1) + 'px');
      media.style.setProperty('--py', py.toFixed(1) + 'px');
    };
    const req = () => { if (!tick) { tick = true; requestAnimationFrame(paint); } };
    addEventListener('scroll', req, { passive: true });
    if (matchMedia('(pointer: fine)').matches) {
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - .5) * 2; my = ((e.clientY - r.top) / r.height - .5) * 2; req(); });
      hero.addEventListener('pointerleave', () => { mx = 0; my = 0; req(); });
    }
  }

  /* branches: the shared line draws with scroll progress; it never retracts */
  const line = $('[data-scrub]');
  if (line && motionOK) {
    let p = 0, tick = false;
    const paint = () => {
      tick = false;
      if (still()) { p = 1; line.style.setProperty('--p', '1'); line.classList.add('done'); return; }
      const r = line.parentElement.getBoundingClientRect(), vh = innerHeight;
      const q = Math.min(1, Math.max(0, (vh - (r.top + r.height / 2)) / (vh * 0.45)));
      if (q > p) { p = q; line.style.setProperty('--p', p.toFixed(3)); if (p >= 0.98) line.classList.add('done'); }
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
    document.addEventListener('a11y:change', paint);
    paint();
  }

  const topic = $('#f-topic');
  $$('[data-topic]').forEach(a => a.addEventListener('click', () => {
    const opt = [...topic.options].find(o => o.text === a.dataset.topic);
    if (opt) { topic.value = opt.value || opt.text; topic.dispatchEvent(new Event('change')); }
  }));

  /* optional partner: show the chosen partner's photo (same files as the cards) or the caption square */
  const ps = $('#f-partner'), pp = $('#f-partner-pic');
  if (ps && pp) ps.addEventListener('change', () => {
    const o = ps.selectedOptions[0];
    pp.textContent = ''; pp.classList.remove('on');
    if (!ps.value) return;
    if (o.dataset.photo) { const im = new Image(); im.alt = ''; im.width = 800; im.height = 1000; im.src = 'assets/' + o.dataset.photo + '.jpg'; pp.appendChild(im); }
    else { const d = document.createElement('div'); d.className = 'ph-empty'; d.innerHTML = '<span>תמונה תתווסף בהמשך</span>'; pp.appendChild(d); }
    void pp.offsetWidth; pp.classList.add('on');
  });

  const wa = $('#f-wa');
  if (wa) {
    const base = wa.getAttribute('href').split('?')[0];
    const upd = () => { const t = topic.value ? topic.selectedOptions[0].text : ''; wa.href = base + '?text=' + encodeURIComponent(t ? 'שלום, אשמח לתאם פגישה בנושא: ' + t : 'שלום, אשמח לתאם פגישה.'); };
    topic.addEventListener('change', upd); upd();
  }

  const f = $('#contact-form'), st = $('#form-status');
  f.addEventListener('submit', e => {
    e.preventDefault();
    const bad = $$('[required]', f).find(el => el.type === 'checkbox' ? !el.checked : !el.value.trim() || !el.checkValidity());
    $$('[aria-invalid]', f).forEach(el => { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });   // v4.3 a11y
    if (bad) { st.textContent = 'נא למלא את השדה: ' + ((bad.labels && bad.labels[0] && bad.labels[0].textContent.trim()) || 'אישור מדיניות הפרטיות'); bad.setAttribute('aria-invalid', 'true'); bad.setAttribute('aria-describedby', 'form-status'); bad.focus(); return; }
    st.textContent = '';
    const done = $('#form-done'); done.hidden = true; void done.offsetWidth; done.hidden = false;
    done.setAttribute('tabindex', '-1'); done.focus({ preventScroll: false });
  });

  /* partner bios: native modal <dialog>, deep link #partner-<slug> */
  const dlg = $('#bio-dlg');
  if (!dlg || typeof dlg.showModal !== 'function') return;   // no dialog support: the static bios stay reachable via the hash
  const body = $('.dlg-body', dlg), home = $('.bios .wrap');
  let current = null, opener = null;
  const open = (slug, from) => {
    const art = document.getElementById('partner-' + slug);
    if (!art || !art.classList.contains('bio')) return false;
    if (dlg.open) close(true);
    current = { art, next: art.nextSibling };
    opener = from || $(`.pcard a[data-bio="${slug}"]`);
    body.appendChild(art);
    dlg.setAttribute('aria-labelledby', 'bn-' + slug);
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
    $('.x', dlg).focus();
    if (location.hash !== '#partner-' + slug) history.pushState(null, '', '#partner-' + slug);
    return true;
  };
  const close = silent => { if (dlg.open) dlg.close(); restore(silent); };
  const restore = silent => {
    if (!current) return;
    home.insertBefore(current.art, current.next);
    current = null;
    document.documentElement.style.overflow = '';
    if (location.hash.startsWith('#partner-')) history.replaceState(null, '', location.pathname + location.search);
    if (!silent && opener) opener.focus();
  };
  dlg.addEventListener('close', () => restore(false));
  $('.x', dlg).addEventListener('click', () => close(false));
  dlg.addEventListener('click', e => { if (e.target === dlg) close(false); });   // click on backdrop
  $$('.pcard a[data-bio]').forEach(a => a.addEventListener('click', e => { if (open(a.dataset.bio, a)) e.preventDefault(); }));
  const fromHash = () => { const m = location.hash.match(/^#partner-([a-z-]+)$/); if (m) open(m[1]); else if (dlg.open) close(true); };
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('popstate', fromHash);
  fromHash();
})();
