/* hwcpa · hw-action-bar.js · GUI v1.3.1 (optional, progressive; the page works without it)
   1) Call number by page: <nav class="action-bar" data-branch="petah-tikva|kiryat-malachi">,
      the call link carries data-call. The template must already write the right href; this only syncs it.
   2) Tall fields (textarea) that are partly behind the bar on focus get scrolled just above it.
      Browsers don't scroll a partly-visible element on focus, so scroll-padding alone isn't enough. */
(() => {
  const TEL = {
    'petah-tikva':    ['+972732741700', '073-274-1700', 'המשרד בפתח תקווה'],
    'kiryat-malachi': ['+972732741699', '073-274-1699', 'סניף קריית מלאכי']
  };
  const bar = document.querySelector('.action-bar');
  if (!bar) return;
  const t = TEL[bar.dataset.branch] || TEL['petah-tikva'];
  const call = bar.querySelector('a[data-call]') || bar.querySelector('a[href^="tel:"]');
  if (call) {
    call.href = 'tel:' + t[0];
    /* WCAG 2.5.3 label-in-name: the accessible name always STARTS with the visible text,
       whatever the template shows ("חיוג למשרד" or "חיוג 073-274-1700"); only missing details are appended. */
    const vis = call.textContent.replace(/\s+/g, ' ').trim();
    const extra = [t[1], t[2]].filter(x => !vis.includes(x)).join(', ');
    call.setAttribute('aria-label', extra ? vis + ', ' + extra : vis);
  }
  document.addEventListener('focusin', e => {
    const el = e.target;
    if (bar.contains(el) || getComputedStyle(bar).display === 'none') return;
    const r = el.getBoundingClientRect(), b = bar.getBoundingClientRect();
    if (r.bottom > b.top && r.top < b.bottom) el.scrollIntoView({ block: 'nearest' });
  });
})();
