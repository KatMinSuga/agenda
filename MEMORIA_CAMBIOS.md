# 🧠 MEMORIA Y REGISTRO DE CAMBIOS DEL PROYECTO
## Agenda Digital Web · Metáfora Notes Hipervinculada

> **REGLA DE ORO DE DESARROLLO (DIRECTIVA PERMANENTE):**  
> ⚠️ **NO MODIFICAR NI ELIMINAR NINGUNA FUNCIONALIDAD, ESTILO O COMPONENTE EXISTENTE SIN QUE EL USUARIO LO PIDA EXPLÍCITAMENTE.**  
> Este documento actúa como la **memoria central** del asistente. Cada petición del usuario, cambio realizado y decisión de diseño debe registrarse aquí de forma cronológica y detallada.

---

## 📌 Inventario de Módulos y Funcionalidades Activas (Base Intocable)

Las siguientes características forman la base consolidada del sistema y **NO deben alterarse ni eliminarse** salvo indicación explícita del usuario:

1. **Diseño y Estética GoodNotes:**
   - Cubierta exterior de cuero con costuras artesanales perimetrales.
   - Lomo con espiral de anillas metálicas en 3D (`planner-spine-rings`).
   - Papel marfil con trama punteada (*Dot Grid* de 5mm) y papel pautado para notas.
   - Pestañas divisorias laterales hipervinculadas con relieve y código de color por módulo.
   - Cintas marcapáginas superiores (*Ribbon Bookmarks*) con acceso rápido a *Hoy*, *Proyectos* y *VA Hub*.
   - 4 Temas visuales: *Cuero Caramelo*, *Rosa Cuarzo*, *Medianoche Ejecutivo (Modo Oscuro)* y *Verde Salvia*.
   - Sonidos táctiles sintetizados con Web Audio API (pasar hoja, clics de tareas, campanilla Pomodoro) sin dependencias externas.

2. **Herramientas Anti-Distracción y Enfoque:**
   - **Modo Enfoque Zen (tecla `F`):** Oculta distracciones y deja solo la hoja de trabajo.
   - **Paleta de Comandos Universal (`Ctrl+K` / `Cmd+K`):** Buscador tipo Spotlight en tiempo real.
   - **Atajos de teclado:** Teclas `1` a `9` para cambio directo de pestañas, `N` para modal rápido, `Esc` para cerrar modales.
   - **Método Ivy Lee (Top 3 Prioridades):** Destaca las 3 tareas clave del día.
   - **Temporizador Pomodoro / Deep Work:** Bloques de 25 min de trabajo y 5 min de descanso con audio integrado.

3. **Módulos Operativos (12 Secciones):**
   - **01. Hoy (Dashboard):** Métricas del día, prioridades, timeline horario, Pomodoro y Post-it adhesivo con autoguardado.
   - **02. Agenda (Calendario):** Vistas Anual (12 meses hipervinculados), Mensual, Semanal y Diaria (*time blocking*), detector de conflictos de horario y exportador `.ics`.
   - **03. Tareas:** Lista y Tablero Kanban interactivo, subtareas con barra de progreso, prioridades por color y recurrencia.
   - **04. Proyectos:** Cálculo automático de avance %, control de presupuesto ejercido vs asignado y lista de hitos/entregables.
   - **05. VA Hub (Asistente Virtual):** Cronómetro en vivo de horas facturables/no facturables, barra de paquete de horas contratadas vs usadas, solicitudes de clientes y enlace a bóvedas 1Password/Bitwarden.
   - **06. Equipo & Contactos:** Directorio de contactos con historial y fechas de seguimiento; gestión de colaboradores con turnos y asistencia.
   - **07. Finanzas:** Balance neto, ingresos, gastos, facturas por cobrar, alertas de renovación de suscripciones y presupuesto mensual por categoría.
   - **08. Notas & Actas:** Cuaderno pautado digital con autoguardado, minutas de reunión con lista de acuerdos y plantillas (1:1, Brief, Planificación semanal).
   - **09. Vida Personal:** *Habit Tracker* semanal interactivo con cálculo de rachas de días, rutinas de mañana/tarde/noche, metas de vida y lista de compras.
   - **10. Automatizaciones:** Reglas *Trigger ➔ Acción*, auditoría de tareas urgentes con un clic y notificaciones.
   - **11. Reportes:** Gráficos con Chart.js, exportación a Excel (CSV) y vista de impresión a PDF.
   - **12. Ajustes:** Selector de temas, interruptor de efectos de sonido y respaldo completo en archivo JSON (exportar/importar).

4. **Persistencia y Privacidad:**
   - Todo se almacena localmente en `localStorage` (cero servidores externos, 100% privado y offline).

---

## 📜 Historial Cronológico de Cambios y Peticiones del Usuario

### [Entrada 001] — 08/10/2026 · Creación Inicial del Proyecto
* **Petición del Usuario:**
  > Crear una agenda digital web inspirada en los planificadores con hipervínculos de GoodNotes, fácil de entender, orientada a optimizar el tiempo al máximo y evitar distracciones, cubriendo los 13 bloques de gestión personal, empresarial y de Asistente Virtual (VA).
