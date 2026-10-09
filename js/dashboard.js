/**
 * Módulo de Panel Principal (Dashboard / Portada "Hoy")
 * Centro de control diario anti-distracción: las 3 prioridades clave,
 * cronograma de hoy, temporizador Pomodoro de enfoque y captura rápida.
 */

class DashboardModule {
  constructor() {
    this.pomodoroTime = 25 * 60; // 25 min
    this.pomodoroRunning = false;
    this.pomodoroInterval = null;
    this.pomodoroMode = 'work'; // 'work' o 'break'
  }

  render(container) {
    const tasks = window.plannerStore.get('tasks') || [];
    const events = window.plannerStore.get('events') || [];
    const habits = (window.plannerStore.get('personal') || {}).habits || [];
    const todayStr = "2026-10-08";

    const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.priority === 'urgente');
    const todayEvents = events.filter(e => e.date === todayStr);

    // Prioridades no negociables (top 3)
    const topPriorities = todayTasks.slice(0, 3);
    const habitsDoneToday = habits.filter(h => h.days && h.days[todayStr]).length;

    container.innerHTML = `
      <div class="module-header dashboard-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="compass"></i> Portada Principal · Modo Alto Rendimiento</div>
          <h2 class="planner-page-title">Jueves, 8 de Octubre de 2026</h2>
          <p class="planner-page-desc">Tu plan maestro del día. Concéntrate en resolver una sola tarea prioritaria a la vez y elimina cualquier distracción.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn zen-btn" id="btn-toggle-zen-mode" title="Ocultar todo excepto tu tarea actual (Atajo: F)">
            <i data-lucide="minimize-2"></i> Modo Enfoque Zen
          </button>
          <button class="action-btn primary" id="btn-quick-new">
            <i data-lucide="plus"></i> Registro Rápido
          </button>
        </div>
      </div>

      <!-- Métricas del Día -->
      <div class="dashboard-kpi-row">
        <div class="dash-stat-box">
          <span class="stat-badge"><i data-lucide="check-circle-2"></i> Tareas de Hoy</span>
          <div class="stat-number">${todayTasks.filter(t => t.status === 'completada').length} / ${todayTasks.length}</div>
          <span class="stat-caption">${todayTasks.filter(t => t.status !== 'completada').length} pendientes de ejecución</span>
        </div>
        <div class="dash-stat-box">
          <span class="stat-badge"><i data-lucide="calendar"></i> Compromisos</span>
          <div class="stat-number">${todayEvents.length} eventos</div>
          <span class="stat-caption">Próximo: 09:00 AM Meet</span>
        </div>
        <div class="dash-stat-box">
          <span class="stat-badge"><i data-lucide="sparkles"></i> Hábitos Saludables</span>
          <div class="stat-number">${habitsDoneToday} / ${habits.length}</div>
          <span class="stat-caption">${Math.round((habitsDoneToday / (habits.length || 1)) * 100)}% completado hoy</span>
        </div>
        <div class="dash-stat-box">
          <span class="stat-badge"><i data-lucide="zap"></i> Nivel de Enfoque</span>
          <div class="stat-number text-success">92%</div>
          <span class="stat-caption">Rendimiento óptimo</span>
        </div>
      </div>

      <!-- Contenedor Principal en Cuadrícula Dual -->
      <div class="dashboard-main-grid">
        <!-- Columna Izquierda: Las 3 Prioridades & Temporizador Pomodoro -->
        <div class="dash-left-column">
          <!-- Las 3 Prioridades Clave -->
          <div class="planner-paper-card">
            <div class="paper-card-header">
              <h4><i data-lucide="target"></i> Las 3 Prioridades No Negociables de Hoy</h4>
              <span class="method-tag">Método Ivy Lee (80/20)</span>
            </div>

            <div class="top-priorities-stack">
              ${topPriorities.length === 0 ? `<p class="empty-hint">No hay tareas urgentes asignadas para hoy.</p>` : topPriorities.map((task, idx) => `
                <div class="priority-banner-item priority-${task.priority} ${task.status === 'completada' ? 'is-done' : ''}">
                  <button class="priority-check-btn" data-action="toggle-dash-task" data-task-id="${task.id}">
                    <i data-lucide="${task.status === 'completada' ? 'check' : 'circle'}"></i>
                  </button>
                  <div class="priority-content">
                    <div class="priority-num-badge">Prioridad #0${idx + 1}</div>
                    <div class="priority-text">${task.title}</div>
                    <div class="priority-sub">
                      <span><i data-lucide="clock"></i> ${task.startTime ? task.startTime + ' - ' + task.endTime : 'Hoy'}</span>
                      <span><i data-lucide="tag"></i> ${task.category || 'General'}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Temporizador Pomodoro / Deep Work -->
          <div class="planner-paper-card pomodoro-card">
            <div class="pomodoro-header-row">
              <h4><i data-lucide="timer"></i> Sesión de Deep Work (Pomodoro)</h4>
              <div class="pomo-mode-tabs">
                <button class="pomo-tab ${this.pomodoroMode === 'work' ? 'active' : ''}" data-pomo="work">Enfoque (25m)</button>
                <button class="pomo-tab ${this.pomodoroMode === 'break' ? 'active' : ''}" data-pomo="break">Descanso (5m)</button>
              </div>
            </div>

