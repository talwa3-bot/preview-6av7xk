/* hwcpa · hw-action-bar.js · GUI v1.3.1 (optional, progressive; the page works without it)
   1) Call number by page: <nav class="action-bar" data-branch="petah-tikva|kiryat-malachi">,
      the call link carries data-call. The template must already write the right href; this only syncs it.
   2) Tall fields (textarea) that are partly behind the bar on focus get scrolled just above it.
      Browsers don't scroll a partly-visible element on focus, so scroll-padding alone isn't enough. */
(() => {
  const TEL = {
    'petah-tikva':    ['+972732741700', 'למשרד בפתח תקווה'],
    'kiryat-malachi': ['+972732741699', 'לסניף קריית מלאכי']
  };
  const bar = document.querySelector('.action-bar');
  if (!bar) return;
  const t = TEL[bar.dataset.branch] || TEL['petah-tikva'];
  const call = bar.querySelector('a[data-call]') || bar.querySelector('a[href^="tel:"]');
  if (call) {
    call.href='tel:' + t[0];
    /* WCAG 2.5.3 label-in-name: the accessible name STARTS with the visible text ("התקשרו").
       v4.4: no phone digits in the name either (Tal's rule; gates.py checks aria-labels too). */
    const vis = call.textContent.replace(/\s+/g, ' ').trim();
    call.setAttribute('aria-label', vis.includes(t[1]) ? vis : vis + ' ' + t[1]);
  }
  /* v4.4 (reflow, WCAG 1.4.10): with large text the bar may wrap to more rows; page padding and the
     accessibility button follow its real height */
  const fit = () => { if (getComputedStyle(bar).display === 'none') return; document.documentElement.style.setProperty('--actionbar-h', Math.max(64, Math.round(bar.getBoundingClientRect().height)) + 'px'); };
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(bar); else addEventListener('resize', fit);
  document.addEventListener('a11y:change', fit); fit();
  document.addEventListener('focusin', e => {
    const el = e.target;
    if (bar.contains(el) || getComputedStyle(bar).display === 'none') return;
    const r = el.getBoundingClientRect(), b = bar.getBoundingClientRect();
    if (r.bottom > b.top && r.top < b.bottom) el.scrollIntoView({ block: 'nearest' });
  });
})();