* **Acciones Realizadas:**
  - Arquitectura completa en HTML5, CSS3 modular y JavaScript ES6 reactivo con `localStorage`.
  - Creación de los 12 módulos funcionales con precarga de datos de demostración profesionales.
  - Implementación de la metáfora visual completa de GoodNotes (anillas 3D, cubierta de piel, pestañas y marcapáginas).
  - Implementación de sintetizador de audio táctil offline (`js/audio.js`).
  - Creación de [README.md](file:///c:/Users/KATMIN/Desktop/portafolio/pro%201%20agenda/README.md) y [package.json](file:///c:/Users/KATMIN/Desktop/portafolio/pro%201%20agenda/package.json).
* **Archivos Afectados:**
  - `index.html`
  - `css/planner-book.css`
  - `css/modules.css`
  - `css/themes.css`
  - `js/store.js`
  - `js/audio.js`
  - `js/tasks.js`
  - `js/calendar.js`
  - `js/projects.js`
  - `js/vabox.js`
  - `js/contacts-team.js`
  - `js/finance.js`
  - `js/notes.js`
  - `js/personal.js`
  - `js/automations.js`
  - `js/reports.js`
  - `js/dashboard.js`
  - `js/settings.js`
  - `js/app.js`

---

### [Entrada 002] — 08/10/2026 · Creación del Sistema de Memoria y Control de Cambios
* **Petición del Usuario:**
  > *"quiero que hagas un md registrando todos los cambios que te pida y los guardes y modifiques segun lo que pida para que te sirva de memoria y no modifiques cosas sin que te lo pida"*
* **Acciones Realizadas:**
  - Creación de este archivo `MEMORIA_CAMBIOS.md` como fuente de verdad y registro estricto.
  - Establecimiento de la directiva inviolable: **No modificar ni retirar código/diseño existente sin instrucción expresa del usuario**.
  - Documentación del estado base de todos los módulos para proteger su integridad ante futuras modificaciones.
* **Archivos Creados:**
  - `MEMORIA_CAMBIOS.md`

---

### [Entrada 003] — 08/10/2026 · Sustitución Global de Marca: "GoodNotes" ➔ "Notes"
* **Petición del Usuario:**
  > *"borra cualquien palabra que haga referencia a goodnotes y solo pon notes"* (acompañado de captura del distintivo del encabezado `GOODNOTES WEB`).
* **Acciones Realizadas:**
  - Sustitución visual del distintivo del encabezado principal en `index.html`: de `GOODNOTES WEB` a `NOTES WEB`.
  - Actualización del `<title>` de la aplicación a `Agenda Digital Notes · Planificador de Alto Rendimiento`.
  - Reemplazo y saneamiento de selectores CSS y clases:
    - `.task-card-goodnotes` ➔ `.task-card-notes`.
    - `.goodnotes-table` ➔ `.notes-table`.
    - `.year-view-goodnotes` ➔ `.year-view-notes`.
  - Actualización de comentarios, textos descriptivos y marcas en todos los archivos de estilo (`css/planner-book.css`, `css/modules.css`, `css/themes.css`).
  - Actualización de identificadores y textos en todos los módulos JavaScript (`js/app.js`, `js/audio.js`, `js/calendar.js`, `js/dashboard.js`, `js/finance.js`, `js/notes.js`, `js/personal.js`, `js/reports.js`, `js/settings.js`, `js/store.js`, `js/tasks.js`).
  - Claves de almacenamiento local actualizadas a `notes_planner_db_v1` y `notes_quick_brain_dump` con compatibilidad de migración de datos previos.
  - Actualización de `package.json` y `README.md`.
* **Archivos Modificados:**
  - `index.html`
  - `css/planner-book.css`
  - `css/modules.css`
  - `css/themes.css`
  - `js/store.js`
  - `js/audio.js`
  - `js/calendar.js`
  - `js/tasks.js`
  - `js/dashboard.js`
  - `js/finance.js`
  - `js/notes.js`
  - `js/personal.js`
  - `js/reports.js`
  - `js/settings.js`
  - `js/app.js`
  - `package.json`
  - `README.md`
  - `MEMORIA_CAMBIOS.md`

---

### [Entrada 004] — 09/10/2026 · Inicialización de Repositorio Git y Push a GitHub
* **Petición del Usuario:**
  > *"inicializame un repositorio en github y realiza el push de la pagina"* (URL proporcionada: `https://github.com/KatMinSuga/agenda.git`).
* **Acciones Realizadas:**
  - Creación del archivo `.gitignore` para exclusión de dependencias y archivos temporales del sistema operativo.
  - Inicialización del repositorio Git local (`git init`).
  - Creación y cambio a la rama principal estándar `main` (`git branch -M main`).
  - Preparación y empaquetado del primer commit con todo el código base de la agenda y su documentación viva.
  - Vinculación con el repositorio remoto: `git remote add origin https://github.com/KatMinSuga/agenda.git`.
  - Ejecución del push hacia la rama principal: `git push -u origin main`.
* **Archivos Creados/Afectados:**
  - `.gitignore`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 005] — 09/10/2026 · Avatar Anti-Deformación (Gatito), Ambientación Harry Potter y Motor Predictivo de Tiempos y Costos
* **Petición del Usuario:**
  > *"quiero que mejores esto para que no se vea aplaztado si puedes pon la imagen de un gatito o un pinguino muy general para llenar el circulo del perfil, quiero que cambies toda la informacion de la pagina con datos como (nombres, direcciones, etc) y uses estos mismos sacados de harry potter para que no sea tan formal y los ejemplos sean faciles de entender, quiero que mejores el modulo de reglas automaticas y alertas, quiero que pueda existir total control para cada regla, horario y prediccion, tanto de tiempos como costos para tener buenos recordatorios a medida"*
