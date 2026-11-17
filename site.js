/* design-v4.5 · progressive enhancement only: the page is complete without this file */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* v4.5 C08: the same script runs on en.html; visible strings follow <html lang>. Form VALUES stay Hebrew on both pages. */
  const EN = document.documentElement.lang === 'en';
  const L = EN ? {
    hi: 'Hello, I would like to schedule a meeting.', hiTopic: 'Hello, I would like to schedule a meeting on the topic: ', hiBranch: 'Hello, I would like to schedule a meeting at the ', branchWord: ' branch', topicWord: ', on the topic: ',
    optional: '(optional)', consentName: 'privacy policy consent', consent: 'Please accept the privacy policy', fill: 'Please fill in: ', fillPhoneIntro: 'Please fill in: Phone (required to arrange the introductory call)',
    badMail: 'The email address is not valid', badPhone: 'The phone number is not valid',
    fail: 'Sending failed, and the details you entered are kept in the form. You can try again, or contact us directly: ', mailLink: 'Send an email', mailAria: 'Send an email to the firm',
    prevH: 'Thank you, your details were received.', prevT: 'This is a preview version of the site: the form is not yet connected, so the enquiry was not sent. You can contact us directly: ', okH: 'Thank you, your enquiry has been sent.', okT: 'We will get back to you soon.'
  } : {
    hi: 'שלום, אשמח לתאם פגישה.', hiTopic: 'שלום, אשמח לתאם פגישה בנושא: ', hiBranch: 'שלום, אשמח לתאם פגישה בסניף ', branchWord: '', topicWord: ', בנושא: ',
    optional: '(לא חובה)', consentName: 'אישור מדיניות הפרטיות', consent: 'יש לאשר את מדיניות הפרטיות', fill: 'נא למלא את השדה: ', fillPhoneIntro: 'נא למלא את השדה: טלפון (חובה לתיאום שיחת ההיכרות)',
    badMail: 'כתובת המייל לא תקינה', badPhone: 'מספר הטלפון לא תקין',
    fail: 'השליחה לא הצליחה, והפרטים שמילאתם נשמרו בטופס. אפשר לנסות שוב, או לפנות אלינו ישירות: ', mailLink: 'שליחת מייל', mailAria: 'שליחת מייל למשרד',
    prevH: 'תודה, הפרטים נקלטו.', prevT: 'זוהי גרסת תצוגה של האתר: הטופס עדיין לא מחובר לשליחה, ולכן הפנייה לא נשלחה. אפשר לפנות אלינו ישירות: ', okH: 'תודה, הפנייה נשלחה.', okT: 'נחזור אליכם בהקדם.'
  };
  /* E03: the address is never written as text; messages carry a "שליחת מייל" mailto link instead */
  const mailLink = () => { const a = document.createElement('a'); a.href = 'mailto:office@hwcpa.co.il'; a.className = 'mail-inline'; a.textContent = L.mailLink; a.setAttribute('aria-label', L.mailAria); return a; };
  const say = (el, before, after = '.') => { el.textContent = before; el.appendChild(mailLink()); el.appendChild(document.createTextNode(after)); };

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
  const RV = '[data-reveal] .kicker, [data-reveal] .h2, [data-reveal] .intro, .about p.body, .since-frame, .p-head .more, .pcard, .p-row li, .svc-show, .client';
  const items = $$(RV);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduce.matches) {
    /* B8: nothing in the first 1.5 screens is ever hidden (LCP must not wait for a fade) */
    const fold = innerHeight * 1.5;
    items.filter(el => el.getBoundingClientRect().top < fold).forEach(el => el.classList.add('in'));
    items.filter(el => !el.classList.contains('in')).forEach(el => { el.classList.add('rv'); const sib = el.parentElement ? [...el.parentElement.children].filter(c => c.matches(RV)) : []; const k = Math.max(0, sib.indexOf(el)); el.style.setProperty('--rv-d', Math.min(k, 5) * 80 + 'ms'); });
    document.documentElement.classList.add('rv-on');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0, rootMargin: '0px 0px 10% 0px' });
    rev.concat(items).forEach(el => io.observe(el));
    const showAll = () => items.forEach(el => el.classList.add('in'));
    /* N1: the fallback (safety timer, print) flips everything on at once, with no half-transparent in-between state */
    const showNow = () => { document.documentElement.classList.add('rv-instant'); showAll(); };
    reduce.addEventListener && reduce.addEventListener('change', () => { if (reduce.matches) showAll(); });
    /* B11: safety reveal, so screenshot/preview tools that never scroll still see everything */
    const safety = () => setTimeout(showNow, 2500);
    if (document.readyState === 'complete') safety(); else addEventListener('load', safety, { once: true });
    addEventListener('beforeprint', showNow);
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
    const im = new Image(); im.alt = ''; im.width = 800; im.height = 1000; im.src = 'assets/' + o.dataset.photo + '.jpg'; pp.appendChild(im);
    void pp.offsetWidth; pp.classList.add('on');
  });

  /* (c) service-card titles preselect the topic (plain #contact anchors without JS); "טופס פנייה" for KM preselects the branch */
  /* the link still scrolls to its #target as usual; focus follows without a second scroll */
  const focusAfterJump = el => { if (!el) return;
    setTimeout(() => el.focus({ preventScroll: true }), 0);   // focus now (screen readers announce it); the link's own (smooth) jump keeps going
    /* when the jump has ended: only if the field is still out of sight (e.g. hidden by the header or the bottom bar), centre it */
    let done = false; const check = () => { if (done) return; done = true;
      const r = el.getBoundingClientRect(), hdr = $('.hdr'), hb = hdr && getComputedStyle(hdr).position === 'sticky' ? hdr.getBoundingClientRect().bottom : 0;
      const bar = $('.action-bar'), bt = bar && getComputedStyle(bar).display !== 'none' ? bar.getBoundingClientRect().top : innerHeight;
      if (r.top < hb || r.bottom > bt) el.scrollIntoView({ block: 'center' }); };
    addEventListener('scrollend', check, { once: true }); setTimeout(check, 1500);
  };
  $$('[data-topic]').forEach(a => a.addEventListener('click', () => {
    const opt = topic && [...topic.options].find(o => o.value === a.dataset.topic || o.text === a.dataset.topic);
    if (opt) { topic.value = opt.value || opt.text; topic.dispatchEvent(new Event('change')); }
    focusAfterJump(topic);                       // N4: keyboard and screen-reader users land in the form
  }));
  /* v4.5c B15: services showcase. Without JS the four groups stay stacked and complete; here they become an ARIA tab set
     (roving tabindex; Right/Left follow the reading direction, Up/Down, Home/End). Hover switches on fine pointers only. */
  const show = $('.svc-show'), tl = show && $('.svc-tabs', show);
  if (show && tl) {
    const tabs = $$('[role="tab"]', tl), panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const ind = $('.svc-ind', tl), stage = $('.svc-stage', show);
    panels.forEach((p, i) => { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', tabs[i].id); p.tabIndex = 0; });
    const place = t => { if (!ind) return; ind.style.transform = `translateY(${t.offsetTop}px) scaleY(${t.offsetHeight / 100})`; };
    let cur = 0;
    /* v4.5c r2: the stage takes the active panel's natural height; the change is eased (instant with reduced motion / "stop animations") */
    let ready = false;
    const select = (i, focus) => {
      const h0 = stage ? stage.offsetHeight : 0;
      cur = i;
      tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p, k) => { const on = k === i; p.classList.toggle('on', on); p.inert = !on; });
      if (stage) stage.dataset.at = String(i);
      if (stage && ready && motionOK && !still() && stage.animate) {
        const h1 = stage.offsetHeight;
        if (Math.abs(h1 - h0) > 1) stage.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 450, easing: 'cubic-bezier(.25,.8,.25,1)' });
      }
      place(tabs[i]);
      if (tl.scrollWidth > tl.clientWidth + 1) {            /* mobile chips: bring the chosen chip into view, horizontally only */
        const t = tabs[i], left = t.offsetLeft - (tl.clientWidth - t.offsetWidth) / 2;
        tl.scrollTo({ left, behavior: still() || !motionOK ? 'auto' : 'smooth' });
      }
      if (focus) tabs[i].focus();
    };
    show.classList.add('svc-init'); tl.hidden = false; show.classList.add('svc-js');
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', e => {
        const rtl = getComputedStyle(tl).direction === 'rtl', n = tabs.length;
        const step = { ArrowDown: 1, ArrowUp: -1, ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 }[e.key];
        let j = step ? (i + step + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
        if (j < 0) return; e.preventDefault(); select(j, true);
      });
    });
    /* hover previews on fine pointers, only on a real pointer move (never when the page scrolls under a resting pointer) */
    const fine = matchMedia('(hover: hover) and (pointer: fine)'); let ht;
    tabs.forEach((t, i) => {
      t.addEventListener('pointermove', e => { if (!fine.matches || e.pointerType !== 'mouse' || cur === i || (!e.movementX && !e.movementY)) return;
        clearTimeout(ht); ht = setTimeout(() => { if (cur !== i) select(i, false); }, 90); });
      t.addEventListener('pointerleave', () => clearTimeout(ht));
    });
    show.classList.add('svc-init'); select(0, false); ready = true;
    requestAnimationFrame(() => requestAnimationFrame(() => show.classList.remove('svc-init')));   /* first paint without transitions */
    addEventListener('resize', () => place(tabs[cur]));
    document.fonts && document.fonts.ready.then(() => place(tabs[cur]));
  }
  const bsel = $('#f-branch');
  $$('[data-branch]').filter(a => a.tagName === 'A').forEach(a => a.addEventListener('click', () => {
    const opt = bsel && [...bsel.options].find(o => o.value === a.dataset.branch || o.text === a.dataset.branch);
    if (opt) { bsel.value = opt.value || opt.text; bsel.dispatchEvent(new Event('change')); }
    focusAfterJump(bsel);
  }));

  /* WhatsApp: every wa.me link on the page (form button, contact, mobile menu, mobile action bar) carries an opening
     message for the chosen topic (decisions/05: "הודעת וואטסאפ פתוחה לפי שירות"; tester bug 7) */
  const was = $$('a[href*="wa.me"]');
  const waMsg = () => { const el = $('#f-msg'); const m = el && el.value ? el.value.trim() : ''; return m ? (m.length > 500 ? m.slice(0, 500) + '…' : m) : ''; };
  const waText = () => { const t = topic && topic.value ? topic.selectedOptions[0].text : ''; const msg = waMsg(); let s = t ? L.hiTopic + t : L.hi; if (msg) s += '\n' + msg; return s; };
  /* N3: a link for one branch (data-wa-branch) names that branch in the message */
  const waFor = a => { const b = a.dataset.waBranch; if (!b) return waText(); const t = topic && topic.value ? topic.selectedOptions[0].text : '';
    const msg = waMsg(); let s = L.hiBranch + b + L.branchWord + (t ? L.topicWord + t : '.'); if (msg) s += '\n' + msg; return s; };
  const waUpd = () => was.forEach(a => { const base = a.getAttribute('href').split('?')[0]; a.href = base + '?text=' + encodeURIComponent(waFor(a)); });
  if (topic) topic.addEventListener('change', waUpd);
  const msgEl = $('#f-msg'); if (msgEl) msgEl.addEventListener('input', waUpd);
  waUpd();

  /* v4.5: "שיחת היכרות" (intro call). The office calls back to set it up, so the phone is required (it is required for every
     topic; for this one the form also says why). The note is only referenced by aria-describedby while it is shown. */
  const INTRO = 'שיחת היכרות', phoneEl = $('#f-phone'), phoneNote = $('#f-phone-n');
  const isIntro = () => !!(topic && topic.value === INTRO);
  const phoneDesc = () => { if (!phoneEl || !phoneNote) return; phoneNote.hidden = !isIntro();
    const ids = (phoneEl.getAttribute('aria-describedby') || '').split(' ').filter(x => x && x !== 'f-phone-n');
    if (isIntro()) ids.push('f-phone-n');
    if (ids.length) phoneEl.setAttribute('aria-describedby', ids.join(' ')); else phoneEl.removeAttribute('aria-describedby'); };
  if (topic) topic.addEventListener('change', phoneDesc);
  phoneDesc();

  /* ---- lead send layer (decisions/05; tester bug 1). Swappable provider, selected by config.
     Preview: provider 'none' -> nothing leaves the browser; the would-be payload is logged to the console.
     Launch: Tal chooses 'web3forms' (needs an access key) or 'resend' (a Vercel function at /api/lead, see api/lead.js).
     No account is opened and no key is stored here. ---- */
  const LEAD_CONFIG = {
    provider: 'none',              // 'none' | 'web3forms' | 'resend'
    to: 'office@hwcpa.co.il',      // the ONLY recipient (decisions/05)
    web3formsKey: '',              // filled at launch, only with Tal's approval
    resendEndpoint: '/api/lead'    // Vercel function, only with Tal's approval
  };
  const buildLead = form => {
    const v = n => (form.elements[n] && form.elements[n].value || '').trim();
    const pSel = form.elements.partner, partner = pSel && pSel.value ? (pSel.selectedOptions[0].dataset.he || pSel.selectedOptions[0].text) : '';
    const branch = v('branch'), tp = v('topic');
    return { to: LEAD_CONFIG.to, subject: `פנייה מהאתר · ${branch} · ${tp}`,
             name: v('name'), phone: v('phone'), email: v('email'), branch, topic: tp, partner, message: v('message'),
             consent: !!(form.elements.consent && form.elements.consent.checked),
             botcheck: !!(form.elements.botcheck && form.elements.botcheck.checked) };
  };
  const sendLead = async lead => {
    const P = LEAD_CONFIG.provider;
    /* B3: a provider that is chosen but not configured is an ERROR (visible, data kept), never a silent "preview" */
    if ((P === 'web3forms' && !LEAD_CONFIG.web3formsKey) || (P === 'resend' && !LEAD_CONFIG.resendEndpoint) || !['none', 'web3forms', 'resend'].includes(P)) {
      console.error('[lead] provider "' + P + '" is not configured; nothing was sent');
      return { ok: false, preview: false };
    }
    if (P === 'web3forms') {
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: LEAD_CONFIG.web3formsKey, subject: lead.subject, from_name: lead.name, email: lead.email,
          'טלפון': lead.phone, 'סניף': lead.branch, 'נושא': lead.topic, 'שותף': lead.partner || 'ללא העדפה', 'פירוט הפנייה': lead.message || '', ...(lead.botcheck ? { botcheck: true } : {}) }) });
      return { ok: r.ok, preview: false };
    }
    if (P === 'resend') {
      const r = await fetch(LEAD_CONFIG.resendEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) });
      return { ok: r.ok, preview: false };
    }
    /* B6: no personal data in the console; field names only */
    console.info('[preview] no form provider connected; nothing was sent. Fields: ' + Object.keys(lead).join(', '));
    return { ok: true, preview: true };
  };
  window.hwLead = { config: LEAD_CONFIG, build: buildLead, send: sendLead };

  /* form: validation with specific messages; all invalid fields are marked (tester bugs 10, 11) */
  const f = $('#contact-form'), st = $('#form-status');
  $$('[data-needs-js]', f).forEach(b => { b.disabled = false; b.removeAttribute('data-needs-js'); });
  let inFlight = false, introConfirmed = false, dlgOpenedAt = 0, introLockUntil = 0;
  const sendBtn = $('button[type=submit]', f), idlg = $('#intro-dlg'), yesBtn = idlg && $('#intro-yes', idlg);
  const PHONE_RE = /^[0-9+()\- ]{9,15}$/, EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   // same rules in api/lead.js
  const label = el => (el.labels && el.labels[0] && el.labels[0].textContent.replace(L.optional, '').trim()) || L.consentName;
  const problem = el => {
    if (el.type === 'checkbox') return el.checked ? '' : L.consent;
    const val = el.value.trim();
    if (!val) return el.name === 'phone' && isIntro() ? L.fillPhoneIntro : L.fill + label(el);
    if (el.type === 'email' && (!el.checkValidity() || !EMAIL_RE.test(val))) return L.badMail;
    if (el.type === 'tel' && (!PHONE_RE.test(val) || (val.match(/\d/g) || []).length < 9)) return L.badPhone;
    return '';
  };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    $$('[aria-invalid]', f).forEach(el => { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
    phoneDesc();
    const bad = $$('[required]', f).map(el => [el, problem(el)]).filter(x => x[1]);
    if (bad.length) {
      bad.forEach(([el]) => { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', ['form-status', ...(el === phoneEl && isIntro() ? ['f-phone-n'] : [])].join(' ')); });
      st.textContent = bad.map(x => x[1]).join('. ') + '.';
      bad[0][0].focus(); return;
    }
    if (inFlight) return;                         // B5: one lead per submit, even on double click
    st.textContent = '';
    /* v4.5: intro call -> short confirmation dialog first; nothing is sent until "כן, שלחו".
       v4.5b M2: after "כן" we send from the yes handler (introConfirmed); do not reopen the dialog
       on a leftover Enter/Space that arrives after the native dialog has already returned focus. */
    if (isIntro() && idlg && typeof idlg.showModal === 'function') {
      if (introConfirmed) { await doSend(); return; }
      if (performance.now() < introLockUntil) return;
      if (!idlg.open) {
        if (yesBtn) yesBtn.disabled = false;
        idlg.returnValue = '';
        idlg.showModal();
        dlgOpenedAt = performance.now();
        if (yesBtn) yesBtn.focus();
      }
      return;
    }
    await doSend();
  });
  const doSend = async () => {
    if (inFlight) return;
    const lead = buildLead(f);
    const done = $('#form-done');
    if (lead.botcheck) { done.hidden = false; return; }   // honeypot: look successful, send nothing
    inFlight = true; sendBtn.disabled = true; sendBtn.setAttribute('aria-busy', 'true');
    let res; try { res = await sendLead(lead); } catch (err) { res = { ok: false }; }
    inFlight = false; sendBtn.disabled = false; sendBtn.removeAttribute('aria-busy');
    if (!res.ok) { done.hidden = true; say(st, L.fail);
      st.focus({ preventScroll: false }); return; }   // N2: the button was disabled while focused; focus goes to the (live) error message
    /* B7: the HTML default is the real success text; the test-mode notice exists only in mode "none" */
    if (res.preview) { $('#form-done-h').textContent = L.prevH; say($('#form-done-t'), L.prevT); }
    else { $('#form-done-h').textContent = L.okH; $('#form-done-t').textContent = L.okT; }
    done.hidden = true; void done.offsetWidth; done.hidden = false;
    done.setAttribute('tabindex', '-1'); done.focus({ preventScroll: false });
  };
  /* confirmation dialog: native modal <dialog> (focus inside, Esc closes); Tab stays on its two buttons;
     closing without "yes" (Esc, "חזרה לטופס", backdrop) returns focus to the form's send button */
  idlg && idlg.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const fb = $$('button', idlg), i = fb.indexOf(document.activeElement);
    e.preventDefault(); fb[(i + (e.shiftKey ? -1 : 1) + fb.length) % fb.length].focus();
  });
  /* M1: ignore backdrop clicks for 400ms after open, and when e.detail>1.
     A leftover second click of a double-click on "שליחת הפנייה" can land on the backdrop
     or, if the coordinates coincide, on "חזרה לטופס" (#intro-back). Those leftover clicks
     (e.detail>1) are ignored; a later single click on "חזרה לטופס", and Esc, still close immediately. */
  idlg && idlg.addEventListener('click', e => {
    if (e.target !== idlg) return;
    if (e.detail > 1) return;
    if (performance.now() - dlgOpenedAt < 400) return;
    idlg.close('back');
  });
  const backBtn = idlg && $('#intro-back', idlg);
  backBtn && backBtn.addEventListener('click', e => {
    if (e.detail > 1) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  /* M2: send from the "כן" handler itself, not via the async close → doSend path (a second Enter
     could reopen the dialog and clear returnValue before that close handler ran). The button is
     disabled on first activation; repeated activations and the existing inFlight guard still hold. */
  const confirmIntro = () => {
    if (introConfirmed || inFlight || !idlg) return;
    introConfirmed = true;
    introLockUntil = performance.now() + 400;
    if (yesBtn) yesBtn.disabled = true;
    if (idlg.open) idlg.close('yes');
    doSend().finally(() => {
      introConfirmed = false;
      introLockUntil = Math.max(introLockUntil, performance.now() + 400);
      if (yesBtn && !idlg.open) yesBtn.disabled = false;
    });
  };
  yesBtn && yesBtn.addEventListener('click', e => { e.preventDefault(); confirmIntro(); });
  idlg && $('form', idlg) && $('form', idlg).addEventListener('submit', e => {
    if (e.submitter && e.submitter.id === 'intro-yes') { e.preventDefault(); confirmIntro(); }
  });
  idlg && idlg.addEventListener('close', () => {
    /* close only returns focus; doSend already ran from confirmIntro when the answer was yes */
    if (idlg.returnValue === 'yes' || introConfirmed) return;
    sendBtn.focus();
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
