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
    if (st.still) document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('in'));
    document.dispatchEvent(new CustomEvent('a11y:change'));
  };
  const stmt = document.querySelector('meta[name="a11y-statement"]');
  const href = stmt ? stmt.content : 'accessibility.html';
  const wrap = document.createElement('div');
  wrap.className = 'a11y';
  wrap.innerHTML = `
  <button class="a11y-btn" type="button" aria-expanded="false" aria-controls="a11y-panel">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4.2" r="2.2" fill="currentColor"/><path d="M4 8.2c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2M12 9.4v5.2m0 0-3.6 7m3.6-7 3.6 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="a11y-btn-t">נגישות</span>
  </button>
  <div class="a11y-panel" id="a11y-panel" role="group" aria-labelledby="a11y-h" hidden>
    <div class="a11y-top"><h2 id="a11y-h" tabindex="-1">התאמות נגישות</h2>
      <button type="button" class="a11y-x" data-act="close" aria-label="סגירת תפריט הנגישות"><svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3 3l12 12M15 3 3 15" stroke="currentColor" stroke-width="2"/></svg></button></div>
    <div class="a11y-size" role="group" aria-labelledby="a11y-size-l">
      <span id="a11y-size-l">גודל טקסט</span>
      <button type="button" data-act="dec" aria-label="הקטנת טקסט">א-</button>
      <output id="a11y-size-v" aria-live="polite">100%</output>
      <button type="button" data-act="inc" aria-label="הגדלת טקסט">א+</button>
    </div>
    <ul class="a11y-list">
      <li><button type="button" data-tog="hc" aria-pressed="false">ניגודיות גבוהה</button></li>
      <li><button type="button" data-tog="links" aria-pressed="false">הדגשת קישורים</button></li>
      <li><button type="button" data-tog="still" aria-pressed="false">עצירת אנימציות</button></li>
      <li><button type="button" data-tog="font" aria-pressed="false">גופן קריא</button></li>
    </ul>
    <button type="button" class="a11y-reset" data-act="reset">איפוס הגדרות</button>
    <a class="a11y-stmt" href="${href}">הצהרת נגישות</a>
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
