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
  const disclosureAnimations = new WeakMap();
  function animateDisclosure(details) {
    const previous = disclosureAnimations.get(details);
    const opening = previous ? !previous.opening : !details.open;
    const from = details.getBoundingClientRect().height;
    if (previous) previous.animation.cancel();
    if (reduce.matches || userReduce || !details.animate) { details.open = opening; details.style.height = ''; details.style.overflow = ''; disclosureAnimations.delete(details); return; }
    details.style.height = ''; details.open = true;
    const to = opening ? details.getBoundingClientRect().height : details.querySelector('summary').getBoundingClientRect().height + 2;
    details.style.overflow = 'hidden';
    const animation = details.animate([{height: from + 'px'}, {height: to + 'px'}], {duration: 340, easing: 'cubic-bezier(.22,.7,.2,1)'});
    disclosureAnimations.set(details, {animation, opening});
    animation.onfinish = () => { if (disclosureAnimations.get(details)?.animation !== animation) return; details.open = opening; details.style.height = ''; details.style.overflow = ''; disclosureAnimations.delete(details); };
  }
  $$('.service, .partner-bio, .demo-data, .recognition-disclosure').forEach(details => details.querySelector('summary').addEventListener('click', event => { event.preventDefault(); animateDisclosure(details); }));
  $$('.partner-grid, .recognition-grid').forEach(grid => [...grid.children].forEach((el,i) => el.style.setProperty('--reveal-delay', `${i * 75}ms`)));
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
    let active = 'about';
    ['about','services','partners','contact'].forEach(id => { if (document.getElementById(id).getBoundingClientRect().top < 170) active = id; });
    $$('.desktop-nav a').forEach(a => { if (a.hash === `#${active}` && scrollY > 400) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
    scrollPending = false;
  }
  addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(progress); } }, { passive: true });
  progress();
  const tabs = $$('.dept-tab'), groups = $$('.service-group');
  const search = $('#service-search'), reset = $('.reset-client'), clientButtons = $$('.client-button');
  let selectedClient = '';
  const normalize = text => text.normalize('NFKD').replace(/[\u0591-\u05C7]/g, '').toLocaleLowerCase().trim();
  $('.department-nav').setAttribute('role', 'tablist');
  const tabLayout = matchMedia('(min-width: 761px)');
  function tabOrientation() { $('.department-nav').setAttribute('aria-orientation', tabLayout.matches ? 'vertical' : 'horizontal'); }
  tabOrientation(); tabLayout.addEventListener('change', tabOrientation);
  tabs.forEach((tab, i) => { tab.setAttribute('role', 'tab'); groups[i].setAttribute('role', 'tabpanel'); groups[i].setAttribute('aria-labelledby', tab.id); });
  function setGroup(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;
      groups[i].hidden = i !== index;
    });
    if (index >= 0 && !reduce.matches && !userReduce && groups[index].animate) groups[index].animate([{opacity:.25,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,easing:'ease-out'});
    if (focus && index >= 0) tabs[index].focus();
  }
  function applyFilters() {
    const query = normalize(search.value);
    let total = 0;
    groups.forEach((group, index) => {
      let count = 0;
      $$('.service', group).forEach(service => {
        const clientMatch = !selectedClient || service.dataset.clients.split(' · ').includes(selectedClient);
        const searchMatch = !query || normalize(service.textContent).includes(query);
        service.hidden = !(clientMatch && searchMatch);
        if (!service.hidden) count++;
      });
      tabs[index].disabled = !count;
      $('.tab-count', tabs[index]).textContent = String(count).padStart(2, '0');
      total += count;
    });
    clientButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.client === selectedClient)));
    let active = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true' && !tab.disabled);
    if (active < 0) active = tabs.findIndex(tab => !tab.disabled);
    setGroup(active);
    $('#no-services').hidden = total > 0;
    $('#service-total').textContent = `${total} ${t('שירותים מקצועיים', 'professional services')}`;
    reset.hidden = !(selectedClient || query);
    $('.filter-status').textContent = selectedClient ? t(`שירותים עבור ${selectedClient}`, `Services for ${selectedClient}`) : '';
  }
  function clearFilters() { selectedClient = ''; search.value = ''; applyFilters(); }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setGroup(i));
    tab.addEventListener('keydown', e => {
      const available = tabs.map((t,i) => !t.disabled ? i : -1).filter(i => i >= 0);
      let next;
      if (e.key === 'Home') next = available[0];
      if (e.key === 'End') next = available.at(-1);
      if (e.key === 'ArrowDown' || e.key === (en ? 'ArrowRight' : 'ArrowLeft')) next = available[(available.indexOf(i) + 1) % available.length];
      if (e.key === 'ArrowUp' || e.key === (en ? 'ArrowLeft' : 'ArrowRight')) next = available[(available.indexOf(i) + available.length - 1) % available.length];
      if (next !== undefined) { e.preventDefault(); setGroup(next, true); }
    });
  });
  clientButtons.forEach(button => button.addEventListener('click', () => {
    selectedClient = selectedClient === button.dataset.client ? '' : button.dataset.client;
    applyFilters();
  }));
  search.addEventListener('input', applyFilters);
  search.addEventListener('keydown', e => { if (e.key === 'Escape') { clearFilters(); search.focus(); } });
  reset.addEventListener('click', () => { clearFilters(); search.focus(); });
  $$('[data-jump-group]').forEach(link => link.addEventListener('click', () => {
    clearFilters(); setGroup(Number(link.dataset.jumpGroup));
  }));
  applyFilters();
  function openService(id, scroll = true) {
    const service = document.getElementById(`service-${id}`);
    if (!service) return;
    if (service.hidden) clearFilters();
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
  $$('[data-bio]').forEach(button => {
    button.disabled = false;
    const profile = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => { animateDisclosure(profile); });
    profile.addEventListener('toggle', () => { button.setAttribute('aria-expanded', String(profile.open)); });
  });
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
    $('#demo-caption').textContent = `${data.title} · ${t('נתוני המחשה, באלפי ש״ח', 'illustrative figures, NIS thousands')}`;
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
  $('#demo-export').addEventListener('click', () => {
    const key = $('.demo-tab.active').dataset.metric, data = datasets[key];
    const rows = [[t('חודש','Month'), t('תקציב','Budget'), t('ביצוע','Actual'), t('פער','Variance')], ...months.map((m,i) => [m, data.planned[i], data.actual[i], data.actual[i]-data.planned[i]])];
    const csv = rows.map(row => row.map(v => '"' + String(v).replaceAll('"','""') + '"').join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = `illustrative-${key}-nis-thousands.csv`;
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
  });
  const form = $('#contact-form');
  ['name', 'phone'].forEach(field => form.elements[field].addEventListener('input', () => form.elements[field].setCustomValidity('')));
  const enableFormButtons = () => $$('button[type=submit]', form).forEach(button => button.disabled = false);
  $$('[data-topic],[data-partner]').forEach(link => link.addEventListener('click', () => {
    if (link.dataset.topic) form.elements.topic.value = link.dataset.topic;
    if (link.dataset.partner) form.elements.partner.value = link.dataset.partner;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const nameInput = form.elements.name, phoneInput = form.elements.phone;
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : t('יש להזין שם מלא.', 'Please enter your name.'));
    const digits = phoneInput.value.replace(/\D/g, '');
    const validPhone = /^[+\d\s().-]+$/.test(phoneInput.value) && digits.length >= 7 && digits.length <= 15;
    phoneInput.setCustomValidity(validPhone ? '' : t('יש להזין מספר טלפון תקין, כולל קידומת.', 'Please enter a valid phone number, including an area or country code.'));
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
  fetch('https://hwcpa-profile-intake.talwa3.chatgpt.site/api/profiles', {credentials:'omit',cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error('Profile service unavailable'); return response.json(); })
    .then(({profiles}) => {
      const labels = {about:'רקע אישי ומקצועי',expertise:'תחומי מומחיות',experience:'ניסיון מקצועי',education:'השכלה והכשרות',clients:'תחומי פעילות',community:'פעילות ציבורית והתנדבות'};
      for (const [person,profile] of Object.entries(profiles || {})) {
        const target = document.getElementById(`bio-${person}`)?.querySelector(':scope > div') || document.querySelector(`[data-person="${person}"]`);
        if (!target) continue;
        const block = document.createElement('div'); block.className = 'submitted-profile';
        if (en) { if (!profile.english) continue; const p=document.createElement('p');p.textContent=profile.english;block.append(p); }
        else for (const [field,label] of Object.entries(labels)) { if (!profile[field]) continue; const h=document.createElement('h4'); h.textContent=label; const p=document.createElement('p');p.textContent=profile[field];block.append(h,p); }
        if (target.classList.contains('manager')) { const details=document.createElement('details');details.className='manager-details';const summary=document.createElement('summary');summary.textContent=t('רקע וניסיון מקצועי','Professional background');details.append(summary,block);target.append(details); }
        else target.append(block);
      }
    }).catch(() => {});
})();
