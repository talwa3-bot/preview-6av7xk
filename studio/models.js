(() => {
  'use strict';
  const BASE_RECEIPTS = [200, 210, 225, 230, 245, 260];
  const PAYMENTS = [180, 200, 210, 220, 230, 240];
  function cashModel(opening, collection) {
    if (!Number.isFinite(opening) || opening < 0 || opening > 10000 || !Number.isFinite(collection) || collection < 70 || collection > 130) return null;
    let balance = opening;
    const rows = BASE_RECEIPTS.map((base, i) => {
      const receipt = base * collection / 100;
      balance += receipt - PAYMENTS[i];
      return { receipt, payment: PAYMENTS[i], closing: balance };
    });
    return { rows, receipts: BASE_RECEIPTS.reduce((a,b) => a+b,0) * collection / 100, payments: PAYMENTS.reduce((a,b) => a+b,0), closing: balance };
  }
  function proForma(growth, margin) {
    if (!Number.isFinite(growth) || growth < -20 || growth > 40 || !Number.isFinite(margin) || margin < 15 || margin > 60) return null;
    const revenue = 3000 * (100 + growth) / 100, gross = revenue * margin / 100;
    return { revenue, cost: revenue - gross, gross, expenses: 980, operating: gross - 980 };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { cashModel, proForma };
  if (typeof document === 'undefined') return;
  const root = document.querySelector('.model-lab');
  if (!root) return;
  const $ = s => root.querySelector(s);
  const en = root.dataset.modelLang === 'en';
  const fmt = n => new Intl.NumberFormat(en ? 'en-US' : 'he-IL', { maximumFractionDigits: 1 }).format(Math.abs(n) < 0.00001 ? 0 : n);
  const months = en ? ['Jan','Feb','Mar','Apr','May','Jun'] : ['ינואר','פברואר','מרץ','אפריל','מאי','יוני'];
  function cashRender() {
    const opening = $('[data-cash-opening]'), multiplier = $('[data-cash-collection]');
    const result = cashModel(opening.value.trim() ? Number(opening.value) : NaN, Number(multiplier.value));
    $('#cash-collection-value').textContent = multiplier.value + '%';
    multiplier.setAttribute('aria-valuetext', multiplier.value + '%');
    opening.setAttribute('aria-invalid', String(!result));
    $('#cash-validation').textContent = result ? '' : (en ? 'Enter an opening balance between 0 and 10,000.' : 'יש להזין יתרת פתיחה בין 0 ל־10,000.');
    if (!result) return;
    $('#cash-model-rows').replaceChildren(...result.rows.map((row, i) => {
      const tr = document.createElement('tr'), th = document.createElement('th');
      th.scope = 'row'; th.textContent = months[i]; tr.append(th);
      [row.receipt, row.payment, row.closing].forEach(n => { const td = document.createElement('td'); td.textContent = fmt(n); tr.append(td); });
      return tr;
    }));
    $('#cash-closing').textContent = fmt(result.closing);
    $('#cash-total-closing').textContent = fmt(result.closing);
    $('#cash-total-receipts').textContent = fmt(result.receipts);
    $('#cash-closing').dataset.negative = String(result.closing < 0);
  }
  function pfRender() {
    const growth = $('[data-pf-growth]'), margin = $('[data-pf-margin]');
    const result = proForma(Number(growth.value), Number(margin.value));
    if (!result) return;
    $('#pf-growth-value').textContent = growth.value + '%'; $('#pf-margin-value').textContent = margin.value + '%';
    growth.setAttribute('aria-valuetext', growth.value + '%'); margin.setAttribute('aria-valuetext', margin.value + '%');
    Object.entries(result).forEach(([key, n]) => { $('[data-pf-value="' + key + '"]').textContent = fmt(n); });
    $('#pf-operating').textContent = fmt(result.operating);
    $('#pf-operating').dataset.negative = String(result.operating < 0);
  }
  document.querySelectorAll('.model-lab input').forEach(input => { input.disabled = false; });
  $('[data-cash-opening]').addEventListener('input', cashRender);
  $('[data-cash-collection]').addEventListener('input', cashRender);
  $('[data-pf-growth]').addEventListener('input', pfRender);
  $('[data-pf-margin]').addEventListener('input', pfRender);
  cashRender(); pfRender();
})();
