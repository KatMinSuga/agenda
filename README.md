# 📖 Agenda Digital Web · Inspirada en Planificadores Notes

Una aplicación web de alta productividad y organización ejecutiva inspirada en los afamados planificadores digitales con hipervínculos de **Notes** y **Notability** para iPad Pro.

Diseñada minuciosamente para directores, profesionales independientes y **Asistentes Virtuales (VA)** cuyo tiempo requiere máxima optimización y cero distracciones.

---

## 🎨 Metáfora de Diseño: El Planificador Notes Digital

* **Encuadernación de Lujo:** Cubierta de piel artesanal con costuras perimetrales, anillas metálicas centrales en 3D y papel marfil con suave textura punteada (Dot Grid 5mm).
* **Pestañas Divisorias Hipervinculadas (Tabs):** Pestañas laterales interactivas con esquinas redondeadas y etiquetas en relieve que saltan con un suave efecto de paso de página.
* **Cintas Marcapáginas (Ribbon Bookmarks):** Accesos directos superiores a las secciones más críticas: *Hoy*, *Proyectos Activos* y *VA Hub*.
* **Efectos de Sonido Táctiles Sintetizados:** Audio suave al cambiar de página, clic al marcar casillas y campanilla Zen para el Pomodoro, sintetizados en vivo con la **Web Audio API** (sin necesidad de archivos de audio externos ni dependencias pesadas).
* **4 Temas de Papelería de Lujo:**
  1. **Cuero Caramelo & Marfil** (Estilo Notes clásico)
  2. **Rosa Cuarzo & Oro Rosa** (Estética pastel editorial)
  3. **Medianoche Ejecutivo** (Modo oscuro para descanso visual y sesiones nocturnas)
  4. **Verde Salvia Nórdico** (Enfoque Zen y serenidad)

---

## ⚡ Filosofía Anti-Distracción & Optimización de Tiempo

1. **Modo Enfoque Zen (`F`):** Con un solo clic o pulsando la tecla `F`, la agenda oculta cualquier pestaña exterior y distracciones, dejando únicamente la tarea y el cronómetro de trabajo activo.
2. **Paleta de Comandos Universal (`Ctrl+K` o `Cmd+K`):** Buscador instantáneo estilo Spotlight para encontrar tareas, clientes, eventos o notas en milisegundos.
3. **Atajos de Teclado Directos:**
   * `1` al `9`: Salto inmediato entre módulos.
   * `N`: Apertura de la ventana de registro rápido.
   * `F`: Alternar Modo Zen.
   * `Ctrl+K`: Abrir paleta de comandos.
   * `Esc`: Cerrar cualquier ventana emergente.
4. **Regla Ivy Lee (Top 3 Prioridades):** La portada resalta exclusivamente las 3 prioridades no negociables del día para vencer la procrastinación.
5. **Temporizador Pomodoro Integrado:** Bloques de Deep Work de 25 minutos con pausas de 5 minutos y alertas sonoras.

---

## 📂 Los 12 Módulos Funcionales

| Pestaña | Módulo | Características Principales |
|---|---|---|
| **📌 01. HOY** | Portada & Dashboard | Top 3 prioridades, Pomodoro de Deep Work, horario de hoy y post-it amarillo de captura rápida. |
| **📅 02. AGENDA** | Calendario Multi-vista | Vistas Mensual, Semanal, Diaria y Anual hipervinculada. Detección automática de cruce/conflicto de horarios y exportación `.ics` para Google Calendar y Outlook. |
| **✅ 03. TAREAS** | Gestor de Flujo | Vistas Lista y Tablero Kanban interactivo. Subtareas con checklist y barra de progreso, prioridades por color y recurrencia. |
| **🚀 04. PROYECTOS** | Objetivos & Entregables | Control de avance %, presupuesto ejercido vs asignado, y seguimiento de hitos clave. |
| **💼 05. VA HUB** | Asistente Virtual & Clientes | Cronómetro en vivo de horas facturables/no facturables, control de paquete de horas contratadas vs consumidas, y enlace directo a bóvedas de contraseñas (1Password/Bitwarden). |
| **👥 06. EQUIPO** | Directorio & Colaboradores | Tarjetas de contacto con fecha de última interacción y próximo seguimiento, turnos y control de asistencia. |
| **💰 07. FINANZAS** | Flujo de Caja & Suscripciones | KPIs de ingresos, gastos y margen neto. Monitoreo de renovaciones de software y barras de presupuesto por categoría. |
| **📝 08. NOTAS** | Cuaderno de Actas | Papel pautado Notes, minutas de reunión con lista de acuerdos y plantillas reutilizables (Reunión 1:1, Brief de Cliente, Planificación Semanal). |
| **🌿 09. VIDA PERSONAL** | Hábitos & Bienestar | Cuadrícula semanal de Habit Tracker con cálculo de rachas, rutinas matutinas/nocturnas, metas de vida y lista de compras. |
| **⚡ 10. AUTOMATIZACIÓN** | Reglas & Alertas | Disparadores automáticos, auditoría de retrasos y bandeja de notificaciones en tiempo real. |
| **📊 11. REPORTES** | Métricas & Auditoría | Gráficos con Chart.js de horas trabajadas y productividad, exportación a Excel (CSV) y formato listo para imprimir/guardar en PDF. |
| **⚙️ 12. AJUSTES** | Seguridad & Backup | Selector de temas, interruptor de sonido, y exportación/importación completa en archivo JSON local (privacidad garantizada sin servidores externos). |

---

## 🚀 Cómo Usar y Ejecutar

No requiere instalaciones complejas ni bases de datos remotas.

### Opción 1: Apertura Directa (Sin dependencias)
Haz doble clic sobre el archivo `index.html` en tu navegador favorito (**Google Chrome, Edge, Safari, Firefox**). ¡Todo funciona de inmediato y fuera de línea!

### Opción 2: Servidor Local (Node.js)
```bash
# Iniciar servidor web local en el puerto 3000
npm start
# O bien:
npx serve -l 3000 .
```
Abre en tu navegador: `http://localhost:3000`

---

*Desarrollado con dedicación para optimizar tu tiempo, despejar tu mente y llevar tu productividad al más alto nivel.*
