(() => {
 const buttons=[...document.querySelectorAll('[data-view]')];
 function select(view){
  const title=view==='title'; document.body.classList.toggle('with-title',title);
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===(title?'title':'signature'))));
  document.getElementById('concept-note').textContent=title?'חלופה ב׳: הלוגו נשמר במלואו ומשולב עם כותרת קריאה בשתי שורות, באותו צבע, גודל ומשקל.':'חלופה א׳: הלוגו המקורי מוביל את הפתיחה, בלי לחזור על שם המשרד בכותרת נוספת. הכיתוב והצבעים שבתוך הלוגו נשמרו במלואם.';
  const url=new URL(location.href);url.searchParams.set('view',title?'title':'signature');history.replaceState(null,'',url);
 }
 buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.view)));
 select(new URLSearchParams(location.search).get('view'));
})();
