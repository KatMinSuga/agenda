/**
 * Módulo 06 · Control Financiero & Suscripciones
 * Ingresos, gastos, presupuestos por categoría, gestión total de suscripciones
 * (agregar, editar precio/plan, dar de baja) y apartado tipo nota con constancia
 * de auditoría para cada modificación con fecha y hora.
 */

class FinanceModule {
  constructor() {
    this.filterType = 'all'; // 'all', 'ingreso', 'gasto'
  }

  render(container) {
    const finance = window.plannerStore.get('finance') || { transactions: [], subscriptions: [], budgetCategories: [], subscriptionHistory: [] };
    const transactions = finance.transactions || [];
    const subscriptions = finance.subscriptions || [];
    const budgetCategories = finance.budgetCategories || [];
    const subscriptionHistory = finance.subscriptionHistory || [];

    // Cálculos de totales
    const totalIncome = transactions
      .filter(t => t.type === 'ingreso' && t.status === 'cobrado')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const pendingIncome = transactions
      .filter(t => t.type === 'ingreso' && t.status === 'pendiente')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    const filteredTrx = transactions.filter(t => {
      if (this.filterType !== 'all' && t.type !== this.filterType) return false;
      return true;
    });

    // Total mensual de suscripciones activas
    const monthlySubsTotal = subscriptions
      .filter(s => s.active !== false)
      .reduce((sum, s) => sum + Number(s.amount), 0);

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="wallet"></i> Módulo 06 · Control Financiero</div>
          <h2 class="planner-page-title">Finanzas, Suscripciones & Auditoría</h2>
          <p class="planner-page-desc">Monitoreo de ingresos y gastos, gestión total de suscripciones con constancia obligatoria en notas históricas de cada cambio.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" id="btn-new-subscription-header">
            <i data-lucide="refresh-cw"></i> + Gestionar Suscripción
          </button>
          <button class="action-btn primary" id="btn-new-trx-modal">
            <i data-lucide="plus"></i> Nuevo Movimiento
          </button>
        </div>
      </div>

      <!-- Tarjetas KPI Financieras -->
      <div class="finance-kpi-row">
        <div class="finance-kpi-card income">
          <div class="kpi-top">
            <span class="kpi-label">Ingresos Cobrados</span>
            <span class="kpi-icon"><i data-lucide="trending-up"></i></span>
          </div>
          <div class="kpi-amount">🪙 ${totalIncome.toLocaleString()} G</div>
          <span class="kpi-foot positive">+${transactions.filter(t => t.type === 'ingreso').length} facturas liquidadas</span>
        </div>

        <div class="finance-kpi-card expense">
          <div class="kpi-top">
            <span class="kpi-label">Gastos Operativos</span>
            <span class="kpi-icon"><i data-lucide="trending-down"></i></span>
          </div>
          <div class="kpi-amount">🪙 ${totalExpenses.toLocaleString()} G</div>
          <span class="kpi-foot negative">${transactions.filter(t => t.type === 'gasto').length} pagos registrados</span>
        </div>

        <div class="finance-kpi-card balance">
          <div class="kpi-top">
            <span class="kpi-label">Margen Neto (Utilidad)</span>
            <span class="kpi-icon"><i data-lucide="piggy-bank"></i></span>
          </div>
          <div class="kpi-amount ${netBalance >= 0 ? 'text-success' : 'text-danger'}">🪙 ${netBalance.toLocaleString()} G</div>
          <span class="kpi-foot neutral">Bóveda Gringotts con superávit</span>
        </div>

        <div class="finance-kpi-card pending">
          <div class="kpi-top">
            <span class="kpi-label">Suscripciones Fijas</span>
            <span class="kpi-icon"><i data-lucide="refresh-cw"></i></span>
          </div>
          <div class="kpi-amount text-warning">🪙 ${monthlySubsTotal} G/mes</div>
          <span class="kpi-foot warning">${subscriptions.length} servicios activos</span>
        </div>
      </div>

      <div class="finance-grid-split">
        <!-- Columna Izquierda: Registro de Transacciones -->
        <div class="finance-main-sheet">
          <div class="table-header-bar">
            <h4><i data-lucide="list"></i> Movimientos Recientes</h4>
            <div class="trx-filter-buttons">
              <button class="trx-pill ${this.filterType === 'all' ? 'active' : ''}" data-trx-filter="all">Todos</button>
              <button class="trx-pill ${this.filterType === 'ingreso' ? 'active' : ''}" data-trx-filter="ingreso">Ingresos</button>
              <button class="trx-pill ${this.filterType === 'gasto' ? 'active' : ''}" data-trx-filter="gasto">Gastos</button>
            </div>
          </div>

          <div class="transactions-table-wrap">
            <table class="notes-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto / Detalle</th>
                  <th>Categoría</th>
                  <th>Cliente / Entidad</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${filteredTrx.map(t => `
                  <tr class="trx-row type-${t.type}">
                    <td class="col-date">${t.date}</td>
                    <td class="col-desc font-semibold">${t.description}</td>
                    <td><span class="trx-cat-badge">${t.category}</span></td>
                    <td class="col-client">${t.client || '-'}</td>
                    <td class="col-amount ${t.type === 'ingreso' ? 'amt-income' : 'amt-expense'}">
                      ${t.type === 'ingreso' ? '+' : '-'}🪙 ${Number(t.amount).toLocaleString()} G
                    </td>
                    <td>
                      <span class="status-badge-trx status-${t.status}">
                        ${t.status === 'cobrado' || t.status === 'pagado' ? '✓ ' + t.status : '⏳ ' + t.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Columna Derecha: Presupuestos, Suscripciones & Apartado Tipo Nota -->
        <div class="finance-side-col">
          <!-- Presupuesto por Categoría -->
          <div class="finance-box-card">
            <h4><i data-lucide="pie-chart"></i> Presupuesto del Mes en Hogwarts</h4>
            <div class="budget-bars-stack">
              ${budgetCategories.map(b => {
                const pct = Math.round((b.spent / b.allocated) * 100);
                return `
                  <div class="budget-item">
                    <div class="budget-item-top">
                      <span class="b-cat-name">${b.category}</span>
                      <span class="b-cat-numbers">🪙 ${b.spent} / ${b.allocated} G (${pct}%)</span>
                    </div>
                    <div class="budget-track">
                      <div class="budget-fill ${pct > 90 ? 'danger' : ''}" style="width: ${Math.min(100, pct)}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Gestión de Suscripciones Activas -->
          <div class="finance-box-card">
            <div class="box-header-sm">
              <div>
                <h4><i data-lucide="refresh-cw"></i> Suscripciones Activas (${subscriptions.length})</h4>
                <span class="sub-label-dim">Total: 🪙 ${monthlySubsTotal} G / mes</span>
              </div>
              <button class="action-btn-xs primary" id="btn-add-subscription">
                <i data-lucide="plus"></i> Nueva
              </button>
            </div>

            <div class="subs-list">
              ${subscriptions.length === 0 ? `<p class="empty-hint">No hay suscripciones activas.</p>` : subscriptions.map(s => `
                <div class="sub-row-item-custom">
                  <div class="sub-info-left">
                    <strong class="sub-name">${s.name}</strong>
                    <div class="sub-meta-line">
                      <span><i data-lucide="calendar"></i> Renueva: ${s.nextRenewal} (${s.cycle})</span>
                      <span class="sub-cat-pill">${s.category || 'General'}</span>
                    </div>
                  </div>
                  <div class="sub-actions-right">
                    <div class="sub-price">🪙 ${s.amount} G<small>/${s.cycle === 'anual' ? 'año' : 'mes'}</small></div>
                    <div class="sub-btns-row">
                      <button class="btn-sub-action edit" data-sub-id="${s.id}" title="Cambiar precio, plan o ciclo">
                        <i data-lucide="edit-3"></i> Editar Plan
                      </button>
                      <button class="btn-sub-action delete" data-sub-id="${s.id}" title="Dar de baja este servicio">
                        <i data-lucide="trash-2"></i> Baja
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- APARTADO TIPO NOTA: Constancia de Modificaciones de Suscripciones -->
          <div class="finance-box-card sub-notes-paper-card">
            <div class="box-header-sm">
              <div>
                <h4><i data-lucide="clipboard-list"></i> Constancia & Notas de Modificaciones</h4>
                <span class="sub-label-dim">Historial inmutable de auditoría</span>
              </div>
              <button class="btn-text-sm" id="btn-add-manual-sub-note">
                <i data-lucide="plus"></i> Anotar Nota
              </button>
            </div>

            <div class="sub-history-notes-stack">
              ${subscriptionHistory.length === 0 ? `
                <p class="empty-hint">Aún no se han registrado modificaciones en las suscripciones.</p>
              ` : subscriptionHistory.map(h => `
                <div class="sub-note-log-item">
                  <div class="log-top-row">
                    <span class="log-action-badge">${h.action}</span>
                    <span class="log-date"><i data-lucide="clock"></i> ${h.date}</span>
                  </div>
                  <strong class="log-sub-name">${h.subscriptionName}</strong>
                  ${h.oldPrice !== h.newPrice ? `
                    <div class="log-price-diff">
                      <span>Antes: <strong>${h.oldPrice} G</strong></span> ➔ <span>Nuevo: <strong>${h.newPrice} G</strong> (${h.newCycle || 'mes'})</span>
                    </div>
                  ` : ''}
                  <div class="log-note-bubble">
                    <i data-lucide="message-square"></i>
                    <em>"${h.note || 'Sin nota de justificación.'}"</em>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  attachEvents(container) {
    // 1. Filtros de movimientos
    container.querySelectorAll('[data-trx-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterType = e.currentTarget.dataset.trxFilter;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    // 2. Nuevo Movimiento Modal
    const btnNew = container.querySelector('#btn-new-trx-modal');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        window.plannerApp.openTransactionModal();
      });
    }

    // 3. Botones para Nueva Suscripción
    const btnAddSub = container.querySelector('#btn-add-subscription');
    const btnAddSubHeader = container.querySelector('#btn-new-subscription-header');
    const openAddSubModal = () => {
      this.openSubscriptionModal(null);
    };

    if (btnAddSub) btnAddSub.addEventListener('click', openAddSubModal);
    if (btnAddSubHeader) btnAddSubHeader.addEventListener('click', openAddSubModal);

    // 4. Editar Plan / Precio de Suscripción existente
    container.querySelectorAll('.btn-sub-action.edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subId = e.currentTarget.dataset.subId;
        const finance = window.plannerStore.get('finance') || {};
        const sub = (finance.subscriptions || []).find(s => s.id === subId);
        if (sub) {
          this.openSubscriptionModal(sub);
        }
      });
    });

    // 5. Dar de baja / Eliminar Suscripción con constancia en nota
    container.querySelectorAll('.btn-sub-action.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subId = e.currentTarget.dataset.subId;
        const finance = window.plannerStore.get('finance') || {};
        const sub = (finance.subscriptions || []).find(s => s.id === subId);
        if (sub) {
          const reason = prompt(`¿Motivo de la baja o cancelación de "${sub.name}"?\n(Quedará registrado en el apartado de notas de auditoría):`, "Baja por optimización de presupuesto en Bóveda Gringotts");
          if (reason !== null) {
            window.plannerStore.deleteSubscription(subId, reason);
            window.plannerAudio.playCheck();
            this.render(container);
          }
        }
      });
    });

    // 6. Añadir Nota Manual sobre Suscripciones
    const btnAddManualNote = container.querySelector('#btn-add-manual-sub-note');
    if (btnAddManualNote) {
      btnAddManualNote.addEventListener('click', () => {
        const noteText = prompt("Escribe una anotación o justificación sobre las suscripciones y contratos actuales:");
        if (noteText && noteText.trim()) {
          window.plannerStore.addSubscriptionNote(null, noteText);
          window.plannerAudio.playCheck();
          this.render(container);
        }
      });
    }
  }

  openSubscriptionModal(subToEdit = null) {
    const modal = document.getElementById('subscription-editor-modal');
    if (!modal) return;

    const idInput = document.getElementById('modal-sub-id');
    const nameInput = document.getElementById('modal-sub-name');
    const amountInput = document.getElementById('modal-sub-amount');
    const cycleInput = document.getElementById('modal-sub-cycle');
    const renewalInput = document.getElementById('modal-sub-renewal');
    const catInput = document.getElementById('modal-sub-category');
    const noteInput = document.getElementById('modal-sub-note');

    if (subToEdit) {
      if (idInput) idInput.value = subToEdit.id;
      if (nameInput) nameInput.value = subToEdit.name || '';
      if (amountInput) amountInput.value = subToEdit.amount || 0;
      if (cycleInput) cycleInput.value = subToEdit.cycle || 'mensual';
      if (renewalInput) renewalInput.value = subToEdit.nextRenewal || '2026-11-01';
      if (catInput) catInput.value = subToEdit.category || 'Seguridad & Finanzas';
      if (noteInput) {
        noteInput.value = '';
        noteInput.placeholder = `Motivo del cambio de precio o plan para ${subToEdit.name}...`;
      }
    } else {
      if (idInput) idInput.value = '';
      if (nameInput) nameInput.value = '';
      if (amountInput) amountInput.value = '';
      if (cycleInput) cycleInput.value = 'mensual';
      if (renewalInput) renewalInput.value = new Date().toISOString().split('T')[0];
      if (catInput) catInput.value = 'Seguridad & Finanzas';
      if (noteInput) {
        noteInput.value = 'Alta inicial de servicio suscrito para soporte operativo.';
      }
    }

    modal.classList.add('open');
    if (amountInput) setTimeout(() => amountInput.focus(), 80);
  }
}

window.financeModule = new FinanceModule();
