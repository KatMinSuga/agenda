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

---

<!-- Las siguientes entradas se añadirán aquí secuencialmente con cada nueva solicitud del usuario -->

