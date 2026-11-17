(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const en = document.documentElement.lang === 'en';
  const t = (he, english) => en ? english : he;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userReduce = false;
  try { userReduce = localStorage.getItem('hw-motion') === 'reduce'; } catch {}
  function motionState() {
    document.documentElement.classList.toggle('reduced-motion', userReduce);
    $('#motion-toggle').setAttribute('aria-pressed', String(userReduce));
    $('#motion-toggle').textContent = userReduce ? t('הפעלת תנועה', 'Enable motion') : t('הפחתת תנועה', 'Reduce motion');
  }
  motionState();
  $('#motion-toggle').addEventListener('click', () => {
    userReduce = !userReduce;
    try { localStorage.setItem('hw-motion', userReduce ? 'reduce' : 'normal'); } catch {}
    motionState();
  });
  if (!reduce.matches && !userReduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -25px 0px', threshold: .08 });
    $$('.reveal').forEach(el => observer.observe(el));
    document.body.classList.add('motion-ready');
  }
  const menuButton = $('.menu-toggle'), mobileMenu = $('#mobile-nav');
  function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open)); mobileMenu.hidden = !open;
  });
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); } });
  const desktop = matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', e => { if (e.matches) closeMenu(); });
  let scrollPending = false;
  function progress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('.reading-progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
    scrollPending = false;
  }
  addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(progress); } }, { passive: true });
  progress();
  const tabs = $$('.dept-tab'), groups = $$('.service-group');
  $('.department-nav').setAttribute('role', 'tablist');
  $('.department-nav').setAttribute('aria-orientation', innerWidth > 760 ? 'vertical' : 'horizontal');
  tabs.forEach((tab, i) => { tab.setAttribute('role', 'tab'); groups[i].setAttribute('role', 'tabpanel'); groups[i].setAttribute('aria-labelledby', tab.id); });
  function setGroup(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;
      groups[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setGroup(i));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (e.key === 'ArrowDown' || e.key === (en ? 'ArrowRight' : 'ArrowLeft')) next = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === (en ? 'ArrowLeft' : 'ArrowRight')) next = (i + tabs.length - 1) % tabs.length;
      if (next !== undefined) { e.preventDefault(); setGroup(next, true); }
    });
  });
  setGroup(0);
  function openService(id, scroll = true) {
    const service = document.getElementById(`service-${id}`);
    if (!service) return;
    setGroup(groups.indexOf(service.closest('.service-group')));
    service.open = true;
    if (scroll) service.scrollIntoView({ block: 'start', behavior: reduce.matches || userReduce ? 'instant' : 'smooth' });
  }
  $$('[data-open-service]').forEach(link => link.addEventListener('click', e => {
    e.preventDefault(); openService(link.dataset.openService);
    history.replaceState(null, '', `#service-${link.dataset.openService}`);
    $(`#service-${link.dataset.openService} > summary`).focus({ preventScroll: true });
  }));
  function restoreHash() { if (location.hash.startsWith('#service-')) openService(location.hash.slice(9)); }
  restoreHash(); addEventListener('hashchange', restoreHash);
  const clientButtons = $$('.client-button'), reset = $('.reset-client');
  let selectedClient = '';
  function selectClient(client) {
    selectedClient = client === selectedClient ? '' : client;
    clientButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.client === selectedClient)));
    let count = 0;
    $$('.service').forEach(service => {
      const match = Boolean(selectedClient && service.dataset.clients.split(' · ').includes(selectedClient));
      service.classList.toggle('match', match); if (match) count++;
    });
    reset.hidden = !selectedClient;
    $('.filter-status').textContent = selectedClient ? t(`${count} שירותים מסומנים בנקודה כחולה בכל המחלקות.`, `${count} services marked with a blue dot across all departments.`) : '';
  }
  clientButtons.forEach(button => button.addEventListener('click', () => selectClient(button.dataset.client)));
  reset.addEventListener('click', () => { selectClient(''); clientButtons[0].focus(); });
  const datasets = {
    revenue: { planned: [340,370,390,410,430,460], actual: [350,360,420,450,470,500],
      title: t('הכנסות', 'Revenue'), insight: t('הביצוע גבוה מהתקציב ב־150 אלף ש״ח, שהם 6.25%. כדי להבין את הסיבה נדרש לבחון מחירים, כמויות ותמהיל.', 'Actual revenue exceeds budget by NIS 150 thousand, or 6.25%. Explaining the variance requires reviewing prices, volumes and mix.') },
    cash: { planned: [60,65,55,70,75,80], actual: [45,70,30,60,55,85],
      title: t('תזרים נטו', 'Net cash flow'), insight: t('תזרים הנטו נמוך מהתחזית ב־60 אלף ש״ח. הכנסות גבוהות יותר אינן מבטיחות גבייה ותזרים באותו מועד.', 'Net cash flow is NIS 60 thousand below forecast. Higher revenue does not guarantee collection or cash flow in the same period.') }
  };
  const months = en ? ['Jan','Feb','Mar','Apr','May','Jun'] : ['ינו׳','פבר׳','מרץ','אפר׳','מאי','יוני'];
  function renderDemo(metric) {
    const data = datasets[metric], sum = arr => arr.reduce((a,b) => a+b,0), planned = sum(data.planned), actual = sum(data.actual);
    $('#planned-total').textContent = planned.toLocaleString('en-US');
    $('#actual-total').textContent = actual.toLocaleString('en-US');
    $('#variance-total').textContent = `${actual >= planned ? '+' : '−'}${Math.abs(actual-planned).toLocaleString('en-US')}`;
    $('#demo-insight').textContent = data.insight;
    $('#demo-caption').textContent = `${data.title} — ${t('נתוני המחשה, באלפי ש״ח', 'illustrative figures, NIS thousands')}`;
    const bars = $('#chart-bars');
    if (!bars.children.length) months.forEach(month => {
      const pair = document.createElement('div'); pair.className = 'bar-pair'; pair.setAttribute('aria-hidden', 'true');
      pair.innerHTML = '<div class="bar planned"></div><div class="bar actual"></div><span></span>';
      $('span', pair).textContent = month; bars.append(pair);
    });
    const max = Math.max(...data.planned, ...data.actual) * 1.1;
    [...bars.children].forEach((pair, i) => {
      $('.planned', pair).style.setProperty('--height', `${data.planned[i]/max*100}%`);
      $('.actual', pair).style.setProperty('--height', `${data.actual[i]/max*100}%`);
    });
    $('#demo-table').replaceChildren(...months.map((month,i) => {
      const tr = document.createElement('tr');
      [month, data.planned[i], data.actual[i], data.actual[i]-data.planned[i]].forEach((value,j) => {
        const cell = document.createElement(j ? 'td' : 'th'); if (!j) cell.scope = 'row'; cell.textContent = value; tr.append(cell);
      }); return tr;
    }));
    $$('.demo-tab').forEach(tab => { const active = tab.dataset.metric === metric; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active)); });
  }
  $$('.demo-tab').forEach(tab => tab.addEventListener('click', () => renderDemo(tab.dataset.metric)));
  renderDemo('revenue');
  const form = $('#contact-form');
  const enableFormButtons = () => $$('button[type=submit]', form).forEach(button => button.disabled = false);
  $$('[data-topic],[data-partner]').forEach(link => link.addEventListener('click', () => {
    if (link.dataset.topic) form.elements.topic.value = link.dataset.topic;
    if (link.dataset.partner) form.elements.partner.value = link.dataset.partner;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form), value = key => String(data.get(key) || '').trim();
    const pairs = [[t('שם', 'Name'), value('name')], [t('חברה', 'Company'), value('company')], [t('טלפון', 'Phone'), value('phone')], [t('מייל', 'Email'), value('email')], [t('סניף', 'Office'), value('branch')], [t('נושא', 'Subject'), value('topic')], [t('שותף', 'Partner'), value('partner')], [t('תוכן הפנייה', 'Message'), value('message')]];
    const message = pairs.filter(([,v]) => v).map(([key,v]) => `${key}: ${v}`).join('\n');
    const channel = event.submitter?.value || 'whatsapp';
    const url = channel === 'email' ? `mailto:office@hwcpa.co.il?subject=${encodeURIComponent(t('פנייה מהאתר: ', 'Website enquiry: ') + value('topic'))}&body=${encodeURIComponent(message)}` : `https://wa.me/972545616662?text=${encodeURIComponent(message)}`;
    const box = $('#prepared-link'); box.replaceChildren(); box.className = 'prepared-link'; box.hidden = false;
    const link = document.createElement('a'); link.href = url; link.textContent = channel === 'email' ? t('פתיחת הפנייה בתוכנת המייל', 'Open enquiry in your email app') : t('פתיחת הפנייה בוואטסאפ', 'Open enquiry in WhatsApp');
    if (channel !== 'email') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    box.append(link);
    $('#form-status').textContent = t('הפנייה מוכנה. לחצו על הקישור כדי לבדוק ולשלוח אותה. עדיין לא נשלח דבר למשרד.', 'Your enquiry is ready. Use the link to review and send it. Nothing has been sent to the firm yet.');
    link.focus();
  });
  enableFormButtons();
})();
