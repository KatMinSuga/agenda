# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Agenda digital web con metáfora de planificador Notes/GoodNotes (12 módulos: Hoy, Agenda, Tareas, Proyectos, VA Hub, Contactos/Equipo, Finanzas, Notas, Vida Personal, Automatización, Reportes, Ajustes). Es una app **100% estática**: HTML + CSS + JavaScript vanilla, sin bundler, sin framework, sin tests ni linter. La UI y los datos están en español.

## Ejecutar

- Abrir `index.html` directamente en el navegador, o
- `npm start` (o `npm run dev`) → `npx serve -l 3000 .` y abrir `http://localhost:3000`.

No hay build, lint ni suite de tests. Se verifica manualmente en el navegador. Lucide y Chart.js se cargan por CDN desde `index.html` (requiere conexión).

## Arquitectura

**Orden de carga de scripts (`index.html`, final del body) importa**: no hay módulos ES; cada archivo hace `window.xxx = new XxxClass()` y los módulos se llaman entre sí por esos globales. `store.js` → `audio.js` → módulos → `app.js` (último, arranca todo en `DOMContentLoaded` con `window.plannerApp.init()`). Un archivo nuevo debe registrarse en `index.html` en el lugar correcto.

- **`js/store.js` (`window.plannerStore`)**: única fuente de verdad. Contiene `INITIAL_DATA` (datos demo con temática Hogwarts/Hermione Granger) y la clase `Store`. Persiste todo el estado en `localStorage` bajo `STORAGE_KEY` (`notes_planner_db_hp_v2`). Acceso con `get(key)`/`set(key,val)`, mutaciones con métodos de dominio (`addTask`, `toggleHabit`, `markNotificationRead`, `exportBackup`/`importBackup`, etc.) y `subscribe()`/`notify()` para listeners. Tras mutar `store.data` directamente hay que llamar `saveData()`.
  - `loadData()` descarta lo guardado si `profile.name !== "Hermione Granger"` y recarga `INITIAL_DATA`. Las migraciones de datos viejos se hacen ahí mismo (p. ej. `finance.subscriptionHistory`). Si se añade un campo nuevo a `INITIAL_DATA`, hay que parchearlo en `loadData()` para usuarios con datos ya guardados.
- **`js/app.js` (`window.plannerApp`)**: shell de la aplicación. `navigateToTab(tabId)` es el router: hace un `switch` sobre `tabId` y llama `window.<modulo>Module.render(pageContainer)` sobre `#planner-active-page`. También gestiona tema (`body.className = theme-*`), modo Zen (`F`), paleta de comandos (`Ctrl+K`), atajos `1`–`9`/`N`/`Esc`, y los modales globales de entrada rápida (tarea, evento, transacción, cliente).
- **Módulos (`js/tasks.js`, `calendar.js`, `projects.js`, `vabox.js`, `contacts-team.js`, `finance.js`, `notes.js`, `personal.js`, `automations.js`, `reports.js`, `dashboard.js`, `settings.js`)**: cada uno es una clase con `render(container)` que reconstruye el `innerHTML` completo del módulo desde el store y luego llama a `attachEvents(container)`. Los ids de pestaña (`data-tab` en `index.html`) no coinciden siempre con el nombre del módulo: `vabox` → `vaHubModule`, `contacts` → `contactsTeamModule`.
- **`js/audio.js` (`window.plannerAudio`)**: sonidos sintetizados con Web Audio API (sin archivos de audio); respeta `settings.soundEnabled`.
- **CSS**: `css/planner-book.css` (estructura del cuaderno: cubierta, anillas, pestañas, `.planner-content-area`), `css/themes.css` (variables de los 4 temas `theme-caramel|rose|midnight|sage`), `css/modules.css` (estilos de todos los módulos, archivo muy grande), `css/responsive.css` (se carga al final; todas las adaptaciones para tableta/teléfono con cortes en 1024/768/600/400 px; en ≤ 1024 px las pestañas pasan a una banda fija inferior). Los ajustes responsivos nuevos van en `responsive.css`, no en el bloque `@media` antiguo de `planner-book.css`; el escritorio (> 1024 px) no debe cambiar.

### Convenciones que evitan bugs ya vistos

- Como cada `render` reescribe el DOM y re-ejecuta `attachEvents`, **limitar los listeners al root del módulo** (p. ej. `container.querySelector('#tasks-module-root')`, `#va-hub-module-root`) y no a `document`; si no, se acumulan listeners en cada re-render (ya corregido en checkboxes de tareas y en VA Hub).
- No usar `prompt()`/`alert()` nativos del navegador: se reemplazaron por modales internos (hitos de proyectos, solicitudes de cliente en VA Hub).
- Contención de layout: el área de contenido tiene `min-width:0; max-width:100%; overflow-x:hidden`; los contenedores flex de los módulos deben usar `flex-wrap` y `min-width:0` para no desbordar la página.
- Tras inyectar HTML con iconos `data-lucide`, se debe llamar `window.lucide.createIcons()` (el router ya lo hace tras cada `render`). Lucide reemplaza el `<i>` por un `<svg>`, así que los selectores CSS `... i { }` no afectan a los iconos ya renderizados; usar `... svg`.
- Para verificar el diseño responsivo, recorrer todas las pestañas con `window.plannerApp.navigateToTab(id, false)` a 1024, 768, 375 y 320 px y comprobar que `#planner-active-page` no tenga `scrollWidth > clientWidth`. El servidor estático cachea: forzar recarga de CSS/JS editados.

## Directiva de proyecto: `MEMORIA_CAMBIOS.md`

`MEMORIA_CAMBIOS.md` es el registro cronológico de peticiones y cambios. Su regla permanente: **no modificar ni eliminar ninguna funcionalidad, estilo o componente existente sin que el usuario lo pida explícitamente**, y registrar cada petición/cambio como una nueva entrada numerada (`[Entrada NNN] — fecha · título`, con petición, diagnóstico/acciones y archivos modificados) antes del comentario final del archivo. Léelo antes de tocar un módulo para conocer decisiones previas.
