/* v4.3 accessibility menu (IS 5568 / WCAG 2.1 AA support). Own code, no overlay plugin.
   Settings: text size +/-, high contrast, highlight links, stop animations, readable font, reset.
   Stored in localStorage "hw-a11y"; a11y-head.js applies them before paint. */
(() => {
  const KEY = 'hw-a11y', root = document.documentElement;
  let st = {}; try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { st = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const apply = () => {
    const fs = Math.max(0, Math.min(4, st.fs | 0));
    root.classList.toggle('a11y-fs', fs > 0);
    if (fs > 0) root.style.setProperty('--a11y-fs', String(1 + fs * .125)); else root.style.removeProperty('--a11y-fs');
    root.classList.toggle('a11y-hc', !!st.hc);
    root.classList.toggle('a11y-links', !!st.links);
    root.classList.toggle('a11y-still', !!st.still);
    root.classList.toggle('a11y-font', !!st.font);
    if (st.still) document.querySelectorAll('[data-reveal], .rv').forEach(e => e.classList.add('in'));
    document.dispatchEvent(new CustomEvent('a11y:change'));
  };
  const stmt = document.querySelector('meta[name="a11y-statement"]');
  const href = stmt ? stmt.content : 'accessibility.html';
  /* v4.5 C08: English labels on en.html (the statement itself is in Hebrew, so the link says so) */
  const T = root.lang === 'en'
    ? { btn: 'Accessibility', h: 'Accessibility settings', close: 'Close the accessibility menu', size: 'Text size', dec: 'Decrease text size', decT: 'A-', inc: 'Increase text size', incT: 'A+',
        hc: 'High contrast', links: 'Highlight links', still: 'Stop animations', font: 'Readable font', reset: 'Reset settings', stmt: 'Accessibility statement (in Hebrew)', stmtAttr: ' hreflang="he"' }
    : { btn: 'נגישות', h: 'התאמות נגישות', close: 'סגירת תפריט הנגישות', size: 'גודל טקסט', dec: 'הקטנת טקסט', decT: 'א-', inc: 'הגדלת טקסט', incT: 'א+',
        hc: 'ניגודיות גבוהה', links: 'הדגשת קישורים', still: 'עצירת אנימציות', font: 'גופן קריא', reset: 'איפוס הגדרות', stmt: 'הצהרת נגישות', stmtAttr: '' };
  const wrap = document.createElement('aside');   /* a landmark, so the open panel is inside one (axe: region) */
  wrap.className = 'a11y';
  wrap.setAttribute('aria-label', T.h);
  wrap.innerHTML = `
  <button class="a11y-btn" type="button" aria-expanded="false" aria-controls="a11y-panel">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4.2" r="2.2" fill="currentColor"/><path d="M4 8.2c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2M12 9.4v5.2m0 0-3.6 7m3.6-7 3.6 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="a11y-btn-t">${T.btn}</span>
  </button>
  <div class="a11y-panel" id="a11y-panel" role="group" aria-labelledby="a11y-h" hidden>
    <div class="a11y-top"><h2 id="a11y-h" tabindex="-1">${T.h}</h2>
      <button type="button" class="a11y-x" data-act="close" aria-label="${T.close}"><svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 3l12 12M15 3 3 15" stroke="currentColor" stroke-width="2"/></svg></button></div>
    <div class="a11y-size" role="group" aria-labelledby="a11y-size-l">
      <span id="a11y-size-l">${T.size}</span>
      <button type="button" data-act="dec"><span aria-hidden="true">${T.decT}</span><span class="sr">${T.dec}</span></button>
      <output id="a11y-size-v" aria-live="polite">100%</output>
      <button type="button" data-act="inc"><span aria-hidden="true">${T.incT}</span><span class="sr">${T.inc}</span></button>
    </div>
    <ul class="a11y-list">
      <li><button type="button" data-tog="hc" aria-pressed="false">${T.hc}</button></li>
      <li><button type="button" data-tog="links" aria-pressed="false">${T.links}</button></li>
      <li><button type="button" data-tog="still" aria-pressed="false">${T.still}</button></li>
      <li><button type="button" data-tog="font" aria-pressed="false">${T.font}</button></li>
    </ul>
    <button type="button" class="a11y-reset" data-act="reset">${T.reset}</button>
    <a class="a11y-stmt" href="${href}"${T.stmtAttr}>${T.stmt}</a>
  </div>`;
  const skip = document.querySelector('.skip');
  if (skip) skip.after(wrap); else document.body.prepend(wrap);
  const btn = wrap.querySelector('.a11y-btn'), panel = wrap.querySelector('#a11y-panel'), out = wrap.querySelector('#a11y-size-v');
  const sync = () => {
    const fs = st.fs | 0;
    out.textContent = Math.round((1 + fs * .125) * 100) + '%';
    wrap.querySelector('[data-act="dec"]').setAttribute('aria-disabled', String(fs <= 0));
    wrap.querySelector('[data-act="inc"]').setAttribute('aria-disabled', String(fs >= 4));
    wrap.querySelectorAll('[data-tog]').forEach(b => b.setAttribute('aria-pressed', String(!!st[b.dataset.tog])));
  };
  const openP = () => { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.querySelector('#a11y-h').focus(); };
  const closeP = (focusBtn = true) => { if (panel.hidden) return; panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (focusBtn) btn.focus(); };
  btn.addEventListener('click', () => (panel.hidden ? openP() : closeP()));
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.act, t = b.dataset.tog;
    if (a === 'close') return closeP();
    if (a === 'inc' && (st.fs | 0) < 4) st.fs = (st.fs | 0) + 1;
    if (a === 'dec' && (st.fs | 0) > 0) st.fs = (st.fs | 0) - 1;
    if (a === 'reset') st = {};
    if (t) st[t] = !st[t];
    save(); apply(); sync();
  });
  wrap.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); closeP(); } });
  document.addEventListener('click', e => { if (!panel.hidden && !wrap.contains(e.target)) closeP(false); });
  sync();
})();