* **Acciones Realizadas:**
  1. **Solución Definitiva de Avatar Circular Anti-Deformación:**
     - Creación de avatares vectoriales SVG escalables en la carpeta `assets/`: `assets/avatar-cat.svg` (gatito Crookshanks con gafas redondas y bufanda Gryffindor) y `assets/avatar-penguin.svg` (pingüino con sombrero mágico de copa).
     - Aplicación de restricciones CSS estrictas en `css/planner-book.css` (`#user-header-avatar`, `.user-avatar-circle`): `width: 40px`, `height: 40px`, `min-width: 40px`, `min-height: 40px`, `aspect-ratio: 1 / 1`, `border-radius: 50% !important`, `flex-shrink: 0`, `overflow: hidden`, `object-fit: cover`.
     - Actualización del encabezado en `index.html` y del método reactivo `updateTopHeader()` en `js/app.js` para renderizar el gatito de Hermione Granger sin deformación elíptica.
  2. **Transformación Temática Total al Universo Harry Potter:**
     - Actualización integral de la base de datos local en `js/store.js` (clave de almacenamiento actualizada a `notes_planner_db_hp_v2` para autoinstalación limpia):
       - **Perfil:** Hermione Granger (Prefecta Principal & Directora de Operaciones Mágicas en Hogwarts y S.P.E.W. / P.E.D.D.O.).
       - **Moneda:** Galeones de oro (🪙 G).
       - **Tareas:** Auditoría de ingredientes de Poción Multijugos en las mazmorras con Snape, calibración del Giratiempo con McGonagall, revisión de presupuesto para Sortilegios Weasley, informe de derechos de elfos domésticos para el Ministerio.
       - **Calendario / Eventos:** Aritmancia predictiva con Profesora Vector, ronda nocturna de prefectos por pasillos de Hogwarts, almuerzo y cerveza de mantequilla en Las Tres Escobas, reunión comercial con Fred & George, asamblea de la Orden en el despacho de Dumbledore.
       - **Proyectos:** Defensa del Castillo y Encantamientos Protectores, Optimización del Cronograma de Aulas con Giratiempo, Expansión de Sortilegios Weasley a Hogsmeade.
       - **Clientes / VA Hub:** Fred & George Weasley (Sortilegios Weasley), Profesora Minerva McGonagall (Hogwarts), Xenophilius Lovegood (El Quisquilloso).
       - **Equipo:** Hermione Granger, Harry Potter, Ron Weasley, Luna Lovegood.
       - **Contactos:** Albus Dumbledore, Severus Snape, Fred & George Weasley, Madame Rosmerta, Garrick Ollivander.
       - **Finanzas:** Presupuesto de 8,500 Galeones, transacciones con bóveda de Gringotts, materiales de pociones, calderos, pergaminos de vitela y suscripciones a lechuzas mensajeras rápidas.
       - **Notas:** Minuta del Ejército de Dumbledore en la Sala de los Menesteres, protocolo de formulación de pociones, notas sobre Crookshanks y el Giratiempo.
       - **Vida Personal:** Hábitos mágicos (lectura de Historia de la Magia, Patronus nutria, paseo junto al Lago Negro, cepillado de Crookshanks), rutinas de prefectura y metas de T.I.M.O.s.
  3. **Motor Predictivo de Tiempos y Costos con Control Total de Reglas:**
     - Implementación del algoritmo `runPredictionsDiagnostic()` en `js/store.js`:
       - **Predicción de Tiempos:** Evalúa horas de holgura restantes antes del vencimiento en tiempo real (`hoursRemaining`), porcentaje de subtareas completadas y semáforo de riesgo (Crítico, Alerta, En Plazo).
       - **Predicción de Costos:** Evalúa proyectos y paquetes de horas de clientes contra umbrales porcentuales configurables (70%, 80%, 85%, 90%, 100%, 110%) calculando desvíos futuros en Galeones.
     - Rediseño completo de la interfaz de `js/automations.js`:
       - Cockpit KPI con 4 tarjetas de diagnóstico en vivo (Reglas activas, Riesgo de tiempos, Desvíos de costos, Alertas preventivas).
       - Radar visual en dos columnas: Monitor de Plazos y Holguras vs Monitor Presupuestario de Costos con barras de progreso predictivas.
       - Pestañas de filtrado de reglas: *Todas*, *⏱️ Tiempos*, *🪙 Costos*, *⏳ Horarios*, *⚙️ General*.
       - Botón "Ejecutar Diagnóstico en Vivo" con evaluación instantánea y campanilla de audio.
       - Control total en cada tarjeta de regla: interruptor On/Off, insignias de horario programado, umbrales de anticipación/costo, botón de configuración (`data-action="edit-rule"`) y eliminación (`data-action="delete-rule"`).
     - Creación del Modal Global `#automation-rule-modal` en `index.html` con campos completos: Nombre, Categoría, Severidad, Horario/Frecuencia (Tiempo Real, Cada Hora, Diario 08:00 AM, Diario 18:00 PM, Semanal), Motor de Tiempos (horas de anticipación, condición de holgura), Motor de Costos (% de alerta, ámbito financiero), Disparador, Acción, Tono de notificación e interruptor activo.
     - Métodos de control reactivo en `js/app.js`: `openAutomationRuleModal()` y escucha del envío del formulario con guardado automático en `window.plannerStore`.
* **Archivos Modificados:**
  - `assets/avatar-cat.svg` (creado)
  - `assets/avatar-penguin.svg` (creado)
  - `css/planner-book.css`
  - `css/modules.css`
  - `index.html`
  - `js/store.js`
  - `js/automations.js`
  - `js/app.js`
  - `js/projects.js`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 006] — 09/10/2026 · Ajuste de Tamaño de Perfil, Rediseño del Calendario (4 Vistas, Colores, Horarios, Checkboxes) y Gestión Dinámica de Tareas
