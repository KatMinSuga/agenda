/**
 * Módulo de Calendario & Agenda
 * Vistas Anual, Mensual, Semanal y Diaria con:
 * - Organización por Colores y Categorías
 * - Organización por Horarios precisos
 * - Checkboxes interactivos para marcar/completar citas y eventos
 * - Sincronización .ics y detección de conflictos
 */

class CalendarModule {
  constructor() {
    this.currentView = 'month'; // 'month', 'week', 'day', 'year'
    this.selectedDate = new Date('2026-10-08');
    this.viewYear = 2026;
    this.viewMonth = 9; // 0-indexed (9 = Octubre)
    this.selectedColorFilter = 'all'; // 'all' o código hex del color
    this.hideCompletedEvents = false; // Checkbox para ocultar completados
    this.timeRangeFilter = 'all'; // 'all', 'morning', 'afternoon', 'evening'
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
          <p class="planner-page-desc">Planificación hipervinculada estilo Notes: organiza por colores temáticos, franjas horarias y marca compromisos cumplidos con checkboxes interactivos.</p>
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

      <!-- Barra de navegación de mes y fecha -->
      <div class="calendar-nav-bar">
        <div class="nav-arrows">
          <button class="icon-nav-btn" id="cal-prev-btn" title="Mes anterior"><i data-lucide="chevron-left"></i></button>
          <button class="btn-today-pill" id="cal-today-btn">Ir a Hoy (8 Oct 2026)</button>
          <button class="icon-nav-btn" id="cal-next-btn" title="Mes siguiente"><i data-lucide="chevron-right"></i></button>
        </div>

        <!-- Controles rápidos: Checkbox de completados y Filtro de Horarios -->
        <div class="cal-quick-controls">
          <label class="cal-checkbox-toggle" title="Ocultar eventos ya realizados">
            <input type="checkbox" id="chk-hide-completed" ${this.hideCompletedEvents ? 'checked' : ''}>
            <span>Ocultar realizados</span>
          </label>

          <div class="cal-schedule-filter">
            <i data-lucide="clock" style="width:13px; height:13px; color:var(--text-muted);"></i>
            <select id="select-cal-timerange" class="form-select-sm" style="font-size:0.75rem; padding:3px 6px;">
              <option value="all" ${this.timeRangeFilter === 'all' ? 'selected' : ''}>Todo el día (07:00 - 22:00)</option>
              <option value="morning" ${this.timeRangeFilter === 'morning' ? 'selected' : ''}>🌅 Mañanas (07:00 - 13:00)</option>
              <option value="afternoon" ${this.timeRangeFilter === 'afternoon' ? 'selected' : ''}>🌇 Tardes (13:00 - 18:00)</option>
              <option value="evening" ${this.timeRangeFilter === 'evening' ? 'selected' : ''}>🌙 Noches (18:00 - 22:00)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Barra de Organización por Colores (Filtros Interactivos) -->
      <div class="cal-color-palette-bar">
        <span class="color-bar-label"><i data-lucide="palette" style="width:12px; height:12px;"></i> Organizar por Color:</span>
        <div class="cal-color-pills-list">
          <button class="cal-color-chip ${this.selectedColorFilter === 'all' ? 'active' : ''}" data-filter-color="all">
            <span class="color-dot all"></span> Todos los Colores
          </button>
          <button class="cal-color-chip ${this.selectedColorFilter === '#9C523B' ? 'active' : ''}" data-filter-color="#9C523B">
            <span class="color-dot" style="background:#9C523B"></span> 🔴 Compromisos
          </button>
          <button class="cal-color-chip ${this.selectedColorFilter === '#3F6253' ? 'active' : ''}" data-filter-color="#3F6253">
            <span class="color-dot" style="background:#3F6253"></span> 🟢 Reuniones
          </button>
          <button class="cal-color-chip ${this.selectedColorFilter === '#B27D32' ? 'active' : ''}" data-filter-color="#B27D32">
            <span class="color-dot" style="background:#B27D32"></span> 🟡 Citas Clientes
          </button>
          <button class="cal-color-chip ${this.selectedColorFilter === '#5B4B70' ? 'active' : ''}" data-filter-color="#5B4B70">
            <span class="color-dot" style="background:#5B4B70"></span> 🟣 Estrategia
          </button>
          <button class="cal-color-chip ${this.selectedColorFilter === '#7E6B5A' ? 'active' : ''}" data-filter-color="#7E6B5A">
            <span class="color-dot" style="background:#7E6B5A"></span> ⚪ Personal
          </button>
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

  // Filtrado unificado de eventos según color, rango horario y estado completado
  filterEvents(eventsList) {
    return eventsList.filter(ev => {
      // Filtro por color
      if (this.selectedColorFilter !== 'all' && ev.color !== this.selectedColorFilter) {
        return false;
      }
      // Filtro por completados
      if (this.hideCompletedEvents && ev.completed) {
        return false;
      }
      // Filtro por franja horaria
      if (this.timeRangeFilter !== 'all' && ev.startTime) {
        const hour = parseInt(ev.startTime.split(':')[0], 10);
        if (this.timeRangeFilter === 'morning' && (hour < 7 || hour >= 13)) return false;
        if (this.timeRangeFilter === 'afternoon' && (hour < 13 || hour >= 18)) return false;
        if (this.timeRangeFilter === 'evening' && (hour < 18 || hour > 23)) return false;
      }
      return true;
    });
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
    const rawEvents = window.plannerStore.get('events') || [];
    const events = this.filterEvents(rawEvents);
    const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    const firstDayDate = new Date(this.viewYear, this.viewMonth, 1);
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

      // Eventos del día ordenados por horario
      const dayEvents = events
        .filter(e => e.date === dateKey)
        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

      gridHtml += `
        <div class="cal-cell current-month ${isToday ? 'is-today' : ''}" data-date="${dateKey}">
          <div class="cal-cell-header">
            <span class="day-number ${isToday ? 'today-pill' : ''}">${day}</span>
            ${dayEvents.length > 0 ? `<span class="cell-event-count" title="${dayEvents.length} eventos">${dayEvents.length}</span>` : ''}
          </div>
          <div class="cal-events-list">
            ${dayEvents.map(ev => `
              <div class="event-pill ${ev.completed ? 'is-completed' : ''}" style="border-left-color: ${ev.color || '#9C523B'}" title="${ev.startTime} - ${ev.title} (${ev.location || 'Hogwarts'})">
                <input type="checkbox" class="event-checkbox" ${ev.completed ? 'checked' : ''} data-action="toggle-event-complete" data-event-id="${ev.id}" title="Marcar/desmarcar realización">
                <span class="event-time">${ev.startTime}</span>
                <span class="event-name">${ev.title}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Días del mes siguiente
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
    const rawEvents = window.plannerStore.get('events') || [];
    const events = this.filterEvents(rawEvents);

    // Semana del 5 al 11 de Octubre de 2026
    const weekDays = [
      { date: "2026-10-05", name: "LUN", num: 5 },
      { date: "2026-10-06", name: "MAR", num: 6 },
      { date: "2026-10-07", name: "MIÉ", num: 7 },
      { date: "2026-10-08", name: "JUE", num: 8, isToday: true },
      { date: "2026-10-09", name: "VIE", num: 9 },
      { date: "2026-10-10", name: "SÁB", num: 10 },
      { date: "2026-10-11", name: "DOM", num: 11 }
    ];

    const hours = [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00"
    ];

    return `
      <div class="week-view-container">
        <div class="week-header-row">
          <div class="week-hour-corner"><i data-lucide="clock" style="width:13px; height:13px;"></i> Hora</div>
          ${weekDays.map(d => `
            <div class="week-day-header ${d.isToday ? 'is-today' : ''}">
              <span class="day-label">${d.name}</span>
              <span class="day-num ${d.isToday ? 'active-badge' : ''}">${d.num}</span>
            </div>
          `).join('')}
        </div>
        <div class="week-body-scroll">
          ${hours.map(hour => `
            <div class="week-time-slot-row">
              <div class="time-label">${hour}</div>
              ${weekDays.map(d => {
                const dayEvs = events.filter(e => e.date === d.date && e.startTime.startsWith(hour.slice(0, 2)));
                return `
                  <div class="week-slot-cell" data-date="${d.date}" data-hour="${hour}">
                    ${dayEvs.map(ev => `
                      <div class="week-event-card ${ev.completed ? 'is-completed' : ''}" style="border-left-color: ${ev.color || '#9C523B'}">
                        <input type="checkbox" class="event-checkbox" ${ev.completed ? 'checked' : ''} data-action="toggle-event-complete" data-event-id="${ev.id}" title="Marcar/desmarcar">
                        <div class="week-ev-content">
                          <span class="week-ev-time">${ev.startTime} - ${ev.endTime}</span>
                          <strong class="week-ev-title">${ev.title}</strong>
                        </div>
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
    const rawEvents = window.plannerStore.get('events') || [];
    const events = this.filterEvents(rawEvents);
    const tasks = window.plannerStore.get('tasks') || [];
    const todayStr = "2026-10-08";

    const todayEvents = events.filter(e => e.date === todayStr);
    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
    const completedEventsCount = todayEvents.filter(e => e.completed).length;

    const hours = [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
      "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00", "22:00"
    ];

    return `
      <div class="day-view-layout">
        <!-- Bloque de Horas / Time Blocking Estructurado -->
        <div class="day-schedule-card">
          <div class="card-header-sub">
            <div>
              <h4><i data-lucide="clock"></i> Horario de Hoy (Time Blocking)</h4>
              <span style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; display:block;">
                ${completedEventsCount} de ${todayEvents.length} compromisos completados hoy
              </span>
            </div>
            <span class="date-badge">Jueves, 8 de Octubre de 2026</span>
          </div>

          <div class="hourly-list">
            ${hours.map(hour => {
              const matchedEvs = todayEvents.filter(e => e.startTime.startsWith(hour.slice(0, 2)));
              return `
                <div class="hourly-row ${matchedEvs.length > 0 ? 'has-event' : ''}">
                  <span class="hourly-label">${hour}</span>
                  <div class="hourly-content">
                    ${matchedEvs.length > 0 ? matchedEvs.map(ev => `
                      <div class="hourly-event-box ${ev.completed ? 'is-completed' : ''}" style="border-left-color: ${ev.color || '#9C523B'}">
                        <div class="ev-chk-wrap">
                          <input type="checkbox" class="event-checkbox day-chk" ${ev.completed ? 'checked' : ''} data-action="toggle-event-complete" data-event-id="${ev.id}" title="Marcar realización">
                        </div>
                        <div class="ev-main-info">
                          <div class="ev-title-bar">
                            <strong class="ev-title-text">${ev.title}</strong>
                            <span class="ev-time-pill">${ev.startTime} - ${ev.endTime}</span>
                          </div>
                          <div class="ev-details-line">
                            <span><i data-lucide="map-pin" style="width:11px; height:11px;"></i> ${ev.location || 'Hogwarts'}</span>
                            <span><i data-lucide="users" style="width:11px; height:11px;"></i> ${ev.attendees || 'Personal'}</span>
                            ${ev.reminder ? `<span><i data-lucide="bell" style="width:11px; height:11px;"></i> ${ev.reminder}</span>` : ''}
                          </div>
                        </div>
                        <div class="ev-quick-actions">
                          <button class="btn-icon-sm" data-action="delete-event" data-event-id="${ev.id}" title="Eliminar cita">
                            <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
                          </button>
                        </div>
                      </div>
                    `).join('') : `
                      <span class="empty-slot-hint" data-action="create-event-at-hour" data-hour="${hour}">
                        <i data-lucide="plus" style="width:11px; height:11px;"></i> Disponible para programar
                      </span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Panel lateral del día: Ivy Lee Prioridades y Libreta de Notas -->
        <div class="day-side-panel">
          <div class="side-planner-card">
            <h4><i data-lucide="target"></i> Prioridades Clave del Día (Ivy Lee)</h4>
            <p class="card-subtext">Tareas no negociables programadas para hoy:</p>
            <div class="day-priorities-list">
              ${todayTasks.length === 0 ? `<p class="empty-hint">No hay tareas con fecha de hoy.</p>` : todayTasks.slice(0, 4).map((t, idx) => `
                <div class="day-priority-item priority-${t.priority} ${t.status === 'completada' ? 'is-completed' : ''}">
                  <span class="pri-number">0${idx + 1}</span>
                  <div class="pri-info">
                    <strong style="${t.status === 'completada' ? 'text-decoration:line-through; opacity:0.6;' : ''}">${t.title}</strong>
                    <span>${t.category || 'General'} · ${t.priority.toUpperCase()} · ${t.status.replace('_', ' ')}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="side-planner-card notes-pad">
            <h4><i data-lucide="edit-3"></i> Notas & Acuerdos del Día</h4>
            <textarea class="planner-lined-textarea" placeholder="Anotaciones de reuniones, ingredientes de pociones o recordatorios..." rows="7">
- Verificar inventario de bezoares con Madam Pomfrey antes de las 18:00.
- Ronda nocturna: revisar pasillo del tercer piso con Ron Weasley.
- Calibrar rotación del Giratiempo para la clase de Runas de mañana.
            </textarea>
          </div>
        </div>
      </div>
    `;
  }

  renderYearView() {
    const rawEvents = window.plannerStore.get('events') || [];
    const events = this.filterEvents(rawEvents);
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return `
      <div class="year-view-notes">
        <div class="year-intro">
          <h3>Índice Anual Hipervinculado 2026</h3>
          <p>Organización anual interactiva: consulta la distribución de citas de cada mes y haz clic para abrir cualquier planificador mensual.</p>
        </div>
        <div class="year-grid-12">
          ${monthNames.map((name, mIdx) => {
            const mStr = String(mIdx + 1).padStart(2, '0');
            const monthEvents = events.filter(e => e.date && e.date.startsWith(`2026-${mStr}`));
            const daysInM = new Date(2026, mIdx + 1, 0).getDate();
            const firstDay = new Date(2026, mIdx, 1).getDay();
            const startOffset = firstDay === 0 ? 6 : firstDay - 1;

            return `
              <div class="year-mini-month ${mIdx === this.viewMonth ? 'current-active-month' : ''}" data-jump-month="${mIdx}" title="Clic para abrir ${name}">
                <div class="mini-month-header">
                  <strong>${name}</strong>
                  ${mIdx === this.viewMonth ? `<span class="active-dot-live">Mes Actual</span>` : ''}
                </div>

                <!-- Mini cuadrícula de días reales -->
                <div class="mini-cal-grid">
                  <div class="mini-cal-day-header">L</div>
                  <div class="mini-cal-day-header">M</div>
                  <div class="mini-cal-day-header">X</div>
                  <div class="mini-cal-day-header">J</div>
                  <div class="mini-cal-day-header">V</div>
                  <div class="mini-cal-day-header">S</div>
                  <div class="mini-cal-day-header">D</div>
                  ${Array.from({ length: startOffset }).map(() => `<div class="mini-cal-day empty"></div>`).join('')}
                  ${Array.from({ length: daysInM }).map((_, dIdx) => {
                    const dayNum = dIdx + 1;
                    const dStr = String(dayNum).padStart(2, '0');
                    const hasEvent = monthEvents.some(e => e.date === `2026-${mStr}-${dStr}`);
                    const isToday = (mIdx === 9 && dayNum === 8);
                    return `
                      <div class="mini-cal-day ${hasEvent ? 'has-event' : ''} ${isToday ? 'is-today' : ''}">
                        ${dayNum}
                      </div>
                    `;
                  }).join('')}
                </div>

                <div class="mini-month-footer">
                  <span class="mini-event-pill"><i data-lucide="calendar"></i> ${monthEvents.length} citas</span>
                  <span class="cal-mini-link">Ver mes <i data-lucide="arrow-right" style="width:11px; height:11px;"></i></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    // 1. Cambio de vista (Día, Semana, Mes, Año)
    container.querySelectorAll('[data-cal-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentView = e.currentTarget.dataset.calView;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    // 2. Organización por Colores (Filtro interactivo)
    container.querySelectorAll('[data-filter-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedColorFilter = e.currentTarget.dataset.filterColor;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    // 3. Checkbox para ocultar completados
    const chkHideCompleted = container.querySelector('#chk-hide-completed');
    if (chkHideCompleted) {
      chkHideCompleted.addEventListener('change', (e) => {
        this.hideCompletedEvents = e.target.checked;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // 4. Filtro por franja horaria
    const selectTimeRange = container.querySelector('#select-cal-timerange');
    if (selectTimeRange) {
      selectTimeRange.addEventListener('change', (e) => {
        this.timeRangeFilter = e.target.value;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // 5. Checkbox interactivo en cualquier cita/evento (completar/desmarcar)
    container.addEventListener('change', (e) => {
      const chk = e.target.closest('[data-action="toggle-event-complete"]');
      if (chk) {
        const eventId = chk.dataset.eventId;
        window.plannerStore.toggleEventComplete(eventId);
        window.plannerAudio.playCheck();
        this.render(container);
      }
    });

    // 6. Eliminar cita desde vista diaria
    container.addEventListener('click', (e) => {
      const btnDel = e.target.closest('[data-action="delete-event"]');
      if (btnDel) {
        const evId = btnDel.dataset.eventId;
        if (confirm("¿Deseas eliminar este compromiso de la agenda?")) {
          window.plannerStore.deleteEvent(evId);
          window.plannerAudio.playCheck();
          this.render(container);
        }
      }
    });

    // 7. Flechas de navegación de mes
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

    // 8. Salto hipervinculado desde vista anual
    container.querySelectorAll('[data-jump-month]').forEach(card => {
      card.addEventListener('click', (e) => {
        this.viewMonth = parseInt(e.currentTarget.dataset.jumpMonth, 10);
        this.currentView = 'month';
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // 9. Clic en celda de día para abrir vista día
    container.querySelectorAll('.cal-cell.current-month').forEach(cell => {
      cell.addEventListener('click', (e) => {
        if (!e.target.closest('.event-pill') && !e.target.closest('.event-checkbox')) {
          this.currentView = 'day';
          this.render(container);
          window.plannerAudio.playPageTurn();
        }
      });
    });

    // 10. Exportar ICS
    const btnIcs = container.querySelector('#btn-export-ics');
    if (btnIcs) {
      btnIcs.addEventListener('click', () => {
        this.exportICS();
      });
    }

    // 11. Modal nuevo evento
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
      ics += `LOCATION:${ev.location || 'Hogwarts'}\r\n`;
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
