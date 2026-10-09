/**
 * Módulo de Calendario & Agenda
 * Vistas Anual, Mensual, Semanal y Diaria con detección de conflictos
 * y descarga de archivo .ics para sincronización externa.
 */

class CalendarModule {
  constructor() {
    this.currentView = 'month'; // 'month', 'week', 'day', 'year'
    this.selectedDate = new Date('2026-10-08'); // Fecha por defecto alineada a la sesión
    this.viewYear = 2026;
    this.viewMonth = 9; // 0-indexed (9 = Octubre)
  }

  render(container) {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="calendar"></i> Módulo 02 · Agenda & Cronograma</div>
          <h2 class="planner-page-title">${monthNames[this.viewMonth]} ${this.viewYear}</h2>
          <p class="planner-page-desc">Navegación hipervinculada estilo Notes. Detección automática de conflictos de horario y exportación para Google Calendar.</p>
        </div>
        <div class="header-actions">
          <div class="view-toggle-group">
            <button class="view-toggle-btn ${this.currentView === 'day' ? 'active' : ''}" data-cal-view="day">Día</button>
            <button class="view-toggle-btn ${this.currentView === 'week' ? 'active' : ''}" data-cal-view="week">Semana</button>
            <button class="view-toggle-btn ${this.currentView === 'month' ? 'active' : ''}" data-cal-view="month">Mes</button>
            <button class="view-toggle-btn ${this.currentView === 'year' ? 'active' : ''}" data-cal-view="year">Año 2026</button>
          </div>
          <button class="action-btn secondary" id="btn-export-ics" title="Descargar archivo .ics">
            <i data-lucide="download"></i> Sincronizar .ics
          </button>
          <button class="action-btn primary" id="btn-new-event-modal">
            <i data-lucide="plus"></i> Nueva Cita
          </button>
        </div>
      </div>

      <!-- Barra de navegación del mes / fecha -->
      <div class="calendar-nav-bar">
        <div class="nav-arrows">
          <button class="icon-nav-btn" id="cal-prev-btn"><i data-lucide="chevron-left"></i></button>
          <button class="btn-today-pill" id="cal-today-btn">Ir a Hoy (8 Oct 2026)</button>
          <button class="icon-nav-btn" id="cal-next-btn"><i data-lucide="chevron-right"></i></button>
        </div>

        <div class="cal-legend">
          <span class="legend-item"><span class="legend-dot" style="background:#9C523B"></span> Compromiso</span>
          <span class="legend-item"><span class="legend-dot" style="background:#3F6253"></span> Reunión</span>
          <span class="legend-item"><span class="legend-dot" style="background:#B27D32"></span> Cita Cliente</span>
          <span class="legend-item"><span class="legend-dot" style="background:#7E6B5A"></span> Personal</span>
        </div>
      </div>

      <!-- Contenedor dinámico según vista activa -->
      <div id="calendar-dynamic-content">
        ${this.renderActiveView()}
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderActiveView() {
    switch (this.currentView) {
      case 'year': return this.renderYearView();
      case 'week': return this.renderWeekView();
      case 'day': return this.renderDayView();
      case 'month':
      default:
        return this.renderMonthView();
    }
  }

  renderMonthView() {
    const events = window.plannerStore.get('events') || [];
    const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    // Primer día del mes y total de días
    const firstDayDate = new Date(this.viewYear, this.viewMonth, 1);
    // getDay() devuelve 0 para domingo; ajustamos para que lunes sea 0
    let startDayIndex = firstDayDate.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.viewYear, this.viewMonth, 0).getDate();

    let gridHtml = '';

    // Días del mes anterior
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const prevDayNum = daysInPrevMonth - i;
      gridHtml += `
        <div class="cal-cell other-month">
          <span class="day-number">${prevDayNum}</span>
        </div>
      `;
    }

    // Días del mes actual
    const todayStr = "2026-10-08";
    for (let day = 1; day <= daysInMonth; day++) {
      const currentMonthStr = String(this.viewMonth + 1).padStart(2, '0');
      const dayStrPadded = String(day).padStart(2, '0');
      const dateKey = `${this.viewYear}-${currentMonthStr}-${dayStrPadded}`;
      const isToday = dateKey === todayStr;

      // Eventos del día
      const dayEvents = events.filter(e => e.date === dateKey);

      gridHtml += `
        <div class="cal-cell current-month ${isToday ? 'is-today' : ''}" data-date="${dateKey}">
          <div class="cal-cell-header">
            <span class="day-number ${isToday ? 'today-pill' : ''}">${day}</span>
            ${dayEvents.length > 0 ? `<span class="cell-event-count">${dayEvents.length}</span>` : ''}
          </div>
          <div class="cal-events-list">
            ${dayEvents.slice(0, 3).map(ev => `
              <div class="event-pill" style="border-left-color: ${ev.color || '#9C523B'}" title="${ev.startTime} - ${ev.title}">
                <span class="event-time">${ev.startTime}</span>
                <span class="event-name">${ev.title}</span>
              </div>
            `).join('')}
            ${dayEvents.length > 3 ? `<div class="more-events">+${dayEvents.length - 3} más</div>` : ''}
          </div>
        </div>
      `;
    }