* **Petición del Usuario:**
  > *"como primera instancia ajusta el perfil de tamaño, se sale del borde y desajusta la pagina, segundo quiero que en Módulo 02 · Agenda & Cronograma, ajustes el diseño y los tamaños del calendario, tanto en dia, semana,mes y año, deben tener manera de organizar por colores, horarios y tener checkboxes para cualquier cambio, tercero en Módulo 01 · Tareas & Entregables, debes cambiar el estatus de las tareas segun se vayan completando los objetivos, si tiene 1 o mas subtareas marcada como hecha(debe poder desmarcarse tambien) debe cambiar el estatus a "en proceso", tambien debe poderse editar a quien esta asignada, y eso tambien debe poder escogerse desde que se crea una tarea nueva, debe poder escogerse tanto el proyecto vinculado, como el responsable o equipo responsable"*
* **Acciones Realizadas:**
  1. **Ajuste y Contención Total del Perfil Superior (Anti-Desborde):**
     - Se corrigió el desborde en `.planner-top-bar` y `.user-profile-badge` en [planner-book.css](file:///c:/Users/KATMIN/Desktop/portafolio/pro%201%20agenda/css/planner-book.css):
       - Avatar escalado a `32px × 32px` manteniendo `aspect-ratio: 1 / 1 !important` y `border-radius: 50% !important`.
       - Contenedor `.user-profile-badge` con `max-width: 195px`, padding contenido `2px 10px 2px 3px`, y elipsis en texto para evitar que empuje los botones hacia afuera.
       - Espaciado `gap: 8px` en `.top-bar-right` y botones de navegación compactos (`padding: 6px 11px`).
       - Reglas responsive con `@media (max-width: 1240px)` para ocultar el indicador de fecha y atajos, y `@media (max-width: 900px)` para compactar a modo icono, garantizando que el perfil permanezca 100% dentro de los márgenes en cualquier monitor o portátil.
  2. **Módulo 02 · Agenda & Cronograma (Rediseño, 4 Vistas, Colores, Horarios y Checkboxes):**
     - **Organizador por Colores:** Barra interactiva de chips en la cabecera del calendario para filtrar y organizar citas por categoría:
       - *Todos los Colores*, *🔴 Compromisos (#9C523B)*, *🟢 Reuniones (#3F6253)*, *🟡 Citas (#B27D32)*, *🟣 Estrategia (#5B4B70)* y *⚪ Personal (#7E6B5A)*.
     - **Organizador de Horarios:**
       - Selector de franjas horarias: *Todo el día (07:00 - 22:00)*, *🌅 Mañanas (07:00 - 13:00)*, *🌇 Tardes (13:00 - 18:00)* y *🌙 Noches (18:00 - 22:00)*.
       - Ordenamiento cronológico estricto en cada celda del mes, semana y día.
     - **Checkboxes Interactivos para cualquier cambio:**
       - Cada cita/evento en las vistas de Mes, Semana y Día cuenta con un checkbox interactivo (`data-action="toggle-event-complete"`).
       - Al marcarse, el evento se tacha visualmente, se marca como realizado en el Store (`window.plannerStore.toggleEventComplete()`) y emite confirmación auditiva táctil.
       - Interruptor rápido en cabecera: `[☑ Ocultar realizados]` para limpiar la vista al instante.
     - **Rediseño de las 4 Vistas:**
       - *Vista Mes:* Celdas optimizadas de 105px de alto, píldoras con hora destacada, borde de color y checkboxes.
       - *Vista Semana:* Cuadrícula de 7 columnas + escala horaria de 07:00 a 21:00 con tarjetas de evento que muestran checkbox, intervalo horario y título.
       - *Vista Día:* Línea horaria completa con time blocking estructurado, tarjetas con checkboxes, panel de prioridades Ivy Lee y notas pautadas.
       - *Vista Año:* 12 mini calendarios interactivos reales con cuadrículas de días, indicadores de citas programadas y acceso directo con un clic.
  3. **Módulo 01 · Tareas & Entregables (Estatus Dinámico, Proyecto y Responsable):**
     - **Transición Automática de Estatus según Subtareas:**
       - En `js/store.js` (`toggleSubtask`): Si una tarea tiene subtareas y se marca 1 o más, su estatus cambia automáticamente a `"en_proceso"`.
       - Si se completan todas las subtareas, cambia a `"completada"`.
       - Si se desmarcan todas las subtareas, regresa a `"pendiente"`.
       - En `js/tasks.js`, marcar el checkbox principal de una tarea sincroniza todas sus subtareas (completar o desmarcar todo).
     - **Asignación de Responsable y Vinculación de Proyecto:**
       - Se agregaron los campos `Proyecto Vinculado` (`#modal-task-project`) y `Responsable Asignado` (`#modal-task-assignee`) al modal de tareas en `index.html`.
       - `openTaskModal()` en `js/app.js` carga dinámicamente todos los proyectos y miembros del equipo (Hermione Granger, Harry Potter, Ron Weasley, Luna Lovegood).
       - Permite elegir el responsable y proyecto tanto al **crear una tarea nueva** como al **editar una tarea existente**.
       - En `js/tasks.js` se añadieron selectores rápidos directos en las tarjetas de la vista Lista y vista Kanban para cambiar el responsable o proyecto sin tener que abrir el modal.
* **Archivos Modificados:**
  - `css/planner-book.css`
  - `css/modules.css`
  - `index.html`
  - `js/store.js`
  - `js/calendar.js`
  - `js/tasks.js`
  - `js/app.js`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 007] — 09/10/2026 · Reestructuración Integral de 8 Módulos (VA Hub con Tareas y Cronómetro, Colaboradores y Equipos, Suscripciones con Auditoría, Cuaderno con Plantillas y Checkboxes, Hábitos y Metas, Notificaciones Leídas, Métricas Multi-Período/Proyecto y Perfil de Usuario)
* **Petición del Usuario:**
  > *"quiero que realices estos cambios (el Módulo 04 · Asistente Virtual & Clientes, debemos restructurar el apartado para poder tener los proyectos con sus repectivas tareas, y teniendo cada uno el conteo de tiempo cuando se active el cronometro ara registrar el tiempo dedicado a ese proyecto y llevar un mejor control de las horas de trabajo invertidas en ese proyecto o subtarea del proyecto, para futuros cobros o juntas de revisión, debe poderse agregar una solicitud o tarea nueva por si mientras se trabaja surge algo nuevo dentro del proyecto. es importante que este apartado tampoco exceda el tamaño general d ela agenda para no salirse de la pantalla del diseño; el Módulo 05 · Personas & Colaboradores, debe tener un menú y diseño para agregar colaboradores el la parte de nuevo contacto y para agregar estos colaboradores a algún grupo o equipo; el Módulo 06 · Control Financiero, las suscripciones deben poder gestionarse, tanto para agregar mas como para quitar o cmabiar el precio del pplan, simplemente debe quedar constancia de cuando se realizo el cambio, en un apartado tipo nota; el Módulo 07 · Cuaderno & Documentos, necesita un menú para escoger plantillas, el apartado de nueva nota debe ser editable tanto en el apartado de la etiqueta a la que pertenece como en si necesita agregar checkboxes; el Módulo 08 · Vida Personal & Hábitos, debe poderse tener un menú para registrar un nuevo habito, meta trimestral u objetivo personal para llevar un mejor control, asi mismo me gustaria una mejora en la distribución del diseño que se vea mas controlado y editable sin dejar de ser minimalista; el Módulo 10 · Automatización Inteligente & Motor Predictivo, debe poderse marcar en las notificaciones cuales ya fueron leidas y acomodar de mejor manera el botón para limpiar las notificaciones leidas; el Módulo 10 · Métricas & Auditoría, quiero que puedas escoger el total de métricas por, dia, semana, mes y año. y que sea por proyecto o en total de proyectos, asi poder entregar el Excel dependiendo de lo que se necesita, y poder ser una manera de entregar el resumen de la operación a el cliente del proyecto o un resumen de todo para la contabilidad y organización; el Módulo 11 · Seguridad & Personalización, solo mejora el apartado de perfil de usuario y rol, quiero un mejor diseño y espaciado de las cosas )"*
* **Acciones Realizadas:**
  1. **Módulo 04 · Asistente Virtual & Clientes (`js/vabox.js`):**
     - Reestructuración con árbol visual de Clientes y Proyectos vinculados a sus respectivas tareas/solicitudes.
     - Cronómetro interactivo por proyecto o subtarea para registrar en vivo horas dedicadas, cálculo de costo facturable y minutos acumulados para cobros y juntas de revisión.
     - Botón y modal on-the-fly `+ Solicitud / Tarea` para incorporar nuevas tareas a un proyecto mientras se trabaja.
     - Modal de Acta de Revisión y Cobro con cálculo de tarifa horaria (🪙 G/hora) y detalle de horas invertidas.
     - Contención estricta de maquetación en `.va-hub-wrapper` (`box-sizing: border-box`, `max-width: 100%`, `overflow-x: hidden`) impidiendo cualquier desborde fuera de la agenda.
  2. **Módulo 05 · Personas & Colaboradores (`js/contacts-team.js`):**
     - Menú y diseño en la sección de contactos para registrar colaboradores y vincularlos directamente a un grupo o equipo (Hogwarts Prefectos, Gryffindor Quidditch, Departamento de Aurores, S.P.E.W.).
     - Filtro visual por grupos y opción rápida para reasignar a cualquier colaborador a otro equipo con un solo clic.
     - Creación del modal `#collaborator-editor-modal` en `index.html`.
  3. **Módulo 06 · Control Financiero (`js/finance.js`):**
     - Gestión completa de suscripciones: agregar nuevas suscripciones, editar plan/precio y cancelar suscripciones.
     - Apartado tipo nota de pergamino *"Constancia & Notas de Modificaciones"* (`subscriptionHistory`) que almacena de forma inmutable la fecha, hora, tipo de acción, precio anterior, nuevo precio y el motivo/nota del cambio.
     - Creación del modal `#subscription-editor-modal` en `index.html`.
  4. **Módulo 07 · Cuaderno & Documentos (`js/notes.js`):**
     - Menú desplegable y galería de plantillas preconfiguradas (*Minuta de Reunión*, *Formulación de Pociones*, *Brief de Proyecto*, *Plan Semanal*, *Revisión 1:1*).
     - Campos editables de etiqueta/categoría tanto en la creación como en el visor de notas.
     - Barra de herramientas con inserción de casillas de verificación interactivas (`- [ ]`, `- [x]`) y conmutador visual dinámico para marcar y desmarcar listas de verificación directamente en el visor de notas.
  5. **Módulo 08 · Vida Personal & Hábitos (`js/personal.js`):**
     - Menú y modal `#personal-item-modal` para dar de alta nuevos hábitos diarios, metas trimestrales u objetivos personales.
     - Rediseño equilibrado y minimalista: cuadrícula compacta de hábitos con rachas de días y eliminación, metas trimestrales con botones de ajuste rápido de progreso `[-5%]` y `[+5%]`, y barra ágil para añadir compras al vuelo.
  6. **Módulo 10 · Automatización Inteligente & Motor Predictivo (`js/automations.js`):**
     - Capacidad de marcar notificaciones individualmente como leídas o no leídas con retroalimentación visual (indicador de punto y badge).
     - Reorganización de la barra de herramientas superior con botones limpios y bien espaciados: *Marcar todas leídas* y *Limpiar leídas*.
  7. **Módulo 10 (11 en menú) · Métricas & Auditoría (`reports.js`):**
     - Selectores interactivos de período: *Día*, *Semana*, *Mes* y *Año*.
     - Selector de alcance: *Todos los Proyectos (Total)* o *Proyecto Específico*.
     - Recálculo dinámico de KPIs (productividad, horas trabajadas, avance, presupuesto ejecutado y desvíos) y gráficos en tiempo real.
     - Exportación de Excel (CSV) a la medida: genera informe adaptado según el filtro aplicado (resumen operacional para clientes o reporte global consolidado para contabilidad).
  8. **Módulo 11 (12 en menú) · Seguridad & Personalización (`js/settings.js`):**
     - Rediseño del perfil de usuario y rol: tarjeta de identificación espaciosa y elegante, preservación garantizada del avatar SVG de Crookshanks (`assets/avatar-cat.svg`), cuadrícula de privilegios de rol (acceso total, auditoría financiera, reasignación, etc.) y formulario de edición sin desbordes.
  9. **Soporte Global y Modales (`index.html`, `js/store.js`, `js/app.js`, `css/modules.css`):**
     - Métodos de almacén reactivo para suscripciones, colaboradores, notas de auditoría, hábitos, metas y notificaciones.
     - Modales globales integrados sin dependencias externas.
     - Estilos CSS complementarios garantizando consistencia estética Notes y protección anti-desborde.
* **Archivos Modificados:**
  - `css/modules.css`
  - `index.html`
  - `js/app.js`
  - `js/automations.js`
  - `js/contacts-team.js`
  - `js/finance.js`
  - `js/notes.js`
  - `js/personal.js`
  - `js/reports.js`
  - `js/settings.js`
  - `js/store.js`
  - `js/vabox.js`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 008] — 09/10/2026 · Independencia de Checkboxes en Tareas (Vista Lista y Estatus "TERMINADO") y Asignación de Contactos a Equipos
