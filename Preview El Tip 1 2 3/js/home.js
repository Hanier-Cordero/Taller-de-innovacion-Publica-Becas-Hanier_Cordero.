const yesBtn = document.getElementById('choiceYes');
const noBtn = document.getElementById('choiceNo');
const nextBox = document.getElementById('orientationNext');
const access = document.getElementById('orientationAccess');

const hero = document.querySelector('.hero');
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = Array.from(document.querySelectorAll('.hero-dots button'));
let activeHeroSlide = 0;
let heroTimer;

function showHeroSlide(index) {
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === activeHeroSlide));
  heroDots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeHeroSlide;
    dot.classList.toggle('active', active);
    if (active) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}

function startHeroCarousel() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => showHeroSlide(activeHeroSlide + 1), 5000);
}

heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
  showHeroSlide(index);
  startHeroCarousel();
}));
hero.addEventListener('mouseenter', () => clearInterval(heroTimer));
hero.addEventListener('mouseleave', startHeroCarousel);
hero.addEventListener('focusin', () => clearInterval(heroTimer));
hero.addEventListener('focusout', startHeroCarousel);
document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(heroTimer) : startHeroCarousel());
startHeroCarousel();

yesBtn.addEventListener('click', () => {
  nextBox.classList.remove('show');
  noBtn.setAttribute('aria-expanded', 'false');
  access.classList.add('show');
  yesBtn.setAttribute('aria-expanded', 'true');
});
noBtn.addEventListener('click', () => {
  access.classList.remove('show');
  yesBtn.setAttribute('aria-expanded', 'false');
  nextBox.classList.add('show');
  noBtn.setAttribute('aria-expanded', 'true');
});

const requirements = {
  pregrado: {
    title: 'PREGRADO (TÉCNICO UNIVERSITARIO Y/O LICENCIATURA/INGENIERÍA)',
    html: `
      <h3>Descripción y requisitos</h3>
      <p><strong>Para iniciar, continuar o finalizar carrera</strong></p>
      <ul>
        <li>Debes tener el diversificado concluido.</li>
        <li>Si aplicas para un centro educativo público debes realizar examen de admisión; si es privado solicita más información <strong>(según fechas establecidas por el centro educativo)</strong>.</li>
      </ul>
      <h3>Documentación</h3>
      <ol>
        <li>DPI o certificado de nacimiento <strong>(si eres adolescente)</strong>.</li>
        <li>Recibo de luz o constancia domiciliar.</li>
        <li>Fotografías: frente casa, cocina, foto familiar y foto personal medio cuerpo <strong>(no selfie)</strong>.</li>
        <li>Constancia médica de discapacidad <strong>(si aplica)</strong>.</li>
        <li>Diploma, cierre de pénsum o título del último grado aprobado <strong>(si es para iniciar)</strong>.</li>
        <li>Cursos aprobados si ya estás estudiando <strong>(si no obviar este paso)</strong>.</li>
        <li>Carta de admisión/inscripción o recibo de pago de inscripción.</li>
        <li>Asignación de cursos.</li>
        <li>Carta de costos o trifoliar con la información de las cuotas <strong>(si el centro educativo es privado)</strong>.</li>
        <li>Pénsum (son las materias o asignaturas que debes estudiar durante la carrera).</li>
        <li>Calendario académico del año en curso.</li>
        <li>Cartas de referencia académica y/o trabajo comunitario.</li>
      </ol>`
  },
  posgrado: {
    title: 'POSGRADO (MAESTRÍA Y DOCTORADO)',
    html: `
      <h3>Descripción y requisitos</h3>
      <p><strong>Para iniciar, continuar o finalizar carrera</strong></p>
      <ul>
        <li>Tener promedio de 80 pts.</li>
        <li>Para maestría debes tener el cierre de pénsum (aplica para recién graduado) o título de la licenciatura.</li>
        <li>Para doctorado debes tener el cierre de pénsum (aplica para recién graduado) o título de la maestría.</li>
        <li>Verifica los requisitos que la universidad solicita para tu ingreso.</li>
      </ul>
      <h3>Documentación</h3>
      <ol>
        <li>DPI.</li>
        <li>Recibo de luz o constancia domiciliar.</li>
        <li>Fotografías: frente casa, cocina, foto familiar y foto personal medio cuerpo <strong>(no selfie)</strong>.</li>
        <li>Constancia médica de discapacidad <strong>(si aplica)</strong>.</li>
        <li>Certificado de notas del último grado aprobado o cursos aprobados actuales, con 80 pts de promedio o documento percentil.</li>
        <li>Título del último grado aprobado o cierre de pénsum para recién graduados <strong>(si es para iniciar)</strong>.</li>
        <li>Cursos aprobados si ya estás estudiando <strong>(si no obviar este paso)</strong>.</li>
        <li>Carta de admisión/inscripción o recibo de pago de inscripción.</li>
        <li>Asignación de cursos.</li>
        <li>Carta de costos o trifoliar con la información de los costos <strong>(si el centro educativo es privado)</strong>.</li>
        <li>Pénsum.</li>
        <li>Calendario académico del año en curso.</li>
        <li>Cartas de referencia académica y/o trabajo comunitario.</li>
      </ol>`
  },
  tecnico: {
    title: 'CARRERAS O CURSOS TÉCNICOS',
    html: `
      <h3>Descripción y requisitos</h3>
      <p><strong>Para iniciar, continuar o finalizar carrera/curso</strong></p>
      <ul>
        <li>Puede ser desde 6to primaria, 3ero básico y/o diversificado, según requisito de la carrera/curso a elegir.</li>
        <li>Si aplicas para un centro educativo público debes realizar examen de admisión; si es privado solicita más información <strong>(según fechas establecidas por el centro educativo)</strong>.</li>
      </ul>
      <h3>Documentación</h3>
      <ol>
        <li>DPI o certificado de nacimiento si eres adolescente.</li>
        <li>Recibo de luz o constancia domiciliar.</li>
        <li>Fotografías: frente casa, cocina, foto familiar y foto personal medio cuerpo <strong>(no selfie)</strong>.</li>
        <li>Constancia médica de discapacidad <strong>(si aplica)</strong>.</li>
        <li>Diploma o título del último grado aprobado <strong>(si es para iniciar)</strong>.</li>
        <li>Cursos aprobados si ya estás estudiando.</li>
        <li>Carta de admisión/inscripción o recibo de pago de inscripción.</li>
        <li>Carta de costos o trifoliar con información de las cuotas <strong>(si el centro educativo es privado)</strong>.</li>
        <li>Pénsum (son las materias o asignaturas que debes estudiar durante la carrera/curso).</li>
        <li>Calendario académico del año en curso.</li>
        <li>Cartas de referencia académica y/o trabajo comunitario.</li>
      </ol>
      <div class="intecap-note"><strong>Si vas a estudiar en el INTECAP</strong> deberás presentar la <strong>Boleta de Inscripción</strong> que contiene: Calendario, Costos y Pénsum.</div>`
  }
};

