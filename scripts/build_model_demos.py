"""Build two bilingual, deterministic model examples for the technology section."""
from html import escape


def build_models(lang):
    """Return a self-contained fragment. lang=0 Hebrew, lang=1 English."""
    en = lang == 1
    def t(he, english): return english if en else he
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] if en else ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני']
    receipts = [200, 210, 225, 230, 245, 260]
    payments = [180, 200, 210, 220, 230, 240]
    balance = 250
    cash_rows = []
    for month, receipt, payment in zip(months, receipts, payments):
        balance += receipt - payment
        cash_rows.append(f'<tr><th scope="row">{month}</th><td>{receipt:,}</td><td>{payment:,}</td><td>{balance:,}</td></tr>')
    cash_header = ''.join(f'<th scope="col">{x}</th>' for x in [t('חודש', 'Month'), t('תקבולים', 'Receipts'), t('תשלומים', 'Payments'), t('יתרת סגירה', 'Closing cash')])
    pf_header = ''.join(f'<th scope="col">{x}</th>' for x in [t('סעיף', 'Item'), t('תרחיש בסיס', 'Base case'), t('פרופורמה', 'Pro forma')])
    pf_rows = ''.join(f'<tr><th scope="row">{label}</th><td>{base:,}</td><td data-pf-value="{key}">{value:,}</td></tr>' for key, label, base, value in [
        ('revenue', t('הכנסות', 'Revenue'), 3000, 3300),
        ('cost', t('עלות המכר', 'Cost of sales'), 1950, 2145),
        ('gross', t('רווח גולמי', 'Gross profit'), 1050, 1155),
        ('expenses', t('הוצאות תפעול', 'Operating expenses'), 980, 980),
        ('operating', t('רווח תפעולי', 'Operating profit'), 70, 175),
    ])
    return f'''<div class="model-lab" data-model-lang="{'en' if en else 'he'}" aria-label="{t('מודלים פיננסיים להמחשה', 'Illustrative financial models')}">
      <div class="model-lab-heading"><p class="eyebrow">{t('בדיקת תרחישים', 'EXPLORE A SCENARIO')}</p><h3>{t('מודלים פיננסיים להמחשה', 'Illustrative financial models')}</h3><p>{t('פתחו מודל ושנו את ההנחות כדי לראות את ההשפעה על התוצאה.', 'Open a model and adjust the assumptions to see their effect.')}</p></div>
      <div class="model-lab-grid">
      <details class="model-panel" id="cash-flow-model"><summary><span><small>01</small>{t('מודל תזרים מזומנים', 'Cash-flow model')}</span><span class="model-plus" aria-hidden="true"></span></summary>
        <div class="model-content"><p class="model-intro">{t('תחזית לחצי שנה: יתרת הפתיחה בתוספת תקבולים, בניכוי תשלומים. כל הסכומים באלפי ש״ח.', 'A six-month forecast: opening cash plus receipts less payments. All amounts are in NIS thousands.')}</p>
          <div class="model-inputs"><label for="cash-opening">{t('יתרת פתיחה · אלפי ש״ח', 'Opening cash · NIS thousands')}<input id="cash-opening" data-cash-opening disabled type="number" value="250" min="0" max="10000" step="1" inputmode="decimal" aria-describedby="cash-assumptions"></label><label for="cash-collection">{t('תקבולים ביחס לבסיס', 'Receipts relative to base')}<output id="cash-collection-value" for="cash-collection">100%</output><input id="cash-collection" data-cash-collection disabled type="range" value="100" min="70" max="130" step="1" aria-describedby="cash-assumptions"></label></div>
          <p id="cash-assumptions" class="model-assumptions">{t('בסיס התקבולים: 200, 210, 225, 230, 245 ו־260. התשלומים קבועים: 180, 200, 210, 220, 230 ו־240. שינוי האחוז חל על התקבולים בלבד.', 'Base receipts: 200, 210, 225, 230, 245 and 260. Payments stay fixed at 180, 200, 210, 220, 230 and 240. The percentage changes receipts only.')}</p>
          <p class="model-validation" id="cash-validation" role="status"></p>
          <div class="model-result" aria-live="polite" aria-atomic="true"><span>{t('יתרה בסוף יוני', 'Cash at the end of June')}</span><strong id="cash-closing">340</strong><small>{t('אלפי ש״ח', 'NIS thousands')}</small></div>
          <div class="model-table-scroll" role="region" aria-label="{t('טבלת תחזית התזרים', 'Cash-flow forecast table')}" tabindex="0"><table><caption>{t('תחזית תזרים · נתונים פיקטיביים באלפי ש״ח', 'Cash-flow forecast · fictitious figures in NIS thousands')}</caption><thead><tr>{cash_header}</tr></thead><tbody id="cash-model-rows">{''.join(cash_rows)}</tbody><tfoot><tr><th scope="row">{t('סך הכול', 'Total')}</th><td id="cash-total-receipts">1,370</td><td>1,280</td><td id="cash-total-closing">340</td></tr></tfoot></table></div>
          <p class="model-note">{t('נתונים להמחשה בלבד. המודל מציג תקבולים ותשלומים, ללא מימון, ריבית, מסים או שינוי במועדי הגבייה והתשלום.', 'Illustrative figures only. The model shows receipts and payments, excluding financing, interest, taxes and changes in collection or payment timing.')}</p>
        </div></details>
      <details class="model-panel" id="pro-forma-model"><summary><span><small>02</small>{t('מודל דוח פרופורמה', 'Pro forma statement model')}</span><span class="model-plus" aria-hidden="true"></span></summary>
        <div class="model-content"><p class="model-intro">{t('דוח רווח והפסד תפעולי לשנה, לפי שיעור צמיחה בהכנסות ושיעור רווח גולמי. כל הסכומים באלפי ש״ח.', 'An annual operating income statement based on revenue growth and gross margin assumptions. All amounts are in NIS thousands.')}</p>
          <div class="model-inputs"><label for="pf-growth">{t('צמיחה בהכנסות', 'Revenue growth')}<output id="pf-growth-value" for="pf-growth">10%</output><input id="pf-growth" data-pf-growth disabled type="range" min="-20" max="40" value="10" step="1" aria-describedby="pf-assumptions"></label><label for="pf-margin">{t('שיעור רווח גולמי', 'Gross margin')}<output id="pf-margin-value" for="pf-margin">35%</output><input id="pf-margin" data-pf-margin disabled type="range" min="15" max="60" value="35" step="1" aria-describedby="pf-assumptions"></label></div>
          <p id="pf-assumptions" class="model-assumptions">{t('הכנסות הבסיס: 3,000. רווח גולמי בבסיס: 35%. הוצאות התפעול נשארות 980: שכר 650, הנהלה וכלליות 250 ופחת 80. עלות המכר נגזרת מההכנסות ומשיעור הרווח הגולמי.', 'Base revenue: 3,000. Base gross margin: 35%. Operating expenses stay fixed at 980: payroll 650, administration 250 and depreciation 80. Cost of sales is derived from revenue and gross margin.')}</p>
          <div class="model-result" aria-live="polite" aria-atomic="true"><span>{t('רווח תפעולי בפרופורמה', 'Pro forma operating profit')}</span><strong id="pf-operating">175</strong><small>{t('אלפי ש״ח', 'NIS thousands')}</small></div>
          <div class="model-table-scroll" role="region" aria-label="{t('טבלת דוח הפרופורמה', 'Pro forma statement table')}" tabindex="0"><table><caption>{t('דוח תפעולי שנתי · נתונים פיקטיביים באלפי ש״ח', 'Annual operating statement · fictitious figures in NIS thousands')}</caption><thead><tr>{pf_header}</tr></thead><tbody>{pf_rows}</tbody></table></div>
          <p class="model-note">{t('נתונים להמחשה בלבד. הדוח מוצג עד לרווח התפעולי, לפני הוצאות מימון ומסים.', 'Illustrative figures only. The statement is presented through operating profit, before financing costs and taxes.')}</p>
        </div></details>
      </div><noscript><p class="model-note">{t('הטבלאות מציגות את תרחיש ברירת המחדל. לחישוב מחדש יש להפעיל JavaScript.', 'The tables show the default scenario. Enable JavaScript to recalculate.')}</p></noscript>
    </div>'''
