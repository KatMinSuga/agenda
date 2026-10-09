/**
 * Módulo de Gestión Financiera
 * Ingresos, gastos, presupuestos por categoría, suscripciones activas
 * y control de facturas pendientes de cobro.
 */

class FinanceModule {
  constructor() {
    this.filterType = 'all'; // 'all', 'ingreso', 'gasto'
  }

  render(container) {
    const finance = window.plannerStore.get('finance') || { transactions: [], subscriptions: [], budgetCategories: [] };
    const transactions = finance.transactions || [];
    const subscriptions = finance.subscriptions || [];
    const budgetCategories = finance.budgetCategories || [];

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

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="wallet"></i> Módulo 06 · Control Financiero</div>
          <h2 class="planner-page-title">Finanzas & Flujo de Caja</h2>
          <p class="planner-page-desc">Monitorea la salud financiera de tu negocio y vida personal. Evita fugas de suscripciones y asegura cobros puntuales.</p>
        </div>
        <div class="header-actions">
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
          <div class="kpi-amount">$${totalIncome.toLocaleString()}</div>
          <span class="kpi-foot positive">+${transactions.filter(t => t.type === 'ingreso').length} facturas emitidas</span>
        </div>

        <div class="finance-kpi-card expense">
          <div class="kpi-top">
            <span class="kpi-label">Gastos Operativos</span>
            <span class="kpi-icon"><i data-lucide="trending-down"></i></span>
          </div>
          <div class="kpi-amount">$${totalExpenses.toLocaleString()}</div>
          <span class="kpi-foot negative">${transactions.filter(t => t.type === 'gasto').length} gastos liquidados</span>
        </div>

        <div class="finance-kpi-card balance">
          <div class="kpi-top">
            <span class="kpi-label">Margen Neto (Utilidad)</span>
            <span class="kpi-icon"><i data-lucide="piggy-bank"></i></span>
          </div>
          <div class="kpi-amount ${netBalance >= 0 ? 'text-success' : 'text-danger'}">$${netBalance.toLocaleString()}</div>
          <span class="kpi-foot neutral">Rentabilidad saludable</span>
        </div>

        <div class="finance-kpi-card pending">
          <div class="kpi-top">
            <span class="kpi-label">Cobros Pendientes</span>
            <span class="kpi-icon"><i data-lucide="clock"></i></span>
          </div>
          <div class="kpi-amount text-warning">$${pendingIncome.toLocaleString()}</div>
          <span class="kpi-foot warning">Por cobrar a clientes</span>
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
                  <th>Concepto / Descripción</th>
                  <th>Categoría</th>
                  <th>Entidad / Cliente</th>
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
                      ${t.type === 'ingreso' ? '+' : '-'}$${Number(t.amount).toLocaleString()}
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

        <!-- Columna Derecha: Presupuestos & Suscripciones -->
        <div class="finance-side-col">
          <!-- Presupuesto por Categoría -->
          <div class="finance-box-card">
            <h4><i data-lucide="pie-chart"></i> Presupuesto del Mes</h4>
            <div class="budget-bars-stack">
              ${budgetCategories.map(b => {
                const pct = Math.round((b.spent / b.allocated) * 100);
                return `
                  <div class="budget-item">
                    <div class="budget-item-top">
                      <span class="b-cat-name">${b.category}</span>
                      <span class="b-cat-numbers">$${b.spent} / $${b.allocated} (${pct}%)</span>
                    </div>
                    <div class="budget-track">
                      <div class="budget-fill ${pct > 90 ? 'danger' : ''}" style="width: ${Math.min(100, pct)}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Suscripciones de Software & Herramientas -->
          <div class="finance-box-card">
            <div class="box-header-sm">
              <h4><i data-lucide="refresh-cw"></i> Suscripciones Activas</h4>
              <span class="sub-total-badge">${subscriptions.length} activas</span>
            </div>
            <div class="subs-list">
              ${subscriptions.map(s => `
                <div class="sub-row-item">
                  <div>
                    <strong>${s.name}</strong>
                    <div class="sub-cycle-line">Renueva: ${s.nextRenewal} (${s.cycle})</div>
                  </div>
                  <div class="sub-price">$${s.amount}/mes</div>
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
    container.querySelectorAll('[data-trx-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterType = e.currentTarget.dataset.trxFilter;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    const btnNew = container.querySelector('#btn-new-trx-modal');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        window.plannerApp.openTransactionModal();
      });
    }
  }
}

window.financeModule = new FinanceModule();
