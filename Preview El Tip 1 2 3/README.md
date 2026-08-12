# Preview — Becas por Nuestro Futuro

Proyecto estático para Visual Studio Code / Live Server que simula el recorrido propuesto del portal.

## Abrir el proyecto
1. Abre esta carpeta en Visual Studio Code.
2. Instala o usa la extensión **Live Server**.
3. Abre `index.html` con **Open with Live Server**.

No se requiere servidor de base de datos ni instalación de paquetes.

## Flujo principal
- La página principal inicia con la pregunta **¿Ya sabes qué quieres estudiar y dónde?**.
- **Sí, ya lo tengo claro** desplaza la vista hacia **Registrarse / Iniciar sesión**.
- **No, necesito orientación** muestra el acceso a `testvocacional-pc.html`.
- Cada tipo de beca tiene un botón **Ver requisitos** con la información proporcionada para:
  - Pregrado.
  - Posgrado (maestría y doctorado).
  - Cursos técnicos no universitarios.
- Se omitió la nota final de orientación de los cuadros de requisitos y se excluyeron los Cursos de Especialización según lo solicitado.

## Inicio de sesión simulado
- Usuario/CUI: `2743006130108`
- Contraseña: `password`

El login es solamente una simulación local. Al ingresar correctamente se muestra `portal.html` con:
- bienvenida del postulante;
- banner y cuenta regresiva;
- `avance.html` integrado;
- sección **Mi postulación actual**.

## Test vocacional
Ponderación:
- Me gusta = 2 puntos
- Más o menos = 1 punto
- No me gusta = 0 puntos

La recomendación cruza la afinidad del test con las áreas priorizadas proporcionadas y muestra en pantalla **hasta 10 carreras por nivel**, procurando diversidad entre las áreas con mayor afinidad:
- Prioridad Muy Alta → **Carreras Alta Prioridad**.
- Prioridad Alta → **Carreras Media Prioridad**.
- Prioridad Baja + No priorizada → **Carreras Baja Prioridad**.

## Centros de estudio
La base se convirtió a datos locales para la maqueta.
- Primero se buscan centros registrados en el municipio seleccionado.
- Si no hay coincidencias, se muestra: **“No encontramos centros registrados específicamente en tu municipio; te mostramos opciones disponibles en tu departamento.”**
- La base suministrada no contiene registros para Chiquimula. La aplicación conserva Chiquimula como opción y muestra una advertencia sin inventar centros.
- Se corrigieron tres registros de Alta Verapaz que tenían dirección/teléfono desplazados de columna.

La versión corregida de la base se encuentra en `data/Base centro de estudio por departamento_corregida.xlsx` y contiene una hoja `Validación` con el detalle.

## PDF de resultados
Después de completar el test aparece **Generar / imprimir PDF de resultados**.
El botón abre una vista de reporte optimizada para impresión con texto seleccionable y estructurado. En el cuadro de impresión del navegador selecciona **Guardar como PDF** para conservarlo en el equipo, o selecciona una impresora para imprimirlo.

El reporte incluye datos del participante, afinidades, carreras recomendadas agrupadas por prioridad y centros de estudio disponibles. No se implementa envío por correo; ese servicio queda fuera de esta maqueta para una integración futura.