* **Petición del Usuario:**
  > *"Módulo 01 · Tareas & Entregables, revisa la vista que ofrece el apartado de "Lista" y revisa la funcionalidad correcta de los checkbox, deben ser independientes las subtareas del checkbox principal y debe aparecer como terminado una vez que se marca el checkbox de la tarea principal; Módulo 05 · Personas & Colaboradores, presta atención a lo que pedi agregar en la parte de nuevo contacto y mejora la manera de agregar estos contactos ya registrados a algún grupo o equipo"*
* **Acciones Realizadas:**
  1. **Módulo 01 · Tareas & Entregables (`js/tasks.js`, `js/store.js`, `css/modules.css`):**
     - **Independencia Estricta de Checkboxes:** Se eliminó la sincronización forzada que modificaba todas las subtareas al pulsar el checkbox principal. Ahora las subtareas conservan su propio estado individual de forma 100% independiente.
     - **Estatus "TERMINADO" Inmediato:** Al marcar el checkbox principal, la tarea pasa de inmediato al estado `"completada"`, mostrando la insignia `TERMINADO` en verde, aplicando el estilo `.is-completed` (borde izquierdo `#2F855A`, fondo tenue y título tachado) y marcando el círculo en verde con ícono de verificación sin alterar las subtareas.
     - **Desmarcado Inteligente:** Al desmarcar la tarea principal completada, si tiene una o más subtareas hechas, regresa automáticamente a `EN PROCESO`, y si no tiene ninguna hecha, regresa a `PENDIENTE`.
     - **Subtareas Desacopladas (`toggleSubtask`):** Si una tarea principal ya fue marcada manualmente como completada, interactuar con sus subtareas no revoca el estatus de completada de la tarea.
     - **Mejora en Eventos y Estilos:** El cambio de subtareas se gestiona en el evento `change` para evitar doble pulsación, con botones de 28px y diseño pautado Notes.
  2. **Módulo 05 · Personas & Colaboradores (`index.html`, `js/contacts-team.js`, `js/store.js`, `js/app.js`, `css/modules.css`):**
     - **Modal Institucional "Nuevo Contacto" (`#contact-editor-modal`):** Se erradicaron los diálogos nativos `prompt()` del navegador y se diseñó un modal profesional con campos para Nombre, Empresa, Especialidad/Cargo, Correo, Teléfono/Lechucería, Tipo de Contacto (Aliado, Claustro, Cliente, Proveedor, Institucional), Última Interacción, Próximo Seguimiento y Notas.
     - **Integración Directa en "Nuevo Contacto" con Equipo:** Se añadió la sección destacada *"¿Incorporar simultáneamente como Colaborador de un Equipo?"* con selector de Grupo/Equipo, Turno/Horario, Estado de Asistencia y Color de Avatar para darlo de alta en ambas secciones al mismo tiempo si el usuario lo desea.
     - **Asignación Rápida de Contactos Ya Registrados (`#assign-contact-team-modal`):**
       - En cada tarjeta del **Directorio de Contactos** se muestra el estado: si ya está en un equipo (`En Equipo: [Grupo]` con botón `[Cambiar]`) o un botón directo `[+ Añadir a Grupo / Equipo]`.
       - En la vista **Equipo & Grupos** se agregó el botón `+ Asignar Contacto Registrado al Equipo` en la barra de herramientas.
       - El modal `#assign-contact-team-modal` despliega la lista de contactos del directorio con vista previa de su empresa/cargo y permite asignarlos a cualquier grupo o equipo de inmediato.
     - **Métodos Store:** Se añadieron `addContact`, `updateContact`, `deleteContact` y `assignContactToTeam` en `window.plannerStore`.
