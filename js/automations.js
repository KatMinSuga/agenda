/**
 * Módulo de Automatización Inteligente & Motor Predictivo
 * Control total para cada regla, horario de ejecución y predicciones
 * de tiempos (retrasos/holguras) y costos (presupuestos en Galeones/horas).
 */

class AutomationsModule {
  constructor() {
    this.currentCategoryFilter = 'all';
  }

  render(container) {
    const automations = window.plannerStore.get('automations') || [];
    const notifications = window.plannerStore.get('notifications') || [];
    
    // Ejecutar diagnóstico predictivo en vivo
    const diagnostic = window.plannerStore.runPredictionsDiagnostic();
    const activeRulesCount = automations.filter(r => r.enabled).length;
    const unreadNotifsCount = notifications.filter(n => !n.read).length;

    // Filtrar reglas según pestaña activa
    const filteredRules = this.currentCategoryFilter === 'all'
      ? automations
      : automations.filter(r => r.category === this.currentCategoryFilter);

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="zap"></i> Módulo 10 · Automatización Inteligente & Motor Predictivo</div>
          <h2 class="planner-page-title">Reglas Automáticas & Diagnóstico Predictivo</h2>
          <p class="planner-page-desc">
            Control total sobre cada regla, horarios programados y algoritmos de predicción: 
            anticipa retrasos en tareas críticas y desvíos presupuestarios en Galeones antes de que ocurran.
          </p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" id="btn-run-all-automations" title="Evaluar todas las reglas, calcular holguras y presupuestos">
            <i data-lucide="play-circle"></i> Ejecutar Diagnóstico en Vivo
          </button>
          <button class="action-btn primary" id="btn-new-automation" title="Crear nueva regla predictiva">
            <i data-lucide="plus"></i> Nueva Regla Predictiva
          </button>
        </div>
      </div>

      <!-- Cockpit de Métricas Predictivas en Vivo -->
      <div class="predictive-kpi-row">
        <div class="pred-kpi-card">
          <div class="pred-kpi-top">
            <span>Reglas en Monitoreo</span>
            <div class="pred-kpi-icon blue"><i data-lucide="cpu" style="width:15px; height:15px;"></i></div>
          </div>
          <div class="pred-kpi-val">${activeRulesCount} <span style="font-size:0.9rem; font-weight:400; color:var(--text-muted);">/ ${automations.length}</span></div>
          <div class="pred-kpi-hint"><i data-lucide="check-circle" style="width:12px; height:12px; color:#10b981;"></i> Motor activo en tiempo real</div>
        </div>

        <div class="pred-kpi-card">
          <div class="pred-kpi-top">
            <span>Predicción de Tiempos</span>
            <div class="pred-kpi-icon amber"><i data-lucide="clock" style="width:15px; height:15px;"></i></div>
          </div>
          <div class="pred-kpi-val" style="color:${diagnostic.criticalTimeCount > 0 ? '#c81e1e' : 'inherit'};">
            ${diagnostic.criticalTimeCount} <span style="font-size:0.85rem; font-weight:400; color:var(--text-muted);">en riesgo</span>
          </div>
          <div class="pred-kpi-hint"><i data-lucide="alert-triangle" style="width:12px; height:12px;"></i> Tareas evaluadas por holgura</div>
        </div>

        <div class="pred-kpi-card">
          <div class="pred-kpi-top">
            <span>Predicción de Costos</span>
            <div class="pred-kpi-icon green"><i data-lucide="coins" style="width:15px; height:15px;"></i></div>
          </div>
          <div class="pred-kpi-val" style="color:${diagnostic.criticalCostCount > 0 ? '#b45309' : 'inherit'};">
            ${diagnostic.criticalCostCount} <span style="font-size:0.85rem; font-weight:400; color:var(--text-muted);">desvíos</span>
          </div>
          <div class="pred-kpi-hint"><i data-lucide="trending-up" style="width:12px; height:12px;"></i> Presupuestos > 85% analizados</div>
        </div>

        <div class="pred-kpi-card">
          <div class="pred-kpi-top">
            <span>Alertas Preventivas</span>
            <div class="pred-kpi-icon purple"><i data-lucide="bell" style="width:15px; height:15px;"></i></div>
          </div>
          <div class="pred-kpi-val">${unreadNotifsCount}</div>
          <div class="pred-kpi-hint"><i data-lucide="inbox" style="width:12px; height:12px;"></i> Pendientes de revisión</div>
        </div>
      </div>

      <!-- Radar de Diagnóstico en Tiempo Real: Tiempos vs Costos -->
      <div class="predictive-radar-container">
        <!-- Monitor 1: Plazos y Tiempos -->
        <div class="predictive-monitor-card">
          <div class="predictive-monitor-header">
            <h4><i data-lucide="hourglass" style="color:var(--accent-primary);"></i> Monitor Predictivo de Plazos & Tiempos</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">Holguras automáticas</span>
          </div>
          <div class="predictive-items-list">
            ${diagnostic.timeRisks.slice(0, 3).map(item => `
              <div class="predictive-item-row">
                <div class="predictive-item-top">
                  <strong class="predictive-item-title">${item.title}</strong>
                  <span class="predictive-tag-risk ${item.riskLevel}">${item.riskLevel === 'critico' ? '⚠️ Riesgo Alto' : (item.riskLevel === 'alerta' ? '🟡 En Alerta' : '🟢 En Plazo')}</span>
                </div>
                <div class="predictive-progress-wrap">
                  <div class="predictive-progress-bar ${item.riskLevel === 'critico' ? 'red' : (item.riskLevel === 'alerta' ? 'amber' : 'green')}" style="width: ${item.subtaskPct}%;"></div>
                </div>
                <div class="predictive-item-meta">
                  <span><i data-lucide="calendar" style="width:11px; height:11px;"></i> Vence: ${item.dueDate} ${item.endTime || ''}</span>
                  <span><strong>Holgura: ${item.hoursRemaining}h</strong> · Subtareas: ${item.subtaskPct}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Monitor 2: Presupuestos y Costos -->
        <div class="predictive-monitor-card">
          <div class="predictive-monitor-header">
            <h4><i data-lucide="wallet" style="color:#226e38;"></i> Monitor Predictivo de Costos & Galeones</h4>
            <span style="font-size:0.75rem; color:var(--text-muted);">Tope presupuestario</span>
          </div>
          <div class="predictive-items-list">
            ${diagnostic.costRisks.slice(0, 3).map(item => `
              <div class="predictive-item-row">
                <div class="predictive-item-top">
                  <strong class="predictive-item-title">${item.title}</strong>
                  <span class="predictive-tag-risk ${item.riskLevel}">${item.pct >= 90 ? '🔴 Techo Crítico' : (item.pct >= 80 ? '🟡 Alerta 85%' : '🟢 Controlado')}</span>
                </div>
                <div class="predictive-progress-wrap">
                  <div class="predictive-progress-bar ${item.pct >= 90 ? 'red' : (item.pct >= 80 ? 'amber' : 'green')}" style="width: Math.min(100, ${item.pct})%;"></div>
                </div>
                <div class="predictive-item-meta">
                  <span>Consumido: <strong>${item.spent} / ${item.budget} ${item.type === 'proyecto' ? 'G' : 'h'}</strong> (${item.pct}%)</span>
                  <span>${item.projectedOverrun > 0 ? `<strong style="color:#c81e1e;">Desvío: +${item.projectedOverrun} G</strong>` : 'Holgura financiera OK'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Grilla de Reglas y Notificaciones -->
      <div class="automations-layout-grid">
        <!-- Lista de Reglas Configurables -->
        <div class="automations-list-card">
          <div class="card-top-row">
            <h4><i data-lucide="cpu"></i> Reglas del Sistema con Control Total (${automations.length})</h4>
            <span class="active-badge-status">Motor Predictivo Activo</span>
          </div>

          <div class="rules-toolbar">
            <div class="rules-filter-pills">
              <button class="rule-filter-btn ${this.currentCategoryFilter === 'all' ? 'active' : ''}" data-filter="all">Todas (${automations.length})</button>
              <button class="rule-filter-btn ${this.currentCategoryFilter === 'tiempos' ? 'active' : ''}" data-filter="tiempos">⏱️ Tiempos</button>
              <button class="rule-filter-btn ${this.currentCategoryFilter === 'costos' ? 'active' : ''}" data-filter="costos">🪙 Costos</button>
              <button class="rule-filter-btn ${this.currentCategoryFilter === 'eventos' ? 'active' : ''}" data-filter="eventos">⏳ Horarios</button>
              <button class="rule-filter-btn ${this.currentCategoryFilter === 'general' ? 'active' : ''}" data-filter="general">⚙️ General</button>
            </div>
          </div>

          <div class="rules-stack">
            ${filteredRules.length === 0 ? `<p class="empty-hint" style="padding:20px; text-align:center;">No hay reglas en esta categoría. ¡Crea una nueva regla con el botón superior!</p>` : filteredRules.map(rule => `
              <div class="automation-rule-box ${rule.enabled ? 'is-enabled' : 'is-disabled'}" data-rule-id="${rule.id}">
                <div class="rule-top-line">
                  <div class="rule-name-wrap">
                    <span class="rule-status-dot"></span>
                    <h5>${rule.name}</h5>
                  </div>
                  <label class="switch-toggle" title="${rule.enabled ? 'Desactivar regla' : 'Activar regla'}">
                    <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-action="toggle-rule" data-rule-id="${rule.id}">
                    <span class="slider round"></span>
                  </label>
                </div>

                <!-- Insignias de Categoría, Horario y Umbral Predictivo -->
                <div class="rule-badges-row">
                  <span class="rule-category-pill ${rule.category || 'general'}">
                    ${rule.category === 'tiempos' ? '⏱️ Tiempos & Plazos' : (rule.category === 'costos' ? '🪙 Costos & Presupuesto' : (rule.category === 'eventos' ? '⏳ Horarios' : '⚙️ General'))}
                  </span>
                  <span class="rule-schedule-pill" title="Frecuencia y horario de ejecución programada">
                    <i data-lucide="calendar-clock" style="width:11px; height:11px;"></i>
                    ${rule.scheduleLabel || (rule.scheduleType === 'tiempo_real' ? '⚡ Tiempo Real' : (rule.scheduleType === 'diario_08' ? '🌅 Diario 08:00 AM' : (rule.scheduleType === 'cada_hora' ? '🔄 Cada Hora' : '📅 Semanal')))}
                  </span>
                  ${rule.timeLeadHours ? `
                    <span class="rule-threshold-pill" title="Umbral de anticipación para alertas de tiempo">
                      <i data-lucide="clock" style="width:11px; height:11px;"></i> Anticipación: <strong style="margin-left:3px;">${rule.timeLeadHours}h</strong>
                    </span>
                  ` : ''}
                  ${rule.costThresholdPct ? `
                    <span class="rule-threshold-pill" title="Umbral predictivo de desviación presupuestaria">
                      <i data-lucide="percent" style="width:11px; height:11px;"></i> Alerta Presupuesto: <strong style="margin-left:3px;">${rule.costThresholdPct}%</strong>
                    </span>
                  ` : ''}
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
                  <span><i data-lucide="history" style="width:12px; height:12px;"></i> Última ejecución: ${rule.lastRun || 'Hoy'}</span>
                  <div class="rule-card-actions">
                    <button class="btn-rule-action" data-action="edit-rule" data-rule-id="${rule.id}" title="Editar parámetros y umbrales">
                      <i data-lucide="sliders" style="width:12px; height:12px;"></i> Configurar
                    </button>
                    <button class="btn-rule-action danger" data-action="delete-rule" data-rule-id="${rule.id}" title="Eliminar regla">
                      <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Registro de Actividad & Notificaciones en Vivo -->
        <div class="automations-log-card">
          <div class="notif-header-toolbar">
            <div>
              <h4 style="display:flex; align-items:center; gap:8px; margin:0 0 2px;"><i data-lucide="bell"></i> Historial de Alertas & Notificaciones</h4>
              <span style="font-size:0.75rem; color:var(--text-muted);">${unreadNotifsCount} no leídas · ${notifications.length} en total</span>
            </div>
            <div class="notif-toolbar-actions">
              <button class="action-btn-xs secondary" id="btn-mark-all-notifs-read" title="Marcar todas las alertas como leídas">
                <i data-lucide="check-check"></i> Todas leídas
              </button>
              <button class="action-btn-xs danger-subtle" id="btn-clear-read-notifications" title="Eliminar las alertas que ya revisaste">
                <i data-lucide="trash-2"></i> Limpiar leídas
              </button>
            </div>
          </div>

          <div class="notifications-feed">
            ${notifications.length === 0 ? `<p class="empty-hint">Bandeja de notificaciones al día. Cero alertas pendientes.</p>` : notifications.map(notif => `
              <div class="notif-feed-item ${notif.read ? 'is-read' : 'is-unread'} type-${notif.type}" data-notif-id="${notif.id}">
                <div class="notif-icon-wrap">
                  <i data-lucide="${notif.type === 'alerta' ? 'alert-triangle' : (notif.type === 'sistema' ? 'coins' : 'info')}"></i>
                </div>
                <div class="notif-body">
                  <div class="notif-title-row">
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span class="notif-status-dot ${notif.read ? 'read' : 'unread'}"></span>
                      <strong>${notif.title}</strong>
                      <span class="notif-badge-pill ${notif.read ? 'read' : 'unread'}">${notif.read ? 'Leída' : 'Nueva'}</span>
                    </div>
                    <span class="notif-time">${notif.time}</span>
                  </div>
                  <p class="notif-msg">${notif.message}</p>
                </div>
                <div class="notif-action-col">
                  <button class="btn-toggle-notif ${notif.read ? 'is-read' : 'is-unread'}" data-action="toggle-notif-read" data-notif-id="${notif.id}" title="${notif.read ? 'Marcar como no leída' : 'Marcar como leída'}">
                    <i data-lucide="${notif.read ? 'check-circle-2' : 'circle'}"></i>
                    <span>${notif.read ? 'Leída' : 'Marcar'}</span>
                  </button>
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
    // 1. Filtros de categoría de reglas
    container.querySelectorAll('.rule-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentCategoryFilter = e.currentTarget.dataset.filter;
        window.plannerAudio.playTabClick();
        this.render(container);
      });
    });

    // 2. Toggle On/Off de regla
    container.querySelectorAll('[data-action="toggle-rule"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const ruleId = e.target.dataset.ruleId;
        const rule = window.plannerStore.toggleAutomationRule(ruleId);
        if (rule) {
          window.plannerAudio.playTabClick();
          this.render(container);
        }
      });
    });

