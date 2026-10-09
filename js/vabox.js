/**
 * Módulo de Asistente Virtual (VA Hub) & Gestión de Clientes
 * Cronómetro de horas facturables en vivo, control de solicitudes,
 * seguimiento de instrucciones y bóveda segura de accesos.
 */

class VAHubModule {
  constructor() {
    this.selectedClientId = 'cli-1';
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.timerRunning = false;
    this.currentTimerClient = 'cli-1';
    this.currentTimerBillable = true;
  }

  render(container) {
    const clients = window.plannerStore.get('clients') || [];
    const timeEntries = window.plannerStore.get('timeEntries') || [];
    const selectedClient = clients.find(c => c.id === this.selectedClientId) || clients[0];

    const totalBillableMins = timeEntries
      .filter(t => t.billable)
      .reduce((acc, cur) => acc + (cur.durationMinutes || 0), 0);
    const totalBilledHours = (totalBillableMins / 60).toFixed(1);

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="briefcase"></i> Módulo 04 · Asistente Virtual & Clientes</div>
          <h2 class="planner-page-title">VA Operations & Time Tracker</h2>
          <p class="planner-page-desc">Control riguroso de horas contratadas vs consumidas, cronómetro facturable en vivo, solicitudes pendientes y bóveda de credenciales.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn primary" id="btn-new-client-modal">
            <i data-lucide="user-plus"></i> Nuevo Cliente
          </button>
        </div>
      </div>

      <!-- Time Tracker de Trabajo en Vivo (Stopwatch Bar) -->
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
          <input type="text" id="va-timer-desc" class="form-input-sm" placeholder="¿En qué tarea estás trabajando ahora?" value="Auditoría de conciliación de cuentas">
          <select id="va-timer-client-select" class="form-select-sm">
            ${clients.map(c => `
              <option value="${c.id}" ${c.id === this.currentTimerClient ? 'selected' : ''}>${c.company} (${c.name})</option>
            `).join('')}
          </select>
          <label class="billable-toggle-label">
            <input type="checkbox" id="va-timer-billable" ${this.currentTimerBillable ? 'checked' : ''}>
            <span>Facturable</span>
          </label>
        </div>

        <div class="tracker-actions">
          <button class="timer-btn ${this.timerRunning ? 'pause' : 'start'}" id="btn-toggle-timer">
            <i data-lucide="${this.timerRunning ? 'pause' : 'play'}"></i>
            <span>${this.timerRunning ? 'Pausar' : 'Iniciar'}</span>
          </button>
          <button class="timer-btn save" id="btn-save-time-entry" title="Guardar registro en bitácora">
            <i data-lucide="check"></i> Registrar
          </button>
          <button class="timer-btn reset" id="btn-reset-timer" title="Reiniciar a cero">
            <i data-lucide="rotate-ccw"></i>
          </button>
        </div>
      </div>

      <!-- Grid Principal de Clientes & Expediente -->
      <div class="va-grid-container">
        <!-- Selector de Clientes -->
        <div class="va-clients-list">
          <h4 class="va-section-title"><i data-lucide="users"></i> Cartera de Clientes (${clients.length})</h4>
          <div class="va-client-cards-stack">
            ${clients.map(c => {
              const isSelected = selectedClient && selectedClient.id === c.id;
              const usedPct = c.hoursContracted ? Math.min(100, Math.round((c.hoursUsed / c.hoursContracted) * 100)) : 0;
              return `
                <div class="va-client-card ${isSelected ? 'is-active' : ''}" data-client-id="${c.id}">
                  <div class="client-card-top">
                    <span class="client-company">${c.company}</span>
                    <span class="rate-badge">$${c.ratePerHour}/h</span>
                  </div>
                  <div class="client-name-line"><i data-lucide="user"></i> ${c.name}</div>

                  <!-- Barra de horas consumidas -->
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
        <div class="va-client-dossier">
          ${selectedClient ? this.renderClientDossier(selectedClient, timeEntries) : ''}
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderClientDossier(c, timeEntries) {
    const clientEntries = timeEntries.filter(t => t.clientId === c.id);
    const requests = c.requests || [];

    return `
      <div class="client-file-sheet">
        <div class="file-header">
          <div>
            <div class="file-tag">EXPEDIENTE VA #CLI-${c.id.slice(-3)}</div>
            <h3 class="file-client-title">${c.company}</h3>
            <div class="file-contact-details">
              <span><i data-lucide="user"></i> ${c.name}</span>
              <span><i data-lucide="mail"></i> ${c.email}</span>
              <span><i data-lucide="phone"></i> ${c.phone}</span>
            </div>
          </div>
          <div class="vault-access-box">
            <span class="vault-label"><i data-lucide="shield-check"></i> Gestor Seguro Externo</span>
            <a href="${c.credentialsVaultLink || '#'}" target="_blank" class="vault-link-btn" title="Abrir boveda segura">
              <i data-lucide="key-round"></i> Ver Bóveda 1Password
            </a>
          </div>
        </div>

        <!-- Instrucciones y Políticas del Cliente -->
        <div class="file-instructions-card">
          <div class="instruction-header">
            <h4><i data-lucide="info"></i> Instrucciones & Reglas de Servicio</h4>
            <span class="serv-badge">${c.services}</span>
          </div>
          <p class="instruction-text">${c.instructions || 'Sin instrucciones especiales registradas.'}</p>
        </div>

        <div class="dossier-double-column">
          <!-- Columna: Solicitudes & Tareas del Cliente -->
          <div class="dossier-subcard">
            <div class="subcard-header">
              <h4><i data-lucide="inbox"></i> Solicitudes Recibidas (${requests.length})</h4>
              <button class="action-btn-xs" id="btn-add-client-request" data-client-id="${c.id}">
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

          <!-- Columna: Bitácora de Horas Registradas -->
          <div class="dossier-subcard">
            <div class="subcard-header">
              <h4><i data-lucide="history"></i> Bitácora de Horas Recientes</h4>
            </div>
            <div class="time-log-list">
              ${clientEntries.length === 0 ? `<p class="empty-hint">Aún no hay horas registradas hoy.</p>` : clientEntries.map(e => `
                <div class="time-log-item">
                  <div class="log-info">
                    <strong>${e.description}</strong>
                    <span>${e.date} · ${e.billable ? 'Facturable ($' + (c.ratePerHour * (e.durationMinutes / 60)).toFixed(0) + ')' : 'No facturable'}</span>
                  </div>
                  <div class="log-duration">${e.durationMinutes} min</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  formatTime(totalSecs) {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  attachEvents(container) {
    // Selección de cliente en lista
    container.querySelectorAll('.va-client-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedClientId = e.currentTarget.dataset.clientId;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // Cronómetro Start/Pause
    const toggleBtn = container.querySelector('#btn-toggle-timer');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.timerRunning) {
          // Pausar
          clearInterval(this.timerInterval);
          this.timerRunning = false;
        } else {
          // Iniciar
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

    // Reset cronómetro
    const resetBtn = container.querySelector('#btn-reset-timer');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(this.timerInterval);
        this.timerRunning = false;
        this.timerSeconds = 0;
        this.render(container);
      });
    }

    // Guardar registro de tiempo
    const saveBtn = container.querySelector('#btn-save-time-entry');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (this.timerSeconds < 30 && this.timerSeconds > 0) {
          alert('El tiempo registrado debe ser de al menos 1 minuto para guardarse.');
          return;
        }
        const desc = (container.querySelector('#va-timer-desc') || {}).value || 'Sesión de trabajo VA';
        const clientSelect = container.querySelector('#va-timer-client-select');
        const clientId = clientSelect ? clientSelect.value : this.selectedClientId;
        const billableBox = container.querySelector('#va-timer-billable');
        const isBillable = billableBox ? billableBox.checked : true;

        const durationMinutes = Math.max(1, Math.round(this.timerSeconds / 60));

        window.plannerStore.addTimeEntry({
          clientId: clientId,
          description: desc,
          durationMinutes: durationMinutes,
          billable: isBillable,
          date: new Date().toISOString().split('T')[0]
        });

        // Detener y resetear
        clearInterval(this.timerInterval);
        this.timerRunning = false;
        this.timerSeconds = 0;

        window.plannerAudio.playCheck();
        alert(`¡Registro guardado exitosamente! Se añadieron ${durationMinutes} minutos.`);
        this.render(container);
      });
    }

    // Modal nuevo cliente
    const btnNewClient = container.querySelector('#btn-new-client-modal');
    if (btnNewClient) {
      btnNewClient.addEventListener('click', () => {
        window.plannerApp.openClientModal();
      });
    }

    // Añadir solicitud de cliente
    const btnAddReq = container.querySelector('#btn-add-client-request');
    if (btnAddReq) {
      btnAddReq.addEventListener('click', (e) => {
        const clientId = e.currentTarget.dataset.clientId;
        const reqTitle = prompt("Descripción de la solicitud del cliente:");
        if (reqTitle && reqTitle.trim()) {
          const clients = window.plannerStore.get('clients') || [];
          const c = clients.find(item => item.id === clientId);
          if (c) {
            if (!c.requests) c.requests = [];
            c.requests.unshift({
              id: 'req-' + Date.now(),
              title: reqTitle.trim(),
              status: 'pendiente',
              date: new Date().toISOString().split('T')[0]
            });
            window.plannerStore.saveData();
            this.render(container);
          }
        }
      });
    }
  }
}

window.vaHubModule = new VAHubModule();