* **Archivos Modificados:**
  - `css/modules.css`
  - `index.html`
  - `js/app.js`
  - `js/contacts-team.js`
  - `js/store.js`
  - `js/tasks.js`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 009] — 09/10/2026 · Corrección Definitiva de Checkboxes (Prevención de Acumulación de Listeners) y Eliminación de Espacio Blanco en Tarjetas
* **Petición del Usuario:**
  > *"los checkbox no funcionan nuevamente y hay mucho espacio blanco desaprovechado, arreglalo como te pedi anteriormente"* (Acompañado de captura donde la tarjeta de tarea mostraba un espacio blanco masivo del 50% a la izquierda entre el círculo y el contenido).
* **Diagnóstico de Causas Raíz:**
  1. **Checkboxes inoperantes tras clics sucesivos:** Cada ejecución de `render(container)` vinculaba nuevos escuchas de eventos sobre el contenedor persistente `#planner-active-page`. Al acumularse listeners duplicados, un único clic ejecutaba múltiples toggles instantáneos, cancelándose entre sí.
  2. **Espacio blanco desaprovechado:** La regla CSS `.task-card-left { flex: 1; min-width: 200px; }` (originada en VA Hub) colisionaba con la clase del checkbox en las tarjetas de tareas, forzando a que la columna de la casilla circular ocupara la mitad del ancho de la tarjeta como un bloque en blanco vacío.