    // 3. Ejecutar diagnóstico predictivo manual
    const btnRun = container.querySelector('#btn-run-all-automations');
    if (btnRun) {
      btnRun.addEventListener('click', () => {
        const diag = window.plannerStore.runPredictionsDiagnostic();
        window.plannerStore.data.notifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'Diagnóstico Predictivo Ejecutado',
          message: `Auditoría completada con éxito. Se evaluaron ${diag.totalAuditedRules} reglas activas: ${diag.criticalTimeCount} tareas en riesgo de holgura y ${diag.criticalCostCount} proyectos con advertencia presupuestaria.`,
          time: 'Ahora mismo',
          type: 'sistema',
          read: false
        });
        window.plannerStore.saveData();
        window.plannerAudio.playPomodoroChime();
        this.render(container);
      });
    }

    // 4. Botón Nueva Regla
    const btnNew = container.querySelector('#btn-new-automation');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        if (window.plannerApp && window.plannerApp.openAutomationRuleModal) {
          window.plannerApp.openAutomationRuleModal();
        }
      });
    }

    // 5. Botón Editar Regla
    container.querySelectorAll('[data-action="edit-rule"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ruleId = e.currentTarget.dataset.ruleId;
        const rules = window.plannerStore.get('automations') || [];
        const rule = rules.find(r => r.id === ruleId);
        if (rule && window.plannerApp && window.plannerApp.openAutomationRuleModal) {
          window.plannerApp.openAutomationRuleModal(rule);
        }
      });
    });

    // 6. Botón Eliminar Regla
    container.querySelectorAll('[data-action="delete-rule"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ruleId = e.currentTarget.dataset.ruleId;
        if (confirm("¿Estás seguro de eliminar esta regla de automatización y su monitoreo predictivo?")) {
          window.plannerStore.deleteAutomationRule(ruleId);
          window.plannerAudio.playCheck();
          this.render(container);
        }
      });
    });

    // 7. Limpiar notificaciones leídas
    const btnClear = container.querySelector('#btn-clear-read-notifications');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        window.plannerStore.clearReadNotifications();
        window.plannerAudio.playCheck();
        this.render(container);
      });
    }

    // 8. Marcar todas las notificaciones como leídas
    const btnMarkAll = container.querySelector('#btn-mark-all-notifs-read');
    if (btnMarkAll) {
      btnMarkAll.addEventListener('click', () => {
        window.plannerStore.markAllNotificationsRead();
        window.plannerAudio.playCheck();
        this.render(container);
      });
    }

    // 9. Clic en botón individual para marcar/desmarcar leída
    container.querySelectorAll('[data-action="toggle-notif-read"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const notifId = e.currentTarget.dataset.notifId;
        window.plannerStore.toggleNotificationRead(notifId);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // 10. Clic en la tarjeta de notificación para alternar leída
    container.querySelectorAll('.notif-feed-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const notifId = e.currentTarget.dataset.notifId;
        window.plannerStore.toggleNotificationRead(notifId);
        this.render(container);
      });
    });
  }
}

window.automationsModule = new AutomationsModule();
