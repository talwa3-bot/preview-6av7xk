(() => {
  'use strict';
  let state;
  const $ = id => document.getElementById(id);
  const time = iso => new Intl.DateTimeFormat('he-IL',{timeZone:'Asia/Jerusalem',hour:'2-digit',minute:'2-digit'}).format(new Date(iso));
  function tick() {
    if (!state) return;
    if (state.status === 'complete') { $('countdown').textContent = 'הושלם'; $('eta-label').textContent = 'האתר פורסם ונבדק'; return; }
    const remaining = Math.max(0, Math.ceil((Date.parse(state.estimatedFinishAt)-Date.now())/1000));
    $('countdown').textContent = remaining ? `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}` : 'בעדכון';
    $('eta-label').textContent = remaining ? 'זמן משוער שנותר' : 'ההערכה מתעדכנת; העבודה נמשכת';
  }
  async function refresh() {
    try {
      const response = await fetch(`progress.json?t=${Date.now()}`,{cache:'no-store'});
      if (!response.ok) throw new Error('Status unavailable');
      const next = await response.json();
      if (JSON.stringify(next) !== JSON.stringify(state)) {
        state = next;
        const completedWeight = state.steps.filter(step=>step.status==='complete').reduce((sum,step)=>sum+(step.weight||0),0);
        $('percent').textContent = `${completedWeight}% מהעבודה המתוכננת`;
        $('progress-fill').style.width = `${completedWeight}%`;
        document.querySelector('[role=progressbar]').setAttribute('aria-valuenow',String(completedWeight));
        $('status-note').textContent = state.note;
        $('status-steps').replaceChildren(...state.steps.map(step=>{
          const li=document.createElement('li'),icon=document.createElement('i'),label=document.createElement('span');
          li.dataset.state=step.status;icon.textContent=step.status==='complete'?'✓':step.status==='current'?'•':'';icon.setAttribute('aria-hidden','true');label.textContent=step.label;li.append(icon,label);return li;
        }));
        $('status-updated').textContent = `עדכון אחרון: ${time(state.updatedAt)} · שעון ישראל`;
        $('finished-link').hidden = state.status !== 'complete' || !state.siteUrl;
        if (state.status === 'complete' && state.siteUrl) $('finished-link').href=state.siteUrl;
      }
      tick();
    } catch { $('status-updated').textContent = 'מוצג העדכון הזמין האחרון; מנסה להתעדכן שוב.'; }
  }
  refresh();setInterval(refresh,3000);setInterval(tick,1000);
})();