* **Acciones Realizadas:**
  1. **Solución a Acumulación de Listeners:**
     - Se encapsuló todo el módulo de tareas dentro de un contenedor raíz dinámico `<div id="tasks-module-root">`.
     - Los event listeners (`change`, `click`, `input`) se asocian exclusivamente a dicho elemento raíz. Al re-renderizar, el elemento anterior y sus escuchas son destruidos limpiamente por el navegador, evitando cualquier duplicación.
     - Se creó el método nativo `toggleTaskComplete(taskId)` en `window.plannerStore` para centralizar la alternancia de estado y guardado en `localStorage`.
     - Se añadió `pointer-events: none` a los SVG e iconos internos de `.task-check-circle` para garantizar que el clic se capture infaliblemente en el botón.
  2. **Eliminación Total del Espacio Blanco en Tarjetas:**
     - Se acotó la regla genérica a `.va-task-item-card .task-card-left` para que no contamine otros módulos.
     - Se renombró la columna del checkbox en las tarjetas a `.task-check-col`, asignándole `flex: 0 0 28px !important; width: 28px !important; max-width: 28px !important; margin-right: 14px;`.
     - Se otorgó `flex: 1 1 auto !important; min-width: 0 !important;` a `.task-card-body`, haciendo que el título, descripción, metadatos y subtareas aprovechen el ancho completo disponible de la tarjeta.
     - Se mejoró la cuadrícula de subtareas con `auto-fill, minmax(280px, 1fr)` y el buscador a `max-width: 580px`.
* **Archivos Modificados:**
  - `css/modules.css`
  - `js/store.js`
  - `js/tasks.js`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 010] — 09/10/2026 · Menú y Modal Interactivo de Hitos / Entregables en Proyectos (Eliminación de Browser Prompts, Edición, Eliminación y Recálculo Automático)
* **Petición del Usuario:**
  > *"haz el menu de hito"* (Acompañado de captura donde aparecía un diálogo nativo prompt del navegador al pulsar "+ Añadir Hito" en Proyectos & Entregables).
* **Diagnóstico de Causa Raíz:**
  - El botón `+ Añadir Hito` en `js/projects.js` utilizaba llamadas arcaicas a `prompt("Título del entregable / hito:")` y `prompt("Fecha límite...")`, desentonando con la estética inmersiva de la agenda Notes.
  - El botón de cabecera carecía de alineación flex adecuada (`.section-title-bar`), provocando una disposición quebrada.
  - Los hitos existentes no contaban con opciones para ser editados o eliminados sin tocar la consola.
* **Acciones Realizadas:**
  1. **Creación del Modal Global `#deliverable-editor-modal` (`index.html`):**
     - Ventana modal con diseño tipo Notes y formulario `#form-modal-deliverable`.
     - Contiene campos detallados: Proyecto Vinculado (`#modal-del-project`), Título del Hito/Entregable (`#modal-del-title`), Criterios de Aceptación / Descripción (`#modal-del-desc`), Fecha Límite (`#modal-del-date`), Estado Inicial (`#modal-del-status`), Nivel de Prioridad (`#modal-del-priority`) y Responsable del Hito (`#modal-del-assignee`).
  2. **Métodos CRUD y Recálculo en Almacén (`js/store.js`):**
     - Implementación de `addDeliverable(projectId, deliverable)`, `updateDeliverable(projectId, deliverableId, updates)`, `deleteDeliverable(projectId, deliverableId)` y `toggleDeliverable(projectId, deliverableId)`.
     - Recálculo dinámico automático de avance: al añadir, editar, eliminar o alternar el estado de cualquier hito, el porcentaje de avance general del proyecto (`proj.progress`) se recalcula en tiempo real en función de los hitos completados y se persiste en `localStorage`.
  3. **Control y Rediseño de Hitos (`js/projects.js`):**
     - Encapsulamiento del módulo completo dentro de `<div id="projects-module-root">` para garantizar la destrucción limpia de event listeners entre re-renderizados y evitar escuchas duplicadas.
     - Erradicación total de los diálogos `prompt()` nativos y apertura fluida de `openDeliverableModal(projId, deliverable)`.
     - Cada hito en la lista ahora cuenta con:
       - Checkbox interactivo (`data-action="toggle-deliverable"`).
       - Título, descripción o criterios de aceptación y fecha límite.
       - Insignia de prioridad y estatus (*Completado*, *En Proceso*, *Pendiente*).
       - Botón de edición rápida (`data-action="edit-deliverable"`).
       - Botón de eliminación rápida (`data-action="delete-deliverable"`).
  4. **Gestión de Formulario y Audio Táctil (`js/app.js`):**
     - Escucha del evento submit para `#form-modal-deliverable` con validación de proyecto y título.
     - Reproducción de retroalimentación sonora sutil mediante el motor de audio sintético al guardar cambios.
     - Cierre automático de modal y recálculo visual del proyecto seleccionado.
  5. **Estilos y Acabados Visuales (`css/modules.css`):**
     - Estilo para `.section-title-bar` con alineación vertical y botón `.action-btn-xs.primary`.
     - Estilos para `.deliverable-item` con fondo pautado, sombreado sutil al hover, tachado al completarse (`.is-done`), badges de estado y botones discretos `.icon-action-btn-xs`.