    // Días del siguiente mes para completar la cuadrícula de 35 o 42 celdas
    const totalRendered = startDayIndex + daysInMonth;
    const remainingCells = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
    for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
      gridHtml += `
        <div class="cal-cell other-month">
          <span class="day-number">${nextDay}</span>
        </div>
      `;
    }

    return `
      <div class="calendar-month-grid">
        <div class="calendar-days-header">
          ${daysOfWeek.map(d => `<div class="day-col-header">${d}</div>`).join('')}
        </div>
        <div class="calendar-days-body">
          ${gridHtml}
        </div>
      </div>
    `;
  }

  renderWeekView() {
    const events = window.plannerStore.get('events') || [];
    // Semana del 5 al 11 de Octubre de 2026
    const weekDays = [
      { date: "2026-10-05", name: "Lunes", num: 5 },
      { date: "2026-10-06", name: "Martes", num: 6 },
      { date: "2026-10-07", name: "Miércoles", num: 7 },
      { date: "2026-10-08", name: "Jueves", num: 8, isToday: true },
      { date: "2026-10-09", name: "Viernes", num: 9 },
      { date: "2026-10-10", name: "Sábado", num: 10 },
      { date: "2026-10-11", name: "Domingo", num: 11 }
    ];

    return `
      <div class="week-view-container">
        <div class="week-header-row">
          <div class="week-hour-corner">Hora</div>
          ${weekDays.map(d => `
            <div class="week-day-header ${d.isToday ? 'is-today' : ''}">
              <span class="day-label">${d.name}</span>
              <span class="day-num ${d.isToday ? 'active-badge' : ''}">${d.num}</span>
            </div>
          `).join('')}
        </div>
        <div class="week-body-scroll">
          ${["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map(hour => `
            <div class="week-time-slot-row">
              <div class="time-label">${hour}</div>
              ${weekDays.map(d => {
                const dayEvs = events.filter(e => e.date === d.date && e.startTime.startsWith(hour.slice(0, 2)));
                return `
                  <div class="week-slot-cell" data-date="${d.date}" data-hour="${hour}">
                    ${dayEvs.map(ev => `
                      <div class="week-event-card" style="border-left: 3px solid ${ev.color || '#9C523B'}">
                        <strong>${ev.startTime}</strong> ${ev.title}
                      </div>
                    `).join('')}
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderDayView() {
    const events = window.plannerStore.get('events') || [];
    const tasks = window.plannerStore.get('tasks') || [];
    const todayStr = "2026-10-08";

    const todayEvents = events.filter(e => e.date === todayStr);
    const todayTasks = tasks.filter(t => t.dueDate === todayStr);

    const hours = [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00"
    ];

    return `
      <div class="day-view-layout">
        <!-- Bloque de Horas / Time Blocking -->
        <div class="day-schedule-card">
          <div class="card-header-sub">
            <h4><i data-lucide="clock"></i> Bloques de Tiempo (Time Blocking)</h4>
            <span class="date-badge">Jueves, 8 de Octubre de 2026</span>
          </div>
          <div class="hourly-list">
            ${hours.map(hour => {
              const matchedEv = todayEvents.find(e => e.startTime.startsWith(hour.slice(0, 2)));
              return `
                <div class="hourly-row ${matchedEv ? 'has-event' : ''}">
                  <span class="hourly-label">${hour}</span>
                  <div class="hourly-content">
                    ${matchedEv ? `
                      <div class="hourly-event-box" style="border-left-color: ${matchedEv.color}">
                        <div class="ev-title-bar">
                          <strong>${matchedEv.title}</strong>
                          <span class="ev-time-pill">${matchedEv.startTime} - ${matchedEv.endTime}</span>
                        </div>
                        <div class="ev-details-line">
                          <span><i data-lucide="map-pin"></i> ${matchedEv.location || 'Online'}</span>
                          <span><i data-lucide="users"></i> ${matchedEv.attendees || 'Personal'}</span>
                        </div>
                      </div>
                    ` : `<span class="empty-slot-hint">+ Disponible para programar</span>`}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Panel lateral del día: Las 3 prioridades y notas -->
        <div class="day-side-panel">
          <div class="side-planner-card">
            <h4><i data-lucide="target"></i> Prioridades Clave del Día</h4>
            <p class="card-subtext">Regla 80/20: Enfócate en lo no negociable.</p>
            <div class="day-priorities-list">
              ${todayTasks.slice(0, 3).map((t, idx) => `
                <div class="day-priority-item priority-${t.priority}">
                  <span class="pri-number">0${idx + 1}</span>
                  <div class="pri-info">
                    <strong>${t.title}</strong>
                    <span>${t.category || 'General'} · ${t.priority.toUpperCase()}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="side-planner-card notes-pad">
            <h4><i data-lucide="edit-3"></i> Notas Rápidas de Hoy</h4>
            <textarea class="planner-lined-textarea" placeholder="Anotaciones, llamadas pendientes o reflexiones..." rows="7">
- Recordar solicitar comprobante fiscal a Cliente Alpha antes de las 18:00.
- Mañana viernes realizar la revisión semanal de entregables a las 16:00.
- Hidratación: 3 botellas completadas.
            </textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderYearView() {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return `
      <div class="year-view-notes">
        <div class="year-intro">
          <h3>Índice Anual Hipervinculado 2026</h3>
          <p>Haz clic en cualquier mes para saltar directamente a su planificador.</p>
        </div>
        <div class="year-grid-12">
          ${monthNames.map((name, idx) => `
            <div class="year-mini-month ${idx === 9 ? 'current-active-month' : ''}" data-jump-month="${idx}">
              <div class="mini-month-header">
                <strong>${name}</strong>
                ${idx === 9 ? `<span class="active-dot-live">Mes Actual</span>` : ''}
              </div>
              <div class="mini-month-dots">
                <span class="cal-mini-link">Ver calendario <i data-lucide="arrow-right"></i></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    // Cambio de vista (Día, Semana, Mes, Año)
    container.querySelectorAll('[data-cal-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentView = e.currentTarget.dataset.calView;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    // Flechas de navegación de mes
    const prevBtn = container.querySelector('#cal-prev-btn');
    const nextBtn = container.querySelector('#cal-next-btn');
    const todayBtn = container.querySelector('#cal-today-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.viewMonth--;
        if (this.viewMonth < 0) {
          this.viewMonth = 11;
          this.viewYear--;
        }
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.viewMonth++;
        if (this.viewMonth > 11) {
          this.viewMonth = 0;
          this.viewYear++;
        }
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.viewYear = 2026;
        this.viewMonth = 9; // Octubre
        this.currentView = 'month';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // Salto hipervinculado desde vista anual
    container.querySelectorAll('[data-jump-month]').forEach(card => {
      card.addEventListener('click', (e) => {
        this.viewMonth = parseInt(e.currentTarget.dataset.jumpMonth);
        this.currentView = 'month';
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // Clic en celda de día para abrir vista día
    container.querySelectorAll('.cal-cell.current-month').forEach(cell => {
      cell.addEventListener('click', (e) => {
        if (!e.target.closest('.event-pill')) {
          this.currentView = 'day';
          this.render(container);
          window.plannerAudio.playPageTurn();
        }
      });
    });

    // Exportar ICS
    const btnIcs = container.querySelector('#btn-export-ics');
    if (btnIcs) {
      btnIcs.addEventListener('click', () => {
        this.exportICS();
      });
    }

    // Modal nuevo evento
    const btnNewEvent = container.querySelector('#btn-new-event-modal');
    if (btnNewEvent) {
      btnNewEvent.addEventListener('click', () => {
        window.plannerApp.openEventModal();
      });
    }
  }

  // Generador de archivo .ics para Google Calendar/Outlook
  exportICS() {
    const events = window.plannerStore.get('events') || [];
    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Notes Digital Agenda//ES\r\nCALSCALE:GREGORIAN\r\n";

    events.forEach(ev => {
      const dateSanitized = ev.date.replace(/-/g, '');
      const startSanitized = (ev.startTime || '09:00').replace(':', '') + '00';
      const endSanitized = (ev.endTime || '10:00').replace(':', '') + '00';

      ics += "BEGIN:VEVENT\r\n";
      ics += `UID:${ev.id}@notesplanner.app\r\n`;
      ics += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
      ics += `DTSTART:${dateSanitized}T${startSanitized}\r\n`;
      ics += `DTEND:${dateSanitized}T${endSanitized}\r\n`;
      ics += `SUMMARY:${ev.title}\r\n`;
      ics += `LOCATION:${ev.location || 'Online'}\r\n`;
      ics += `DESCRIPTION:${ev.attendees ? 'Participantes: ' + ev.attendees : ''}\r\n`;
      ics += "END:VEVENT\r\n";
    });

    ics += "END:VCALENDAR\r\n";

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Agenda_Eventos_${new Date().toISOString().split('T')[0]}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

window.calendarModule = new CalendarModule();