            <div class="pomodoro-dial-wrap">
              <div class="pomodoro-clock-digits" id="pomo-time-display">
                ${this.formatPomoTime(this.pomodoroTime)}
              </div>
              <div class="pomodoro-controls">
                <button class="pomo-action-btn primary" id="btn-pomo-toggle">
                  <i data-lucide="${this.pomodoroRunning ? 'pause' : 'play'}"></i>
                  <span>${this.pomodoroRunning ? 'Pausar' : 'Iniciar Enfoque'}</span>
                </button>
                <button class="pomo-action-btn secondary" id="btn-pomo-reset" title="Reiniciar tiempo">
                  <i data-lucide="rotate-ccw"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Cronograma de Hoy & Nota Adhesiva -->
        <div class="dash-right-column">
          <!-- Cronograma del Día (Timeline) -->
          <div class="planner-paper-card">
            <div class="paper-card-header">
              <h4><i data-lucide="calendar-clock"></i> Agenda & Cronograma de Hoy</h4>
              <a href="#" class="hyperlink-jump" id="link-go-to-calendar">Abrir calendario completo <i data-lucide="arrow-right"></i></a>
            </div>

            <div class="dash-timeline-list">
              ${todayEvents.length === 0 ? `<p class="empty-hint">No hay reuniones programadas hoy.</p>` : todayEvents.map(ev => `
                <div class="dash-timeline-item" style="border-left-color: ${ev.color || '#9C523B'}">
                  <div class="time-block-hour">
                    <strong>${ev.startTime}</strong>
                    <span>${ev.endTime}</span>
                  </div>
                  <div class="time-block-info">
                    <div class="time-block-title">${ev.title}</div>
                    <div class="time-block-meta">
                      <span><i data-lucide="video"></i> ${ev.location || 'Google Meet'}</span>
                      <span><i data-lucide="users"></i> ${ev.attendees || 'Personal'}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sticky Note de Captura Rápida Estilo Post-it Notes -->
          <div class="post-it-note">
            <div class="post-it-pin"></div>
            <div class="post-it-title"><i data-lucide="sticky-note"></i> Bloc de Captura Rápida (Brain Dump)</div>
            <textarea class="post-it-textarea" id="dash-quick-note" placeholder="Escribe cualquier pensamiento o tarea fugaz para procesar después...">
- Llamar a Notaría para verificar firma digital.
- Revisar si el cliente Alpha respondió sobre la auditoría Q3.
- Beber 500ml de agua al terminar la sesión pomodoro actual.
            </textarea>
            <div class="post-it-footer">
              <small>Auto-guardado permanente</small>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  formatPomoTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  attachEvents(container) {
    // Toggle tarea de hoy
    container.querySelectorAll('[data-action="toggle-dash-task"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskId = e.currentTarget.dataset.taskId;
        const task = window.plannerStore.get('tasks').find(t => t.id === taskId);
        if (task) {
          const newStatus = task.status === 'completada' ? 'pendiente' : 'completada';
          window.plannerStore.updateTask(taskId, { status: newStatus });
          window.plannerAudio.playCheck();
          this.render(container);
        }
      });
    });

    // Pomodoro Play/Pause
    const pomoToggleBtn = container.querySelector('#btn-pomo-toggle');
    if (pomoToggleBtn) {
      pomoToggleBtn.addEventListener('click', () => {
        if (this.pomodoroRunning) {
          clearInterval(this.pomodoroInterval);
          this.pomodoroRunning = false;
        } else {
          this.pomodoroRunning = true;
          this.pomodoroInterval = setInterval(() => {
            if (this.pomodoroTime > 0) {
              this.pomodoroTime--;
              const disp = document.getElementById('pomo-time-display');
              if (disp) disp.textContent = this.formatPomoTime(this.pomodoroTime);
            } else {
              clearInterval(this.pomodoroInterval);
              this.pomodoroRunning = false;
              window.plannerAudio.playPomodoroChime();
              alert(this.pomodoroMode === 'work' ? '¡Excelente bloque de trabajo completado! Tómate 5 minutos de descanso.' : '¡Descanso terminado! Listo para el siguiente bloque de enfoque.');
              this.pomodoroMode = this.pomodoroMode === 'work' ? 'break' : 'work';
              this.pomodoroTime = (this.pomodoroMode === 'work' ? 25 : 5) * 60;
              this.render(container);
            }
          }, 1000);
        }
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // Pomodoro Reset
    const pomoResetBtn = container.querySelector('#btn-pomo-reset');
    if (pomoResetBtn) {
      pomoResetBtn.addEventListener('click', () => {
        clearInterval(this.pomodoroInterval);
        this.pomodoroRunning = false;
        this.pomodoroTime = (this.pomodoroMode === 'work' ? 25 : 5) * 60;
        this.render(container);
      });
    }

    // Pomodoro Mode Tabs
    container.querySelectorAll('[data-pomo]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.pomodoroMode = e.currentTarget.dataset.pomo;
        clearInterval(this.pomodoroInterval);
        this.pomodoroRunning = false;
        this.pomodoroTime = (this.pomodoroMode === 'work' ? 25 : 5) * 60;
        this.render(container);
      });
    });

    // Enlace a Calendario
    const calLink = container.querySelector('#link-go-to-calendar');
    if (calLink) {
      calLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.plannerApp.navigateToTab('calendar');
      });
    }

    // Modo Zen Toggle
    const zenBtn = container.querySelector('#btn-toggle-zen-mode');
    if (zenBtn) {
      zenBtn.addEventListener('click', () => {
        window.plannerApp.toggleZenMode();
      });
    }

    // Registro rápido
    const btnQuick = container.querySelector('#btn-quick-new');
    if (btnQuick) {
      btnQuick.addEventListener('click', () => {
        window.plannerApp.openQuickEntryModal();
      });
    }

    // Guardado automático del post-it
    const postIt = container.querySelector('#dash-quick-note');
    if (postIt) {
      postIt.addEventListener('input', (e) => {
        localStorage.setItem('notes_quick_brain_dump', e.target.value);
      });
      const savedNote = localStorage.getItem('notes_quick_brain_dump');
      if (savedNote !== null) {
        postIt.value = savedNote;
      }
    }
  }
}

window.dashboardModule = new DashboardModule();