const modal = document.getElementById('requirementsModal');
const modalTitle = document.getElementById('requirementsTitle');
const modalBody = document.getElementById('requirementsBody');
const closeBtn = modal.querySelector('.modal-close');

document.querySelectorAll('[data-requirement]').forEach(btn => {
  btn.addEventListener('click', () => {
    const data = requirements[btn.dataset.requirement];
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.html;
    modal.classList.add('open');
    document.body.style.overflow='hidden';
  });
});
function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {if(e.target===modal) closeModal();});
document.addEventListener('keydown', e => {if(e.key==='Escape') closeModal();});

const universityAccess = document.getElementById('universityAccess');
const universityTrigger = universityAccess.querySelector('.university-trigger');
const universityForm = document.getElementById('universityLoginForm');
const universityUser = document.getElementById('universityUser');
const universityPassword = document.getElementById('universityPassword');
const universityError = document.getElementById('universityLoginError');

universityTrigger.addEventListener('click', () => {
  const isOpen = universityAccess.classList.toggle('open');
  universityTrigger.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) universityUser.focus();
});

universityForm.addEventListener('submit', event => {
  event.preventDefault();
  if (universityUser.value.trim().toLowerCase() === 'admin' && universityPassword.value === 'password123') {
    const adminLoginForm = document.createElement('form');
    adminLoginForm.method = 'post';
    adminLoginForm.action = 'admin/login.php';
    adminLoginForm.hidden = true;
    const adminUser = document.createElement('input');
    adminUser.name = 'usuario';
    adminUser.value = 'admin';
    const adminPassword = document.createElement('input');
    adminPassword.name = 'password';
    adminPassword.value = 'password123';
    adminLoginForm.append(adminUser, adminPassword);
    document.body.appendChild(adminLoginForm);
    adminLoginForm.submit();
    return;
  }
  if (universityUser.value.trim().toUpperCase() === 'UVG' && universityPassword.value === 'password') {
    sessionStorage.setItem('universidadAutenticada', 'UVG');
    window.location.href = 'universidades.html';
    return;
  }
  universityError.classList.add('show');
  universityPassword.select();
});

[universityUser, universityPassword].forEach(input => {
  input.addEventListener('input', () => universityError.classList.remove('show'));
});
