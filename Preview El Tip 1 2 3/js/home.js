const yesBtn = document.getElementById('choiceYes');
const noBtn = document.getElementById('choiceNo');
const nextBox = document.getElementById('orientationNext');
const access = document.getElementById('orientationAccess');

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
