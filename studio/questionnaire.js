(() => {
  'use strict';
  const names = { iddo: 'רו״ח עדו ולנשטין', nitai: 'רו״ח נתאי ולנשטין', eitan: 'רו״ח איתן ויסברג', smadar: 'סמדר חיון', chen: 'חן ולנשטין' };
  const roles = { iddo: 'שותף מנהל · דירקטור', nitai: 'שותף מנהל', eitan: 'שותף · מנהל מחלקת ביקורת', smadar: 'מנהלת משרד קריית מלאכי', chen: 'מנהל תפעול של כלל מערך המשרד' };
  const key = new URLSearchParams(location.search).get('person');
  const form = document.getElementById('profile-form');
  if (names[key]) { form.elements.name.value = names[key]; form.elements.role.value = roles[key]; document.getElementById('person-name').textContent = names[key]; }
  const labels = { name:'שם', role:'תפקיד', practice:'תחומי עיסוק', experience:'ניסיון', education:'השכלה והסמכות', community:'פעילות ציבורית והתנדבות', clients:'לקוחות ועבודות', notes:'דגשים', photo:'קישור לתמונה' };
  form.addEventListener('submit', event => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = Object.entries(labels).map(([field,label]) => `${label}\n${String(data.get(field) || '').trim() || 'לא נמסר'}`).join('\n\n');
    const blob = new Blob(['\ufeff' + text], {type:'text/plain;charset=utf-8'}), url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `professional-profile-${names[key] ? key : 'answers'}.txt`; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    document.getElementById('save-status').textContent = 'הקובץ הוכן להורדה. העבירו אותו לטל לצורך עדכון הפרופיל.';
  });
  form.querySelector('button[type=submit]').disabled = false;
})();
