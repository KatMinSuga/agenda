/**
 * Módulo 04 · Asistente Virtual (VA Hub) & Gestión de Clientes y Proyectos
 * Reestructuración con proyectos vinculados, árbol de tareas,
 * cronómetro de alta precisión por proyecto/tarea para control de horas facturables,
 * juntas de revisión y cobros futuros.
 * Diseño contenido para no exceder las dimensiones de la agenda.
 */

class VAHubModule {
  constructor() {
    this.activeSection = 'projects_tasks'; // 'projects_tasks' o 'clients_dossier'
    this.selectedClientId = 'cli-1';
    this.selectedProjectId = 'prj-1';
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.timerRunning = false;
    this.currentTimerProjectId = 'prj-1';
    this.currentTimerTaskId = '';
    this.currentTimerBillable = true;
    this.currentTimerDesc = 'Auditoría y ejecución de tareas del proyecto';
  }

  render(container) {
    const clients = window.plannerStore.get('clients') || [];
    const projects = window.plannerStore.get('projects') || [];
    const tasks = window.plannerStore.get('tasks') || [];
    const timeEntries = window.plannerStore.get('timeEntries') || [];

    // Validar proyecto y cliente seleccionados
    const currentProject = projects.find(p => p.id === this.currentTimerProjectId) || projects[0];
    const projectClient = currentProject && currentProject.clientId
      ? clients.find(c => c.id === currentProject.clientId)
      : (clients.find(c => c.id === this.selectedClientId) || clients[0]);

    // Cálculo general de horas facturables
    const totalBillableMins = timeEntries
      .filter(t => t.billable)
      .reduce((acc, cur) => acc + (cur.durationMinutes || 0), 0);
    const totalBilledHours = (totalBillableMins / 60).toFixed(1);

    container.innerHTML = `
      <div class="va-hub-wrapper" style="box-sizing:border-box; max-width:100%; overflow-x:hidden;">
        <!-- Cabecera del Módulo -->
        <div class="module-header">
          <div>
            <div class="planner-page-eyebrow"><i data-lucide="briefcase"></i> Módulo 04 · Asistente Virtual & Clientes</div>
            <h2 class="planner-page-title">Proyectos, Tareas & Time Tracker</h2>
            <p class="planner-page-desc">Control riguroso de horas dedicadas por proyecto y tarea, cronómetro facturable en vivo para futuras juntas y liquidaciones.</p>
          </div>
          <div class="header-actions">
            <div class="view-toggle-group">
              <button class="view-toggle-btn ${this.activeSection === 'projects_tasks' ? 'active' : ''}" id="btn-va-sec-projects">
                <i data-lucide="folder-kanban"></i> Proyectos & Tareas (${projects.length})
              </button>
              <button class="view-toggle-btn ${this.activeSection === 'clients_dossier' ? 'active' : ''}" id="btn-va-sec-clients">
                <i data-lucide="users"></i> Clientes & Bóvedas (${clients.length})
              </button>
            </div>
            <button class="action-btn primary" id="btn-quick-new-task-va" title="Añadir tarea o solicitud rápida al proyecto">
              <i data-lucide="plus-circle"></i> Nueva Tarea / Solicitud
            </button>
          </div>
        </div>

        <!-- Cronómetro de Alta Precisión (Stopwatch Bar Contenido) -->
        <div class="va-live-tracker-bar">
          <div class="tracker-left">
            <div class="tracker-badge-live ${this.timerRunning ? 'active' : ''}">
              <span class="pulse-dot"></span>
              <span>${this.timerRunning ? 'REGISTRANDO TIEMPO' : 'CRONÓMETRO LISTO'}</span>
            </div>
            <div class="tracker-display" id="va-timer-digits">
              ${this.formatTime(this.timerSeconds)}
            </div>
          </div>

          <div class="tracker-inputs">
            <input type="text" id="va-timer-desc" class="form-input-sm" placeholder="¿En qué tarea o proyecto trabajas?" value="${this.currentTimerDesc}">
            
            <select id="va-timer-project-select" class="form-select-sm" title="Proyecto al que se cargará el tiempo">
              ${projects.map(p => {
                const c = clients.find(cl => cl.id === p.clientId);
                return `<option value="${p.id}" ${p.id === this.currentTimerProjectId ? 'selected' : ''}>${p.title} (${c ? c.company : 'Hogwarts Ops'})</option>`;
              }).join('')}
            </select>

            <select id="va-timer-task-select" class="form-select-sm" title="Subtarea específica (opcional)">
              <option value="">(Tiempo General de Proyecto)</option>
              ${tasks.filter(t => t.projectId === this.currentTimerProjectId).map(t => `
                <option value="${t.id}" ${t.id === this.currentTimerTaskId ? 'selected' : ''}>📋 ${t.title.substring(0, 35)}...</option>
              `).join('')}
            </select>

            <label class="billable-toggle-label" title="Marcar si este tiempo es facturable al cliente">
              <input type="checkbox" id="va-timer-billable" ${this.currentTimerBillable ? 'checked' : ''}>
              <span>Facturable</span>
            </label>
          </div>

          <div class="tracker-actions">
            <button class="timer-btn ${this.timerRunning ? 'pause' : 'start'}" id="btn-toggle-timer">
              <i data-lucide="${this.timerRunning ? 'pause' : 'play'}"></i>
              <span>${this.timerRunning ? 'Pausar' : 'Iniciar'}</span>
            </button>
            <button class="timer-btn save" id="btn-save-time-entry" title="Registrar horas en bitácora del proyecto">
              <i data-lucide="check"></i> Registrar
            </button>
            <button class="timer-btn reset" id="btn-reset-timer" title="Reiniciar contador a cero">
              <i data-lucide="rotate-ccw"></i>
            </button>
          </div>
        </div>

        <!-- Renderizado de la sección activa -->
        ${this.activeSection === 'projects_tasks'
          ? this.renderProjectsTasksView(projects, tasks, clients, timeEntries)
          : this.renderClientsDossierView(clients, timeEntries)}
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  // Vista 1: Proyectos con sus respectivas tareas y horas dedicadas
  renderProjectsTasksView(projects, tasks, clients, timeEntries) {
    return `
      <!-- Cockpit de Resumen de Horas y Facturación -->
      <div class="va-stats-bar-grid">
        <div class="va-stat-card">
          <span class="label"><i data-lucide="clock"></i> Horas Facturables Totales</span>
          <div class="val">${(timeEntries.filter(t => t.billable).reduce((sum, e) => sum + (e.durationMinutes || 0), 0) / 60).toFixed(1)}h</div>
          <span class="sub">Registradas en bitácoras de proyectos</span>
        </div>
        <div class="va-stat-card">
          <span class="label"><i data-lucide="folder-check"></i> Proyectos con Registro Activo</span>
          <div class="val">${projects.length}</div>
          <span class="sub">${tasks.filter(t => t.projectId).length} tareas vinculadas en ejecución</span>
        </div>
        <div class="va-stat-card">
          <span class="label"><i data-lucide="coins"></i> Estimación de Cobro Pendiente</span>
          <div class="val text-success">
            🪙 ${this.calculatePendingGalleons(projects, clients, timeEntries)} G
          </div>
          <span class="sub">Listo para juntas de revisión y facturación</span>
        </div>
      </div>

      <!-- Árbol de Proyectos con sus Tareas -->
      <div class="va-projects-tree-stack">
        ${projects.map(proj => {
          const client = clients.find(c => c.id === proj.clientId);
          const projTasks = tasks.filter(t => t.projectId === proj.id);
          const projEntries = timeEntries.filter(e => e.projectId === proj.id);
          const projMins = projEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
          const projHours = (projMins / 60).toFixed(1);
          const hourlyRate = client ? (client.ratePerHour || 45) : 40;
          const estimatedCost = (projHours * hourlyRate).toFixed(0);
          const isStopwatchActive = this.timerRunning && this.currentTimerProjectId === proj.id;

          return `
            <div class="va-project-panel ${isStopwatchActive ? 'active-timer-project' : ''}" data-project-id="${proj.id}">
              <div class="va-project-header-row">
                <div class="va-proj-main-info">
                  <div class="va-proj-badge-line">
                    <span class="va-client-tag"><i data-lucide="briefcase"></i> ${client ? client.company : 'Interno / Hogwarts'}</span>
                    <span class="va-rate-tag">Tarifa: ${hourlyRate} G/h</span>
                    ${isStopwatchActive ? `<span class="va-recording-live-pill"><span class="pulse-dot"></span> Grabando tiempo</span>` : ''}
                  </div>
                  <h3 class="va-proj-title">${proj.title}</h3>
                  <p class="va-proj-desc">${proj.description}</p>
                </div>

                <div class="va-proj-metrics-box">
                  <div class="va-metric-item">
                    <span class="m-label">Tiempo Dedicado</span>
                    <span class="m-val highlight">${projHours} horas</span>
                  </div>
                  <div class="va-metric-item">
                    <span class="m-label">Presupuesto Invertido</span>
                    <span class="m-val">${proj.spent || 0} / ${proj.budget} G</span>
                  </div>
                  <div class="va-metric-item">
                    <span class="m-label">Avance</span>
                    <span class="m-val">${proj.progress || 0}%</span>
                  </div>
                </div>
              </div>

              <!-- Barra de herramientas del proyecto -->
              <div class="va-proj-actions-strip">
                <div class="actions-left">
                  <button class="action-btn-xs primary btn-start-proj-timer" data-project-id="${proj.id}" data-project-title="${proj.title}">
                    <i data-lucide="play"></i> Cronometrar Proyecto
                  </button>
                  <button class="action-btn-xs secondary btn-add-task-to-proj" data-project-id="${proj.id}">
                    <i data-lucide="plus"></i> + Nueva Tarea / Solicitud
                  </button>
                  <button class="action-btn-xs btn-review-summary" data-project-id="${proj.id}">
                    <i data-lucide="file-spreadsheet"></i> Resumen de Cobro / Junta
                  </button>
                </div>
                <div class="tasks-counter-badge">
                  <span>${projTasks.filter(t => t.status === 'completada').length} de ${projTasks.length} tareas completadas</span>
                </div>
              </div>

              <!-- Lista de Tareas del Proyecto -->
              <div class="va-proj-tasks-list">
                ${projTasks.length === 0 ? `
                  <div class="empty-proj-tasks-notice">
                    <span>No hay tareas registradas en este proyecto aún. Haz clic en <strong>+ Nueva Tarea / Solicitud</strong> para comenzar.</span>
                  </div>
                ` : projTasks.map(tsk => {
                  const subCount = tsk.subtasks ? tsk.subtasks.length : 0;
                  const completedSub = tsk.subtasks ? tsk.subtasks.filter(s => s.completed).length : 0;
                  const isTimerOnThisTask = this.timerRunning && this.currentTimerTaskId === tsk.id;

                  return `
                    <div class="va-task-item-card status-${tsk.status} ${isTimerOnThisTask ? 'is-being-tracked' : ''}">
                      <div class="task-card-left">
                        <span class="task-status-pill ${tsk.status}">${tsk.status.replace('_', ' ').toUpperCase()}</span>
                        <div>
                          <strong class="task-name">${tsk.title}</strong>
                          <div class="task-details-meta">
                            <span><i data-lucide="calendar"></i> Plazo: ${tsk.dueDate || 'Sin fecha'}</span>
                            ${subCount > 0 ? `<span><i data-lucide="check-square"></i> Subtareas: ${completedSub}/${subCount}</span>` : ''}
                            <span><i data-lucide="flag"></i> ${tsk.priority}</span>
                          </div>
                        </div>
                      </div>

                      <div class="task-card-right">
                        <button class="timer-task-btn ${isTimerOnThisTask ? 'active' : ''}" data-action="track-task" data-project-id="${proj.id}" data-task-id="${tsk.id}" data-task-title="${tsk.title}" title="Cronometrar esta tarea específica">
                          <i data-lucide="${isTimerOnThisTask ? 'pause' : 'clock'}"></i>
                          <span>${isTimerOnThisTask ? 'Grabando' : 'Cronometrar'}</span>
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Vista 2: Expediente de Clientes & Bóvedas seguras (Preservada y optimizada)
  renderClientsDossierView(clients, timeEntries) {
    const selectedClient = clients.find(c => c.id === this.selectedClientId) || clients[0];
    const clientEntries = selectedClient ? timeEntries.filter(t => t.clientId === selectedClient.id) : [];
    const requests = selectedClient ? (selectedClient.requests || []) : [];

    return `
      <div class="va-grid-container" style="box-sizing:border-box; max-width:100%;">
        <!-- Selector de Clientes -->
        <div class="va-clients-list" style="box-sizing:border-box; min-width:0;">
          <h4 class="va-section-title"><i data-lucide="users"></i> Cartera de Clientes (${clients.length})</h4>
          <div class="va-client-cards-stack">
            ${clients.map(c => {
              const isSelected = selectedClient && selectedClient.id === c.id;
              const usedPct = c.hoursContracted ? Math.min(100, Math.round((c.hoursUsed / c.hoursContracted) * 100)) : 0;
              return `
                <div class="va-client-card ${isSelected ? 'is-active' : ''}" data-client-id="${c.id}">
                  <div class="client-card-top">
                    <span class="client-company">${c.company}</span>
                    <span class="rate-badge">${c.ratePerHour} G/h</span>
                  </div>
                  <div class="client-name-line"><i data-lucide="user"></i> ${c.name}</div>
                  <div class="hours-progress-box">
                    <div class="hours-labels">
                      <span>Consumo: <strong>${c.hoursUsed}h</strong> / ${c.hoursContracted}h</span>
                      <span>${usedPct}%</span>
                    </div>
                    <div class="hours-track">
                      <div class="hours-fill ${usedPct > 90 ? 'alert' : ''}" style="width: ${usedPct}%"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Expediente del Cliente Seleccionado -->
        <div class="va-client-dossier" style="box-sizing:border-box; min-width:0;">
          ${selectedClient ? `
            <div class="client-file-sheet" style="box-sizing:border-box; width:100%;">
              <div class="file-header">
                <div>
                  <div class="file-tag">EXPEDIENTE VA #CLI-${selectedClient.id.slice(-3)}</div>
                  <h3 class="file-client-title">${selectedClient.company}</h3>
                  <div class="file-contact-details">
                    <span><i data-lucide="user"></i> ${selectedClient.name}</span>
                    <span><i data-lucide="mail"></i> ${selectedClient.email}</span>
                    <span><i data-lucide="phone"></i> ${selectedClient.phone}</span>
                  </div>
                </div>
                <div class="vault-access-box">
                  <span class="vault-label"><i data-lucide="shield-check"></i> Gestor Seguro Externo</span>
                  <a href="${selectedClient.credentialsVaultLink || '#'}" target="_blank" class="vault-link-btn" title="Abrir bóveda de credenciales">
                    <i data-lucide="key-round"></i> Ver Bóveda 1Password
                  </a>
                </div>
              </div>

              <div class="file-instructions-card">
                <div class="instruction-header">
                  <h4><i data-lucide="info"></i> Instrucciones & Reglas de Servicio</h4>
                  <span class="serv-badge">${selectedClient.services}</span>
                </div>
                <p class="instruction-text">${selectedClient.instructions || 'Sin instrucciones especiales registradas.'}</p>
              </div>

              <div class="dossier-double-column">
                <div class="dossier-subcard">
                  <div class="subcard-header">
                    <h4><i data-lucide="inbox"></i> Solicitudes (${requests.length})</h4>
                    <button class="action-btn-xs" id="btn-add-client-request" data-client-id="${selectedClient.id}">
                      <i data-lucide="plus"></i> Nueva Solicitud
                    </button>
                  </div>
                  <div class="requests-list">
                    ${requests.length === 0 ? `<p class="empty-hint">No hay solicitudes pendientes.</p>` : requests.map(r => `
                      <div class="request-item status-${r.status}">
                        <div class="req-title-row">
                          <span class="req-title">${r.title}</span>
                          <span class="req-status-tag">${r.status}</span>
                        </div>
                        <span class="req-date"><i data-lucide="clock"></i> Recibida: ${r.date}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="dossier-subcard">
                  <div class="subcard-header">
                    <h4><i data-lucide="history"></i> Bitácora de Horas</h4>
                  </div>
                  <div class="time-log-list">
                    ${clientEntries.length === 0 ? `<p class="empty-hint">Aún no hay horas registradas hoy.</p>` : clientEntries.map(e => `
                      <div class="time-log-item">
                        <div class="log-info">
                          <strong>${e.description}</strong>
                          <span>${e.date} · ${e.billable ? 'Facturable (' + (selectedClient.ratePerHour * (e.durationMinutes / 60)).toFixed(0) + ' G)' : 'No facturable'}</span>
                        </div>
                        <div class="log-duration">${e.durationMinutes} min</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  calculatePendingGalleons(projects, clients, timeEntries) {
    let total = 0;
    timeEntries.filter(t => t.billable).forEach(e => {
      const proj = projects.find(p => p.id === e.projectId);
      const client = proj && proj.clientId ? clients.find(c => c.id === proj.clientId) : null;
      const rate = client ? client.ratePerHour : (e.rate || 45);
      total += (e.durationMinutes / 60) * rate;
    });
    return Math.round(total).toLocaleString();
  }

  formatTime(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  attachEvents(container) {
    // 1. Alternar sección (Proyectos vs Clientes)
    const btnSecProjects = container.querySelector('#btn-va-sec-projects');
    const btnSecClients = container.querySelector('#btn-va-sec-clients');

    if (btnSecProjects) {
      btnSecProjects.addEventListener('click', () => {
        this.activeSection = 'projects_tasks';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    if (btnSecClients) {
      btnSecClients.addEventListener('click', () => {
        this.activeSection = 'clients_dossier';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // 2. Cronómetro Start / Pause
    const toggleBtn = container.querySelector('#btn-toggle-timer');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.timerRunning) {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
        } else {
          this.timerRunning = true;
          this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            const display = document.getElementById('va-timer-digits');
            if (display) display.textContent = this.formatTime(this.timerSeconds);
          }, 1000);
        }
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // 3. Reset cronómetro
    const resetBtn = container.querySelector('#btn-reset-timer');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(this.timerInterval);
        this.timerRunning = false;
        this.timerSeconds = 0;
        this.render(container);
      });
    }

    // 4. Registrar tiempo en bitácora
    const saveBtn = container.querySelector('#btn-save-time-entry');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (this.timerSeconds < 10) {
          alert('Por favor deja correr el cronómetro al menos 10 segundos para registrar tiempo de trabajo.');
          return;
        }

        const desc = (container.querySelector('#va-timer-desc') || {}).value || this.currentTimerDesc;
        const projSelect = container.querySelector('#va-timer-project-select');
        const projectId = projSelect ? projSelect.value : this.currentTimerProjectId;
        const taskSelect = container.querySelector('#va-timer-task-select');
        const taskId = taskSelect ? taskSelect.value : this.currentTimerTaskId;
        const isBillable = container.querySelector('#va-timer-billable')?.checked ?? true;

        const projects = window.plannerStore.get('projects') || [];
        const currentP = projects.find(p => p.id === projectId);
        const clientId = currentP ? currentP.clientId : null;

        const durationMinutes = Math.max(1, Math.round(this.timerSeconds / 60));

        window.plannerStore.addTimeEntry({
          projectId: projectId,
          taskId: taskId || null,
          clientId: clientId,
          description: desc,
          durationMinutes: durationMinutes,
          billable: isBillable,
          date: new Date().toISOString().split('T')[0]
        });

        // Detener y resetear cronómetro
        clearInterval(this.timerInterval);
        this.timerRunning = false;
        this.timerSeconds = 0;

        window.plannerAudio.playCheck();
        alert(`¡Tiempo registrado exitosamente! Se agregaron ${durationMinutes} minutos dedicados al proyecto.`);
        this.render(container);
      });
    }

    // 5. Cambio dinámico en selector de proyecto del cronómetro
    const projSelect = container.querySelector('#va-timer-project-select');
    if (projSelect) {
      projSelect.addEventListener('change', (e) => {
        this.currentTimerProjectId = e.target.value;
        this.currentTimerTaskId = '';
        this.render(container);
      });
    }

    // 6. Botón directo "Cronometrar Proyecto" desde tarjeta
    container.querySelectorAll('.btn-start-proj-timer').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = e.currentTarget.dataset.projectId;
        const pTitle = e.currentTarget.dataset.projectTitle;
        this.currentTimerProjectId = pId;
        this.currentTimerTaskId = '';
        this.currentTimerDesc = `Dedicación en proyecto: ${pTitle}`;
        
        // Iniciar cronómetro si estaba parado
        if (!this.timerRunning) {
          this.timerRunning = true;
          this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            const display = document.getElementById('va-timer-digits');
            if (display) display.textContent = this.formatTime(this.timerSeconds);
          }, 1000);
        }
        window.plannerAudio.playTabClick();
        this.render(container);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // 7. Botón directo "Cronometrar Tarea específica"
    container.querySelectorAll('[data-action="track-task"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = e.currentTarget.dataset.projectId;
        const tId = e.currentTarget.dataset.taskId;
        const tTitle = e.currentTarget.dataset.taskTitle;

        this.currentTimerProjectId = pId;
        this.currentTimerTaskId = tId;
        this.currentTimerDesc = `Ejecución de tarea: ${tTitle}`;

        if (!this.timerRunning) {
          this.timerRunning = true;
          this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            const display = document.getElementById('va-timer-digits');
            if (display) display.textContent = this.formatTime(this.timerSeconds);
          }, 1000);
        }
        window.plannerAudio.playTabClick();
        this.render(container);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // 8. Botón "+ Nueva Tarea / Solicitud" rápido
    const btnQuickTask = container.querySelector('#btn-quick-new-task-va');
    if (btnQuickTask) {
      btnQuickTask.addEventListener('click', () => {
        this.openVATaskModal(this.currentTimerProjectId);
      });
    }

    container.querySelectorAll('.btn-add-task-to-proj').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = e.currentTarget.dataset.projectId;
        this.openVATaskModal(pId);
      });
    });

    // 9. Botón "Resumen de Cobro / Junta de Revisión"
    container.querySelectorAll('.btn-review-summary').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = e.currentTarget.dataset.projectId;
        this.showProjectReviewSummary(pId);
      });
    });

    // 10. Selección de cliente en lista
    container.querySelectorAll('.va-client-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedClientId = e.currentTarget.dataset.clientId;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // 11. Añadir solicitud de cliente
    const btnAddReq = container.querySelector('#btn-add-client-request');
    if (btnAddReq) {
      btnAddReq.addEventListener('click', (e) => {
        const clientId = e.currentTarget.dataset.clientId;
        const reqTitle = prompt("Descripción de la nueva solicitud del cliente:");
        if (reqTitle && reqTitle.trim()) {
          window.plannerStore.addClientRequest(clientId, {
            title: reqTitle.trim(),
            status: 'pendiente'
          });
          window.plannerAudio.playCheck();
          this.render(container);
        }
      });
    }
  }

  openVATaskModal(preselectedProjectId = null) {
    const modal = document.getElementById('va-task-request-modal');
    if (!modal) return;

    const projSelect = document.getElementById('modal-va-task-project');
    const assignSelect = document.getElementById('modal-va-task-assignee');
    const projects = window.plannerStore.get('projects') || [];
    const team = window.plannerStore.get('team') || [];

    if (projSelect) {
      projSelect.innerHTML = projects.map(p => `
        <option value="${p.id}" ${p.id === preselectedProjectId ? 'selected' : ''}>${p.title}</option>
      `).join('');
    }

    if (assignSelect) {
      assignSelect.innerHTML = `
        <option value="">(Sin asignar)</option>
        ${team.map(m => `<option value="${m.id}">${m.name} (${m.role})</option>`).join('')}
      `;
    }

    modal.classList.add('open');
  }

  showProjectReviewSummary(projectId) {
    const projects = window.plannerStore.get('projects') || [];
    const clients = window.plannerStore.get('clients') || [];
    const tasks = window.plannerStore.get('tasks') || [];
    const timeEntries = window.plannerStore.get('timeEntries') || [];

    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const client = clients.find(c => c.id === project.clientId);
    const projTasks = tasks.filter(t => t.projectId === projectId);
    const projEntries = timeEntries.filter(e => e.projectId === projectId);
    const totalMins = projEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
    const totalHours = (totalMins / 60).toFixed(1);
    const rate = client ? client.ratePerHour : 45;
    const totalCost = (totalHours * rate).toFixed(0);

    const message = `📋 RESUMEN OPERATIVO PARA JUNTA / COBRO\n\n` +
      `Proyecto: ${project.title}\n` +
      `Cliente: ${client ? client.company : 'Interno'}\n` +
      `Tarifa Horaria: ${rate} Galeones / hora\n` +
      `Total de Horas Registradas: ${totalHours} horas (${totalMins} min)\n` +
      `Total Facturable Acumulado: ${totalCost} Galeones (🪙 G)\n` +
      `Tareas Asociadas: ${projTasks.length} (${projTasks.filter(t => t.status === 'completada').length} resueltas)\n\n` +
      `¿Deseas ir al módulo de Reportes para exportar este balance a Excel (CSV)?`;

    if (confirm(message)) {
      if (window.plannerApp && window.plannerApp.navigateToTab) {
        window.plannerApp.navigateToTab('reports');
      }
    }
  }
}

window.vaHubModule = new VAHubModule();
