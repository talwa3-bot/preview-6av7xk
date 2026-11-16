/* design-v4.4 · progressive enhancement only: the page is complete without this file */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* design-v4.4 */
  /* mobile menu */
  const mb = $('.menu-btn'), mn = $('#mnav');
  if (mb && mn) {
    mb.addEventListener('click', () => { const o = mb.getAttribute('aria-expanded') === 'true'; mb.setAttribute('aria-expanded', String(!o)); mn.hidden = o; });
    mn.addEventListener('click', e => { if (e.target.closest('a')) { mb.setAttribute('aria-expanded', 'false'); mn.hidden = true; } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mn.hidden) { mn.hidden = true; mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
  }

  /* sticky header: logo 120px at the top, 72px once the page scrolls (desktop; CSS keeps 120px on mobile) */
  const hdr = $('.hdr');
  if (hdr) { const hs = () => hdr.classList.toggle('small', scrollY > 40); addEventListener('scroll', hs, { passive: true }); hs(); }

  /* fade-up on scroll for section headings and cards (12-16px, ~500ms). The hidden state is enabled only here,
     by adding html.rv-on, so with JS off nothing is ever hidden. Skipped entirely with prefers-reduced-motion. */
  const rev = $$('[data-reveal]');
  const RV = '[data-reveal] .kicker, [data-reveal] .h2, [data-reveal] .intro, .about p.body, .since-frame, .p-head .more, .pcard, .p-row li, .svc, .svc-cta, .client';
  const items = $$(RV);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduce.matches) {
    items.forEach(el => { el.classList.add('rv'); const sib = el.parentElement ? [...el.parentElement.children].filter(c => c.matches(RV)) : []; const k = Math.max(0, sib.indexOf(el)); el.style.setProperty('--rv-d', Math.min(k, 5) * 80 + 'ms'); });
    document.documentElement.classList.add('rv-on');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    rev.concat(items).forEach(el => io.observe(el));
    reduce.addEventListener && reduce.addEventListener('change', () => { if (reduce.matches) items.forEach(el => el.classList.add('in')); });
  } else rev.concat(items).forEach(el => el.classList.add('in'));

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

  /* optional partner: show the chosen partner's photo (same files as the cards); nothing for people without a photo */
  const topic = $('#f-topic');
  const ps = $('#f-partner'), pp = $('#f-partner-pic');
  if (ps && pp) ps.addEventListener('change', () => {
    const o = ps.selectedOptions[0];
    pp.textContent = ''; pp.classList.remove('on');
    if (!ps.value || !o.dataset.photo) return;
    const im = new Image(); im.alt = ''; im.width = 800; im.height = 1000; im.src='assets/' + o.dataset.photo + '.jpg'; pp.appendChild(im);
    void pp.offsetWidth; pp.classList.add('on');
  });

  const was = $$('a[href*="wa.me"]');
  const waText = () => { const t = topic && topic.value ? topic.selectedOptions[0].text : ''; return t ? 'שלום, אשמח לתאם פגישה בנושא: ' + t : 'שלום, אשמח לתאם פגישה.'; };
  const waUpd = () => was.forEach(a => { const base = a.getAttribute('href').split('?')[0]; a.href = base + '?text=' + encodeURIComponent(waText()); });
  if (topic) topic.addEventListener('change', waUpd);
  waUpd();

  const LEAD_CONFIG = {
    provider: 'none',              // 'none' | 'web3forms' | 'resend'
    to: 'office@hwcpa.co.il',
    web3formsKey: '',
    resendEndpoint: '/api/lead'
  };
  const buildLead = form => {
    const v = n => (form.elements[n] && form.elements[n].value || '').trim();
    const pSel = form.elements.partner, partner = pSel && pSel.value ? pSel.selectedOptions[0].text : '';
    const branch = v('branch'), tp = v('topic');
    return { to: LEAD_CONFIG.to, subject: `פנייה מהאתר · ${branch} · ${tp}`,
             name: v('name'), phone: v('phone'), email: v('email'), branch, topic: tp, partner, consent: !!(form.elements.consent && form.elements.consent.checked) };
  };
  const sendLead = async lead => {
    if (LEAD_CONFIG.provider === 'web3forms' && LEAD_CONFIG.web3formsKey) {
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: LEAD_CONFIG.web3formsKey, subject: lead.subject, from_name: lead.name, email: lead.email,
          'טלפון': lead.phone, 'סניף': lead.branch, 'נושא': lead.topic, 'שותף': lead.partner || 'ללא העדפה' }) });
      return { ok: r.ok, preview: false };
    }
    if (LEAD_CONFIG.provider === 'resend') {
      const r = await fetch(LEAD_CONFIG.resendEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      return { ok: r.ok, preview: false };
    }
    console.info('[preview] no form provider connected; nothing was sent. Would-be payload:', lead);
    return { ok: true, preview: true };
  };
  window.hwLead = { config: LEAD_CONFIG, build: buildLead, send: sendLead };

  /* form: validation with specific messages; all invalid fields are marked (tester bugs 10, 11) */
  const f = $('#contact-form'), st = $('#form-status');
  $$('[data-needs-js]', f).forEach(b => { b.disabled = false; b.removeAttribute('data-needs-js'); });
  const PHONE_RE = /^[0-9+()\- ]{9,15}$/;
  const label = el => (el.labels && el.labels[0] && el.labels[0].textContent.replace('(לא חובה)', '').trim()) || 'אישור מדיניות הפרטיות';
  const problem = el => {
    if (el.type === 'checkbox') return el.checked ? '' : 'יש לאשר את מדיניות הפרטיות';
    const val = el.value.trim();
    if (!val) return 'נא למלא את השדה: ' + label(el);
    if (el.type === 'email' && !el.checkValidity()) return 'כתובת המייל לא תקינה';
    if (el.type === 'tel' && (!PHONE_RE.test(val) || (val.match(/\d/g) || []).length < 9)) return 'מספר הטלפון לא תקין';
    return '';
  };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    $$('[aria-invalid]', f).forEach(el => { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
    const bad = $$('[required]', f).map(el => [el, problem(el)]).filter(x => x[1]);
    if (bad.length) {
      bad.forEach(([el]) => { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'form-status'); });
      st.textContent = bad.map(x => x[1]).join('. ') + '.';
      bad[0][0].focus(); return;
    }
    st.textContent = '';
    const lead = buildLead(f);
    let res; try { res = await sendLead(lead); } catch (err) { res = { ok: false }; }
    const done = $('#form-done');
    if (!res.ok) { st.textContent = 'השליחה לא הצליחה. אפשר לנסות שוב, או לכתוב ל־' + LEAD_CONFIG.to + '.'; return; }
    if (!res.preview) { $('#form-done-h').textContent = 'תודה, הפנייה נשלחה.'; $('#form-done-t').textContent = 'נחזור אליכם בהקדם.'; }
    done.hidden = true; void done.offsetWidth; done.hidden = false;
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
