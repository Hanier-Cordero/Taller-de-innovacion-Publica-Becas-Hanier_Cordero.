const CENTER_DATA = window.BECAS_CENTROS_DATA || {departamentos:[],municipios:{},centros:[]};
const OFFICIAL_AREAS = window.BECAS_AREAS_PRIORIZADAS || [];

const AREA_META = {
  'Organización y Negocios': { label:'Organización y Negocios', icon:'▦' },
  'Comunicación y Ayuda Social': { label:'Comunicación y Ayuda Social', icon:'●' },
  'Arte y Creatividad': { label:'Arte y Creatividad', icon:'✦' },
  'Salud y Servicio': { label:'Salud y Servicio', icon:'♥' },
  'Tecnología y Oficios': { label:'Tecnología y Oficios', icon:'⚙' },
  'Liderazgo y Seguridad': { label:'Liderazgo y Seguridad', icon:'◆' },
  'Ciencia y Naturaleza': { label:'Ciencia y Naturaleza', icon:'⌁' }
};

const CAREERS_BY_AREA = {
  'Organización y Negocios':['Administración','Contaduría','Economía','Negocios Internacionales'],
  'Comunicación y Ayuda Social':['Trabajo Social','Psicología','Comunicación Social','Educación'],
  'Arte y Creatividad':['Diseño Gráfico','Arquitectura','Artes Visuales','Publicidad'],
  'Salud y Servicio':['Medicina','Enfermería','Fisioterapia','Nutrición'],
  'Tecnología y Oficios':['Ingeniería en Sistemas','Electrónica','Mecánica Industrial','Construcción'],
  'Liderazgo y Seguridad':['Gestión de Recursos Humanos','Seguridad Industrial','Logística','Derecho'],
  'Ciencia y Naturaleza':['Biología','Agronomía','Química','Ciencias Ambientales']
};

const QUESTIONS = [
  ['p1','¿Te gusta ayudar a personas cuando tienen un problema?','Comunicación y Ayuda Social'],
  ['p2','¿Te interesa aprender cómo funcionan las máquinas o aparatos?','Tecnología y Oficios'],
  ['p3','¿Disfrutas dibujar, decorar o crear cosas nuevas?','Arte y Creatividad'],
  ['p4','¿Te gusta organizar actividades o grupos de personas?','Organización y Negocios'],
  ['p5','¿Te gustaría cuidar personas enfermas o ayudar en temas de salud?','Salud y Servicio'],
  ['p6','¿Te gusta trabajar al aire libre o en contacto con la naturaleza?','Ciencia y Naturaleza'],
  ['p7','¿Te sientes cómodo hablando con otras personas?','Comunicación y Ayuda Social'],
  ['p8','¿Te gusta resolver problemas o encontrar soluciones?','Tecnología y Oficios'],
  ['p9','¿Te gustaría enseñar algo a otras personas?','Comunicación y Ayuda Social'],
  ['p10','¿Te gustan los trabajos donde se necesita orden y organización?','Organización y Negocios'],
  ['p11','¿Te interesa construir, reparar o armar cosas?','Tecnología y Oficios'],
  ['p12','¿Te gustan las actividades artísticas como música, pintura, baile o teatro?','Arte y Creatividad'],
  ['p13','¿Te gustaría participar en actividades para ayudar a tu comunidad?','Salud y Servicio'],
  ['p14','¿Te interesa aprender sobre plantas, animales o el medio ambiente?','Ciencia y Naturaleza'],
  ['p15','¿Te gustaría dirigir un negocio o vender productos?','Organización y Negocios'],
  ['p16','¿Te gustan las actividades donde hay acción, movimiento o retos?','Liderazgo y Seguridad'],
  ['p17','¿Te gusta trabajar en equipo?','Liderazgo y Seguridad'],
  ['p18','¿Te interesa usar computadoras, herramientas o tecnología?','Tecnología y Oficios'],
  ['p19','¿Te gustaría trabajar ayudando a niños, jóvenes o familias?','Comunicación y Ayuda Social'],
  ['p20','¿Te gusta tener tus tareas bien planificadas y ordenadas?','Organización y Negocios'],
  ['p21','¿Te gustaría aprender un oficio práctico? (Ejemplo: mecánica, electricidad, carpintería, cocina, soldadura)','Tecnología y Oficios'],
  ['p22','¿Te gusta imaginar ideas nuevas o crear proyectos?','Arte y Creatividad'],
  ['p23','¿Se te facilita áreas académicas relacionadas a la biología, anatomía?','Salud y Servicio'],
  ['p24','¿Te interesa aprender cosas nuevas sobre ciencia o descubrimientos?','Ciencia y Naturaleza']
];