* **Archivos Modificados:**
  - `css/modules.css`
  - `index.html`
  - `js/app.js`
  - `js/projects.js`
  - `js/store.js`
  - `MEMORIA_CAMBIOS.md`

### [Entrada 011] — 09/10/2026 · Ajuste de Contención y Rediseño Anti-Desborde del Módulo 04 · Asistente Virtual & Clientes
* **Petición del Usuario:**
  > *"ajusta el Módulo 04 · Asistente Virtual & Clientes, se sale de la pantalla y el diseño de agenda, acomodalo para que no cause conflicto en el diseño"*
* **Diagnóstico de Causas Raíz:**
  1. **Barra de Cronómetro Unidimensional Rígida:** En `.va-live-tracker-bar`, todos los elementos (indicador de pulso en vivo, dígitos del reloj, campo de texto de actividad, dos selectores `<select>` con nombres extensos de proyectos como *"Defensa del Castillo y Encantamientos Protectores (Sortilegios Weasley)"*, switch de Facturable y tres botones) estaban forzados en una única fila horizontal (`flex-direction: row; no wrap`). El ancho natural superaba los 1,580px, desbordando los 1,150px de la hoja del cuaderno y saliéndose de la pantalla.
  2. **Ausencia de Contención en el Área Activa del Cuaderno:** `.planner-content-area` en `css/planner-book.css` no tenía `min-width: 0; max-width: 100%; box-sizing: border-box; overflow-x: hidden;`, permitiendo que hijos con contenido amplio forzaran la expansión horizontal de toda la hoja.
  3. **Cabecera y Paneles de Proyecto:** `.module-header` y los paneles de proyectos carecían de reglas de envoltura flexible (`flex-wrap: wrap`) y elipsis en selectores largos.
* **Acciones Realizadas:**
  1. **Rediseño de la Tarjeta del Cronómetro en 2 Niveles Notes (`js/vabox.js`, `css/modules.css`):**
     - **Nivel 1 (Superior):** Aloja el reloj digital tipográfico monospaciado con indicador animado de pulso (`REGISTRANDO TIEMPO` / `CRONÓMETRO LISTO`), junto con el interruptor interactivo `Facturable` y los tres botones de acción rápida (*Iniciar/Pausar*, *Registrar*, *Reiniciar*).
     - **Nivel 2 (Inferior):** Fila armónica y fluida con 3 columnas de entrada elásticas y acotadas:
       - *Actividad o Tarea:* campo de texto con ancho flexible (`flex: 2 1 240px; min-width: 0;`).
       - *Proyecto Destino:* selector desplegable con `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;` (`flex: 1.5 1 200px; min-width: 0;`).
       - *Subtarea:* selector con truncado inteligente (`flex: 1.5 1 200px; min-width: 0;`).
     - Al desacoplar la barra en 2 niveles e incorporar límites estrictos, el ancho mínimo necesario se redujo de 1,580px a ~300px, adaptándose con total fluidez en pantallas pequeñas, medianas y grandes.
  2. **Encapsulamiento y Escuchas Limpias (`js/vabox.js`):**
     - Encapsulación del módulo en `<div id="va-hub-module-root" class="va-hub-wrapper">`.
     - Scoping estricto de todos los event listeners (`root.querySelector...`), garantizando aislamiento y previniendo acumulación de escuchas al alternar vistas.
     - Sustitución de `prompt()` nativo en solicitudes de cliente por apertura integrada de `#va-task-request-modal`.
  3. **Contención Estricta en Cuaderno y Módulos (`css/planner-book.css`, `css/modules.css`):**
     - Se añadió `min-width: 0; max-width: 100%; box-sizing: border-box; overflow-x: hidden;` a `.planner-content-area`.
     - Reglas de flexbox elásticas y seguras para `.va-module-header`, `.va-header-title-block`, `.va-stats-bar-grid`, `.va-project-panel`, `.va-project-header-row`, `.va-proj-main-info`, `.va-proj-metrics-box`, `.va-task-item-card` y el expediente `.va-grid-container` / `.dossier-double-column`.
* **Archivos Modificados:**
  - `css/planner-book.css`
  - `css/modules.css`
  - `js/vabox.js`
  - `MEMORIA_CAMBIOS.md`

---

<!-- Las siguientes entradas se añadirán aquí secuencialmente con cada nueva solicitud del usuario -->




