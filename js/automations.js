/**
 * Módulo de Automatización & Alertas
 * Reglas automáticas, recordatorios, monitoreo de retrasos
 * y notificaciones inteligentes.
 */

class AutomationsModule {
  constructor() {}

  render(container) {
    const automations = window.plannerStore.get('automations') || [];
    const notifications = window.plannerStore.get('notifications') || [];

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="zap"></i> Módulo 09 · Automatización Inteligente</div>
          <h2 class="planner-page-title">Reglas Automáticas & Alertas</h2>
          <p class="planner-page-desc">Deja que el sistema trabaje por ti: notificaciones preventivas, asignación de tareas recurrentes y detección de retrasos sin intervención manual.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" id="btn-run-all-automations">
            <i data-lucide="play-circle"></i> Ejecutar Auditoría Ahora
          </button>
          <button class="action-btn primary" id="btn-new-automation">
            <i data-lucide="plus"></i> Nueva Regla
          </button>
        </div>
      </div>

      <div class="automations-layout-grid">
        <!-- Lista de Reglas Activas -->
        <div class="automations-list-card">
          <div class="card-top-row">
            <h4><i data-lucide="cpu"></i> Reglas del Sistema (${automations.length})</h4>
            <span class="active-badge-status">Motor Activo</span>
          </div>

          <div class="rules-stack">
            ${automations.map(rule => `
              <div class="automation-rule-box ${rule.enabled ? 'is-enabled' : 'is-disabled'}">
                <div class="rule-top-line">
                  <div class="rule-name-wrap">
                    <span class="rule-status-dot"></span>
                    <h5>${rule.name}</h5>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-action="toggle-rule" data-rule-id="${rule.id}">
                    <span class="slider round"></span>
                  </label>
                </div>

                <div class="rule-flow-diagram">
                  <div class="flow-step trigger">
                    <span class="step-label">DISPARADOR (TRIGGER)</span>
                    <span class="step-val"><i data-lucide="arrow-right"></i> ${rule.trigger}</span>
                  </div>
                  <div class="flow-arrow"><i data-lucide="arrow-down"></i></div>
                  <div class="flow-step action">
                    <span class="step-label">ACCIÓN AUTOMÁTICA</span>
                    <span class="step-val"><i data-lucide="check"></i> ${rule.action}</span>
                  </div>
                </div>

                <div class="rule-footer-meta">
                  <span><i data-lucide="clock"></i> Última ejecución: ${rule.lastRun}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Registro de Actividad & Notificaciones en Vivo -->
        <div class="automations-log-card">
          <div class="card-top-row">
            <h4><i data-lucide="bell"></i> Historial de Notificaciones & Alertas</h4>
            <button class="btn-text-sm" id="btn-clear-notifications">Limpiar leídas</button>
          </div>

          <div class="notifications-feed">
            ${notifications.length === 0 ? `<p class="empty-hint">Bandeja de notificaciones vacía.</p>` : notifications.map(notif => `
              <div class="notif-feed-item ${notif.read ? 'is-read' : 'is-unread'} type-${notif.type}" data-notif-id="${notif.id}">
                <div class="notif-icon-wrap">
                  <i data-lucide="${notif.type === 'alerta' ? 'alert-triangle' : (notif.type === 'sistema' ? 'dollar-sign' : 'info')}"></i>
                </div>
                <div class="notif-body">
                  <div class="notif-title-row">
                    <strong>${notif.title}</strong>
                    <span class="notif-time">${notif.time}</span>
                  </div>
                  <p class="notif-msg">${notif.message}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  attachEvents(container) {
    // Toggle rule
    container.querySelectorAll('[data-action="toggle-rule"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const ruleId = e.target.dataset.ruleId;
        const rules = window.plannerStore.get('automations') || [];
        const rule = rules.find(r => r.id === ruleId);
        if (rule) {
          rule.enabled = e.target.checked;
          window.plannerStore.saveData();
          window.plannerAudio.playTabClick();
        }
      });
    });

    // Ejecutar auditoría manual
    const btnRun = container.querySelector('#btn-run-all-automations');
    if (btnRun) {
      btnRun.addEventListener('click', () => {
        const tasks = window.plannerStore.get('tasks') || [];
        const urgentCount = tasks.filter(t => t.priority === 'urgente' && t.status !== 'completada').length;

        // Añadir notificación
        window.plannerStore.data.notifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'Auditoría de Tareas Completada',
          message: `El motor de automatización revisó el sistema. Se detectaron ${urgentCount} tareas prioritarias vigentes.`,
          time: 'Ahora mismo',
          type: 'sistema',
          read: false
        });
        window.plannerStore.saveData();
        window.plannerAudio.playPomodoroChime();
        this.render(container);
      });
    }

    // Marcar leídas
    const btnClear = container.querySelector('#btn-clear-notifications');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        window.plannerStore.data.notifications = window.plannerStore.data.notifications.filter(n => !n.read);
        window.plannerStore.saveData();
        this.render(container);
      });
    }

    // Clic en notificación para marcar como leída
    container.querySelectorAll('.notif-feed-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const notifId = e.currentTarget.dataset.notifId;
        window.plannerStore.markNotificationRead(notifId);
        this.render(container);
      });
    });
  }
}

window.automationsModule = new AutomationsModule();