const VALUE_POINTS = {'Me gusta':2,'Más o menos':1,'No me gusta':0};
let starRating = 0;
let currentResult = null;
let showAllCenters = false;

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function normalize(value){
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function uniqueCaseInsensitive(items){
  const seen = new Set();
  return items.filter(item => { const key=normalize(item); if(seen.has(key)) return false; seen.add(key); return true; });
}

function affinityColor(pct){
  if(pct < 34) return '#D6553F';
  if(pct < 80) return '#F59E0B';
  if(pct < 100) return '#4CAF7D';
  return '#25D366';
}

function renderQuestions(){
  const host=document.getElementById('questions');
  host.innerHTML=QUESTIONS.map((q,index)=>`
    <article class="card question-card" id="question-${index+1}" data-question="${q[0]}">
      <span class="q-num">Pregunta ${index+1}</span>
      <p class="q-text">${escapeHtml(q[1])}</p>
      <div class="pills">
        ${['Me gusta','Más o menos','No me gusta'].map(v=>`<label class="pill"><input type="radio" name="${q[0]}" value="${v}"><span>${v}</span></label>`).join('')}
      </div>
    </article>`).join('');
}

function computeScores(){
  const raw={}; const max={};
  Object.keys(AREA_META).forEach(a=>{raw[a]=0;max[a]=0;});
  QUESTIONS.forEach(([id,,area])=>{
    max[area]+=2;
    const checked=document.querySelector(`input[name="${id}"]:checked`);
    if(checked) raw[area]+=VALUE_POINTS[checked.value] ?? 0;
  });
  const pct={};
  Object.keys(raw).forEach(a=>{pct[a]=max[a] ? Math.round((raw[a]/max[a])*100) : 0;});
  return {raw,max,pct};
}

function renderLive(){
  const {raw,pct}=computeScores();
  const host=document.getElementById('liveInterests');
  const activeAreas=Object.keys(AREA_META).filter(area=>raw[area]>0);
  if(!activeAreas.length){
    host.innerHTML='<p class="live-placeholder">Aquí se mostrará la orientación y las áreas recomendadas en tiempo real.</p>';
    return;
  }
  host.innerHTML='<p class="live-placeholder">Se actualiza en tiempo real conforme respondes.</p>'+activeAreas.map(area=>{
    const related=CAREERS_BY_AREA[area]||[];
    return `
    <div class="interest">
      <div class="interest-head"><span>${AREA_META[area].icon} ${area}</span><span class="interest-pct">${pct[area]}%</span></div>
      <div class="interest-bar"><span style="width:${pct[area]}%"></span></div>
      ${related.length?`<div class="career-tags">${related.map(name=>`<span class="career-tag">${escapeHtml(name)}</span>`).join('')}</div>`:''}
    </div>`;
  }).join('');
}

function populateDepartments(){
  const dep=document.getElementById('department');
  CENTER_DATA.departamentos.forEach(name=>{
    const opt=document.createElement('option'); opt.value=name; opt.textContent=name; dep.appendChild(opt);
  });
}
function populateMunicipalities(department){
  const sel=document.getElementById('municipality');
  const customWrap=document.getElementById('customMunicipalityWrap');
  const custom=document.getElementById('customMunicipality');
  customWrap.classList.remove('show'); custom.value='';
  sel.disabled=!department;
  sel.innerHTML='<option value="">Seleccione un municipio</option>';
  if(!department) return;
  (CENTER_DATA.municipios[department]||[]).forEach(name=>{
    const opt=document.createElement('option'); opt.value=name; opt.textContent=name; sel.appendChild(opt);
  });
  const other=document.createElement('option'); other.value='__other__'; other.textContent='Otro municipio del departamento'; sel.appendChild(other);
}
function selectedMunicipality(){
  const sel=document.getElementById('municipality');
  return sel.value==='__other__' ? document.getElementById('customMunicipality').value.trim() : sel.value;
}

function officialAffinity(area, pct){
  if(!area.fuentes?.length) return 0;
  return Math.max(...area.fuentes.map(src=>pct[src]||0));
}
function levelMatch(priority, displayLevel){
  if(displayLevel==='low') return priority==='Baja' || priority==='No priorizada';
  if(displayLevel==='high') return priority==='Muy Alta';
  return priority==='Alta';
}
function eligibleAreas(displayLevel, pct){
  const pool=OFFICIAL_AREAS.map(a=>({...a,affinity:officialAffinity(a,pct)})).filter(a=>levelMatch(a.prioridad,displayLevel) && a.affinity>0).sort((a,b)=>b.affinity-a.affinity || a.nombre.localeCompare(b.nombre));
  const strong=pool.filter(a=>a.affinity>=25);
  return strong.length ? strong : pool.slice(0,1);
}

function allocateDiverse(areas, limit=10){
  if(!areas.length) return [];
  const selected=areas.slice(0,Math.min(areas.length,limit)).map(a=>({...a,slots:1}));
  let used=selected.length;
  while(used<limit){
    const candidates=selected.filter(a=>a.slots<a.carreras.length);
    if(!candidates.length) break;
    candidates.sort((a,b)=>(b.affinity/(b.slots+1))-(a.affinity/(a.slots+1)) || b.affinity-a.affinity);
    candidates[0].slots++; used++;
  }
  return selected.map(a=>({...a,carrerasSeleccionadas:uniqueCaseInsensitive(a.carreras).slice(0,a.slots)}));
}

function allRelevant(displayLevel,pct){
  return eligibleAreas(displayLevel,pct).map(a=>({...a,carrerasSeleccionadas:uniqueCaseInsensitive(a.carreras)}));
}

function renderPriority(hostId, groups){
  const host=document.getElementById(hostId);
  if(!groups.length){host.innerHTML='<p class="empty-result">No se identificaron coincidencias suficientes para este nivel con las respuestas actuales.</p>';return;}
  host.innerHTML=groups.map(g=>{
    return `<div class="area-group" style="--affinity-color:${affinityColor(g.affinity)}"><h4><span>${escapeHtml(g.nombre)}</span><span class="affinity-badge">${g.affinity}% afinidad</span></h4><ul class="career-list">${g.carrerasSeleccionadas.map(c=>`<li>${escapeHtml(c)}</li>`).join('')}</ul></div>`;
  }).join('');
}

function findCenters(){
  const department=document.getElementById('department').value;
  const municipality=selectedMunicipality();
  const deptCenters=CENTER_DATA.centros.filter(c=>normalize(c.departamento)===normalize(department));
  const exact=deptCenters.filter(c=>normalize(c.municipio)===normalize(municipality));
  if(exact.length) return {centers:exact,scope:'municipio',message:''};
  if(deptCenters.length) return {centers:deptCenters,scope:'departamento',message:'No encontramos centros registrados específicamente en tu municipio; te mostramos opciones disponibles en tu departamento.'};
  return {centers:[],scope:'sin-registros',message:`Actualmente no contamos con centros registrados para ${department} en la base de referencia.`};
}

function centerCard(c){
  const website=c.sitio_web?`<p><strong>Sitio web:</strong> <a href="${escapeHtml(c.sitio_web)}" target="_blank" rel="noreferrer">${escapeHtml(c.sitio_web)}</a></p>`:'';
  return `<article class="center-item"><h4>${escapeHtml(c.nombre)}</h4><p>${escapeHtml(c.tipo||'')} · ${escapeHtml(c.sector||'')}</p><p><strong>Municipio:</strong> ${escapeHtml(c.municipio)}</p>${c.direccion?`<p><strong>Dirección:</strong> ${escapeHtml(c.direccion)}</p>`:''}${c.telefono?`<p><strong>Teléfono:</strong> ${escapeHtml(c.telefono)}</p>`:''}${website}</article>`;
}
function renderCenters(result){
  const msg=document.getElementById('fallbackMessage');
  msg.classList.toggle('show',Boolean(result.message)); msg.textContent=result.message;
  const grid=document.getElementById('centersGrid');
  const toggle=document.getElementById('toggleCenters');
  if(!result.centers.length){grid.innerHTML='<p class="empty-result">No hay centros para mostrar con los datos actuales.</p>';toggle.hidden=true;return;}
  const visible=showAllCenters?result.centers:result.centers.slice(0,8);
  grid.innerHTML=visible.map(centerCard).join('');
  toggle.hidden=result.centers.length<=8;
  if(!toggle.hidden) toggle.textContent=showAllCenters?'Mostrar menos':`Ver todos los centros (${result.centers.length})`;
}

function validateForm(){
  document.querySelectorAll('.question-card').forEach(c=>c.classList.remove('missing'));
  document.getElementById('participantCard').classList.remove('missing');
  document.getElementById('feedbackCard').classList.remove('missing');
  const missingQuestions=[];
  QUESTIONS.forEach(([id],i)=>{if(!document.querySelector(`input[name="${id}"]:checked`)){missingQuestions.push(i+1);document.querySelector(`[data-question="${id}"]`).classList.add('missing');}});
  const name=document.getElementById('fullName').value.trim();
  const email=document.getElementById('email').value.trim();
  const department=document.getElementById('department').value;
  const municipalityValue=document.getElementById('municipality').value;
  const municipality=selectedMunicipality();
  const personalMissing=!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !department || !municipalityValue || !municipality;
  if(personalMissing) document.getElementById('participantCard').classList.add('missing');
  if(starRating===0) document.getElementById('feedbackCard').classList.add('missing');
  const messages=[];
  if(personalMissing) messages.push('Completa nombre, correo, departamento y municipio.');
  if(missingQuestions.length) messages.push(`Preguntas pendientes: ${missingQuestions.join(', ')}.`);
  if(starRating===0) messages.push('Selecciona una calificación de 1 a 5 estrellas.');
  return {ok:messages.length===0,messages};
}

function buildResults(){
  const scores=computeScores();
  const high=allocateDiverse(eligibleAreas('high',scores.pct),10);
  const medium=allocateDiverse(eligibleAreas('medium',scores.pct),10);
  const low=allocateDiverse(eligibleAreas('low',scores.pct),10);
  const centers=findCenters();
  currentResult={scores,high,medium,low,centers,all:{high:allRelevant('high',scores.pct),medium:allRelevant('medium',scores.pct),low:allRelevant('low',scores.pct)}};
  renderPriority('highPriority',high); renderPriority('mediumPriority',medium); renderPriority('lowPriority',low);
  showAllCenters=false; renderCenters(centers);
  const top=Object.entries(scores.pct).sort((a,b)=>b[1]-a[1]).slice(0,3);
  document.getElementById('resultSummary').innerHTML=top.map(([area,pct])=>`<span class="summary-chip" style="--affinity-color:${affinityColor(pct)}">${escapeHtml(area)}: ${pct}%</span>`).join('');
  const results=document.getElementById('results'); results.classList.add('show');
  setTimeout(()=>results.scrollIntoView({behavior:'smooth',block:'start'}),80);
}

function reportPriority(title, groups){
  if(!groups.length) return `<section><h2>${title}</h2><p>No se identificaron coincidencias suficientes para este nivel.</p></section>`;
  return `<section><h2>${title}</h2>${groups.map(g=>`<div class="pdf-area"><h3>${escapeHtml(g.nombre)} <small style="background:${affinityColor(g.affinity)}">${g.affinity}% de afinidad</small></h3><ul>${g.carrerasSeleccionadas.map(c=>`<li>${escapeHtml(c)}</li>`).join('')}</ul></div>`).join('')}</section>`;
}
function printReport(){
  if(!currentResult) return;
  const name=document.getElementById('fullName').value.trim();
  const email=document.getElementById('email').value.trim();
  const dep=document.getElementById('department').value;
  const mun=selectedMunicipality();
  const top=Object.entries(currentResult.scores.pct).sort((a,b)=>b[1]-a[1]);
  const gov=new URL('assets/gobierno-logo.png',location.href).href;
  const becas=new URL('assets/becas-logo.png',location.href).href;
  const centerHtml=currentResult.centers.centers.length?currentResult.centers.centers.map(c=>`<tr><td>${escapeHtml(c.nombre)}</td><td>${escapeHtml(c.tipo||'')}</td><td>${escapeHtml(c.sector||'')}</td><td>${escapeHtml(c.municipio||'')}</td><td>${escapeHtml(c.direccion||'')}</td><td>${escapeHtml(c.telefono||'')}</td><td>${escapeHtml(c.sitio_web||'')}</td></tr>`).join(''):'<tr><td colspan="7">No hay centros registrados para la ubicación indicada.</td></tr>';
  const w=window.open('','_blank');
  if(!w){alert('El navegador bloqueó la ventana del reporte. Habilita ventanas emergentes para generar el PDF.');return;}
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Resultados completos del Test de Orientación Vocacional - ${escapeHtml(name)}</title><style>
    @page{size:letter landscape;margin:.45in}*{box-sizing:border-box}html,body{width:auto;height:auto}body{font-family:Arial,sans-serif;color:#17345f;margin:0;font-size:8.5pt;line-height:1.3;-webkit-print-color-adjust:exact;print-color-adjust:exact}header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0d5eb6;padding-bottom:7px;margin-bottom:10px;break-inside:avoid}header img:first-child{width:44px}header img:last-child{width:115px}h1{text-align:center;color:#0d5eb6;font-size:17pt;margin:0 0 3px}.sub{text-align:center;color:#61708a;margin-bottom:10px}.data{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 14px;background:#f4f8fd;padding:8px 10px;border-radius:7px;break-inside:avoid}.data div{break-inside:avoid}h2{color:#0f2f70;font-size:12pt;border-bottom:1px solid #c8d8eb;padding-bottom:3px;margin:13px 0 7px;break-after:avoid}h3{font-size:9.5pt;margin:8px 0 4px;color:#1c5596;break-after:avoid}h3 small{display:inline-block;margin-left:4px;padding:2px 6px;border-radius:999px;color:#fff;font-weight:bold}ul{margin:3px 0 7px;padding-left:17px;columns:3;column-gap:22px}li{break-inside:avoid;margin-bottom:1px}.affinity{display:flex;flex-wrap:wrap;gap:5px;break-inside:avoid}.chip{border-radius:999px;padding:4px 8px;color:#fff;font-weight:bold}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:7pt}thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}th,td{border:1px solid #d9e2ee;padding:4px;vertical-align:top;overflow-wrap:anywhere}th{background:#0f2f70;color:#fff}.pdf-area{break-inside:auto}.pdf-area h3{break-after:avoid}.location-msg{background:#fff8e3;border-left:4px solid #e0a51d;padding:6px 8px;margin:6px 0 8px;break-inside:avoid}@media print{button{display:none}a{color:inherit;text-decoration:none}section{break-inside:auto}}
  </style></head><body><header><img src="${gov}"><div><h1>Resultados completos del Test de Orientación Vocacional</h1><div class="sub">Documento completo · Becas por Nuestro Futuro</div></div><img src="${becas}"></header>
  <div class="data"><div><strong>Participante:</strong> ${escapeHtml(name)}</div><div><strong>Correo:</strong> ${escapeHtml(email)}</div><div><strong>Departamento:</strong> ${escapeHtml(dep)}</div><div><strong>Municipio:</strong> ${escapeHtml(mun)}</div><div><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-GT')}</div></div>
  <section><h2>Perfil completo de afinidad</h2><div class="affinity">${top.map(([a,p])=>`<span class="chip" style="background:${affinityColor(p)}">${escapeHtml(a)}: ${p}%</span>`).join('')}</div></section>
  ${reportPriority('Carreras Alta Prioridad',currentResult.all.high)}
  ${reportPriority('Carreras Media Prioridad',currentResult.all.medium)}
  ${reportPriority('Carreras Baja Prioridad',currentResult.all.low)}
  <section><h2>Centros de estudio disponibles</h2>${currentResult.centers.message?`<div class="location-msg">${escapeHtml(currentResult.centers.message)}</div>`:''}<table><thead><tr><th>Centro</th><th>Tipo</th><th>Sector</th><th>Municipio</th><th>Dirección</th><th>Teléfono</th><th>Sitio web</th></tr></thead><tbody>${centerHtml}</tbody></table></section>
  </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>w.print(),650);
}

renderQuestions(); renderLive(); populateDepartments();
document.getElementById('vocationalForm').addEventListener('change',renderLive);
document.getElementById('department').addEventListener('change',e=>populateMunicipalities(e.target.value));
document.getElementById('municipality').addEventListener('change',e=>{
  const wrap=document.getElementById('customMunicipalityWrap');
  wrap.classList.toggle('show',e.target.value==='__other__');
  if(e.target.value==='__other__') document.getElementById('customMunicipality').focus();
});
document.querySelectorAll('.star').forEach(btn=>btn.addEventListener('click',()=>{
  starRating=Number(btn.dataset.value); document.querySelectorAll('.star').forEach(s=>s.classList.toggle('on',Number(s.dataset.value)<=starRating));
}));
document.getElementById('showResults').addEventListener('click',()=>{
  const check=validateForm(); const alertBox=document.getElementById('formAlert');
  if(!check.ok){alertBox.textContent=check.messages.join(' ');alertBox.classList.add('show');const first=document.querySelector('.card.missing,.question-card.missing');if(first) first.scrollIntoView({behavior:'smooth',block:'center'});return;}
  alertBox.classList.remove('show'); buildResults();
});
document.getElementById('toggleCenters').addEventListener('click',()=>{if(!currentResult)return;showAllCenters=!showAllCenters;renderCenters(currentResult.centers);});
document.getElementById('pdfButton').addEventListener('click',printReport);
