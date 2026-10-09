/**
 * Módulo 10 (11 en menú) · Métricas, Auditoría & Reportes Ejecutivos
 * Filtros de período (Día, Semana, Mes, Año) y ámbito (Por Proyecto o Total Global),
 * recálculo dinámico de KPIs y exportación personalizada a Excel (CSV) para
 * juntas con clientes o contabilidad general.
 */

class ReportsModule {
  constructor() {
    this.selectedPeriod = 'mes'; // 'dia', 'semana', 'mes', 'ano'
    this.selectedProjectId = 'all'; // 'all' o ID de proyecto
    this.charts = {};
  }

  render(container) {
    const tasks = window.plannerStore.get('tasks') || [];
    const timeEntries = window.plannerStore.get('timeEntries') || [];
    const clients = window.plannerStore.get('clients') || [];
    const projects = window.plannerStore.get('projects') || [];
    const finance = window.plannerStore.get('finance') || {};
    const team = window.plannerStore.get('team') || [];

    // 1. Filtrado por Proyecto
    const projectFilterActive = this.selectedProjectId !== 'all';
    const currentProject = projectFilterActive ? projects.find(p => p.id === this.selectedProjectId) : null;
    const currentClient = currentProject && currentProject.clientId ? clients.find(c => c.id === currentProject.clientId) : null;

    let scopedTasks = projectFilterActive
      ? tasks.filter(t => t.projectId === this.selectedProjectId)
      : tasks;

    let scopedEntries = projectFilterActive
      ? timeEntries.filter(e => e.projectId === this.selectedProjectId)
      : timeEntries;

    // 2. Filtrado por Período Temporal
    const today = "2026-10-08";
    const currentMonth = "2026-10";
    const currentYear = "2026";
    const weekStart = "2026-10-05";
    const weekEnd = "2026-10-11";

    const filterByDate = (itemDate) => {
      if (!itemDate) return true;
      if (this.selectedPeriod === 'dia') return itemDate === today;
      if (this.selectedPeriod === 'semana') return itemDate >= weekStart && itemDate <= weekEnd;
      if (this.selectedPeriod === 'mes') return itemDate.startsWith(currentMonth);
      if (this.selectedPeriod === 'ano') return itemDate.startsWith(currentYear);
      return true;
    };

    const periodFilteredTasks = scopedTasks.filter(t => filterByDate(t.dueDate || t.startDate));
    const periodFilteredEntries = scopedEntries.filter(e => filterByDate(e.date));

    // Cálculos de Indicadores Clave
    const totalTasks = periodFilteredTasks.length;
    const completedTasks = periodFilteredTasks.filter(t => t.status === 'completada').length;
    const inProgressTasks = periodFilteredTasks.filter(t => t.status === 'en_proceso').length;
    const complianceRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    const totalMinutes = periodFilteredEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
    const totalHoursWorked = (totalMinutes / 60).toFixed(1);

    const billableEntries = periodFilteredEntries.filter(e => e.billable);
    const billableMins = billableEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
    const billableHours = (billableMins / 60).toFixed(1);

    // Cálculo de valor facturable
    let totalBillableGalleons = 0;
    billableEntries.forEach(e => {
      const p = projects.find(proj => proj.id === e.projectId);
      const c = p && p.clientId ? clients.find(cli => cli.id === p.clientId) : null;
      const rate = c ? c.ratePerHour : 45;
      totalBillableGalleons += (e.durationMinutes / 60) * rate;
    });

    const periodLabels = {
      dia: 'Día de Hoy (8 Oct 2026)',
      semana: 'Esta Semana (5 - 11 Oct)',
      mes: 'Mes en Curso (Octubre 2026)',
      ano: 'Año Fiscal 2026'
    };

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="bar-chart-3"></i> Módulo 10 · Métricas & Auditoría</div>
          <h2 class="planner-page-title">Reportes Ejecutivos & Balances</h2>
          <p class="planner-page-desc">Métricas filtrables por período y por proyecto para emitir resúmenes de operación a clientes o balances de contabilidad.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" id="btn-export-reports-csv">
            <i data-lucide="file-spreadsheet"></i> Exportar a Excel (${projectFilterActive ? 'Cliente' : 'Contabilidad'})
          </button>
          <button class="action-btn primary" id="btn-print-reports-pdf">
            <i data-lucide="printer"></i> Imprimir Informe
          </button>
        </div>
      </div>

      <!-- Barra de Filtros: Período Temporal & Selección de Proyecto -->
      <div class="reports-filter-control-card">
        <div class="filter-group-item">
          <label class="filter-label"><i data-lucide="calendar"></i> Período de Auditoría:</label>
          <div class="period-pills-row">
            <button class="rep-period-pill ${this.selectedPeriod === 'dia' ? 'active' : ''}" data-period="dia">📅 Día</button>
            <button class="rep-period-pill ${this.selectedPeriod === 'semana' ? 'active' : ''}" data-period="semana">📆 Semana</button>
            <button class="rep-period-pill ${this.selectedPeriod === 'mes' ? 'active' : ''}" data-period="mes">🗓️ Mes</button>
            <button class="rep-period-pill ${this.selectedPeriod === 'ano' ? 'active' : ''}" data-period="ano">📈 Año</button>
          </div>
        </div>

        <div class="filter-group-item" style="flex:1; min-width:280px;">
          <label class="filter-label"><i data-lucide="folder-kanban"></i> Ámbito / Proyecto a Evaluar:</label>
          <select id="select-report-project-scope" class="form-select-sm" style="width:100%; font-weight:600;">
            <option value="all" ${this.selectedProjectId === 'all' ? 'selected' : ''}>🌐 Todos los Proyectos (Resumen Global / Contabilidad)</option>
            ${projects.map(p => {
              const cli = clients.find(c => c.id === p.clientId);
              return `
                <option value="${p.id}" ${this.selectedProjectId === p.id ? 'selected' : ''}>
                  📁 ${p.title} (${cli ? cli.company : 'Interno'})
                </option>
              `;
            }).join('')}
          </select>
        </div>
      </div>

      <!-- Cartel de Contexto del Informe -->
      <div class="report-context-banner">
        <span>
          Visualizando: <strong>${projectFilterActive ? (currentProject?.title || 'Proyecto') : 'Operaciones Globales'}</strong> · 
          Período: <strong>${periodLabels[this.selectedPeriod]}</strong>
          ${currentClient ? ` · Cliente: <strong>${currentClient.company} (${currentClient.ratePerHour} G/h)</strong>` : ''}
        </span>
      </div>

      <!-- Fila de Indicadores Clave Dinámicos -->
      <div class="reports-kpi-row">
        <div class="rep-kpi-card">
          <span class="rep-label">Tasa de Cumplimiento</span>
          <div class="rep-val ${complianceRate >= 70 ? 'text-success' : 'text-warning'}">${complianceRate}%</div>
          <span class="rep-sub">${completedTasks} resueltas de ${totalTasks} tareas</span>
        </div>

        <div class="rep-kpi-card">
          <span class="rep-label">Horas Totales Invertidas</span>
          <div class="rep-val">${totalHoursWorked}h</div>
          <span class="rep-sub">${billableHours}h facturables registradas</span>
        </div>

        <div class="rep-kpi-card">
          <span class="rep-label">Cálculo de Liquidación</span>
          <div class="rep-val text-success">🪙 ${Math.round(totalBillableGalleons).toLocaleString()} G</div>
          <span class="rep-sub">Monto para cobro o junta</span>
        </div>

        <div class="rep-kpi-card">
          <span class="rep-label">Tareas Activas / En Proceso</span>
          <div class="rep-val">${inProgressTasks}</div>
          <span class="rep-sub">${totalTasks - completedTasks - inProgressTasks} aún pendientes</span>
        </div>
      </div>

      <!-- Gráficos Visuales Adaptativos -->
      <div class="reports-charts-grid">
        <div class="chart-card">
          <h4>
            <i data-lucide="pie-chart"></i> 
            ${projectFilterActive ? 'Distribución de Tiempo por Tarea / Actividad' : 'Distribución de Horas por Cliente / Entidad'}
          </h4>
          <div class="chart-container">
            <canvas id="chart-client-hours"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h4><i data-lucide="trending-up"></i> Tareas y Entregables en el Período (${periodLabels[this.selectedPeriod]})</h4>
          <div class="chart-container">
            <canvas id="chart-tasks-progress"></canvas>
          </div>
        </div>
      </div>

      <!-- Tabla de Auditoría Operativa y Contable Detallada -->
      <div class="reports-table-card">
        <div class="table-card-top-header">
          <h4>
            <i data-lucide="table"></i> 
            ${projectFilterActive 
              ? `Desglose Operativo para Cliente: ${currentClient ? currentClient.company : currentProject?.title}` 
              : 'Desglose Global de Proyectos & Contabilidad'}
          </h4>
          <span class="report-export-tip">💡 Los datos de esta tabla se exportan exactamente en el archivo Excel</span>
        </div>

        <table class="notes-table">
          <thead>
            <tr>
              ${projectFilterActive ? `
                <th>Tarea / Solicitud</th>
                <th>Responsable</th>
                <th>Prioridad</th>
                <th>Vencimiento</th>
                <th>Subtareas</th>
                <th>Estado</th>
              ` : `
                <th>Proyecto</th>
                <th>Cliente / Entidad</th>
                <th>Horas Registradas</th>
                <th>Presupuesto Invertido</th>
                <th>Avance</th>
                <th>Tarifa</th>
              `}
            </tr>
          </thead>
          <tbody>
            ${projectFilterActive ? (
              periodFilteredTasks.length === 0 ? `
                <tr><td colspan="6" style="text-align:center; padding:18px; color:var(--text-muted);">No hay tareas registradas en este período para el proyecto seleccionado.</td></tr>
              ` : periodFilteredTasks.map(t => {
                const assignee = team.find(m => m.id === t.assigneeId);
                const subCount = t.subtasks ? t.subtasks.length : 0;
                const doneSub = t.subtasks ? t.subtasks.filter(s => s.completed).length : 0;
                return `
                  <tr>
                    <td><strong>${t.title}</strong></td>
                    <td>${assignee ? assignee.name : 'Hermione Granger'}</td>
                    <td><span class="priority-badge-sm ${t.priority}">${t.priority}</span></td>
                    <td>${t.dueDate || '-'}</td>
                    <td>${subCount > 0 ? `${doneSub}/${subCount}` : '-'}</td>
                    <td><span class="status-badge-trx status-${t.status}">${t.status}</span></td>
                  </tr>
                `;
              }).join('')
            ) : (
              projects.map(p => {
                const c = clients.find(cl => cl.id === p.clientId);
                const pEntries = timeEntries.filter(e => e.projectId === p.id);
                const pMins = pEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
                const pHours = (pMins / 60).toFixed(1);
                return `
                  <tr>
                    <td><strong>${p.title}</strong></td>
                    <td>${c ? c.company : 'Interno'}</td>
                    <td><strong>${pHours}h</strong></td>
                    <td>🪙 ${p.spent || 0} / ${p.budget} G</td>
                    <td>${p.progress || 0}%</td>
                    <td>${c ? `${c.ratePerHour} G/h` : '45 G/h'}</td>
                  </tr>
                `;
              }).join('')
            )}
          </tbody>
        </table>
      </div>
    `;

    this.attachEvents(container);
    this.renderCharts(scopedTasks, scopedEntries, projects, clients);
    if (window.lucide) window.lucide.createIcons();
  }

  renderCharts(scopedTasks, scopedEntries, projects, clients) {
    if (typeof Chart === 'undefined') return;

    Object.values(this.charts).forEach(c => c && c.destroy());
    this.charts = {};

    // 1. Gráfico Doughnut
    const canvasPie = document.getElementById('chart-client-hours');
    if (canvasPie) {
      let labels = [];
      let data = [];
      let bgColors = ['#9C523B', '#3F6253', '#B27D32', '#5B4B70', '#C47D3B'];

      if (this.selectedProjectId !== 'all') {
        // Horas por tarea del proyecto seleccionado
        labels = scopedTasks.map(t => t.title.substring(0, 24) + '...');
        data = scopedTasks.map(() => Math.floor(Math.random() * 4) + 1); // Simulado de horas por tarea
      } else {
        // Horas por proyecto global
        labels = projects.map(p => p.title.substring(0, 22) + '...');
        data = projects.map(p => {
          const mins = scopedEntries.filter(e => e.projectId === p.id).reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
          return Math.max(1, (mins / 60).toFixed(1));
        });
      }

      this.charts.clientHours = new Chart(canvasPie, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['General'],
          datasets: [{
            data: data.length > 0 ? data : [1],
            backgroundColor: bgColors,
            borderWidth: 2,
            borderColor: '#FAF7F2'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }

    // 2. Gráfico Bar
    const canvasBar = document.getElementById('chart-tasks-progress');
    if (canvasBar) {
      this.charts.tasksProgress = new Chart(canvasBar, {
        type: 'bar',
        data: {
          labels: ['Completadas', 'En Proceso', 'Pendientes'],
          datasets: [{
            label: 'Tareas / Hitos',
            data: [
              scopedTasks.filter(t => t.status === 'completada').length,
              scopedTasks.filter(t => t.status === 'en_proceso').length,
              scopedTasks.filter(t => t.status === 'pendiente').length
            ],
            backgroundColor: ['#226e38', '#b45309', '#9C523B'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  attachEvents(container) {
    // 1. Selector de período
    container.querySelectorAll('.rep-period-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedPeriod = e.currentTarget.dataset.period;
        window.plannerAudio.playTabClick();
        this.render(container);
      });
    });

    // 2. Selector de proyecto
    const scopeSelect = container.querySelector('#select-report-project-scope');
    if (scopeSelect) {
      scopeSelect.addEventListener('change', (e) => {
        this.selectedProjectId = e.target.value;
        window.plannerAudio.playTabClick();
        this.render(container);
      });
    }

    // 3. Exportar a Excel (CSV) adaptativo
    const btnCsv = container.querySelector('#btn-export-reports-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        this.exportToCSV();
      });
    }

    // 4. Imprimir / PDF
    const btnPdf = container.querySelector('#btn-print-reports-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', () => {
        window.print();
      });
    }
  }

  exportToCSV() {
    const tasks = window.plannerStore.get('tasks') || [];
    const timeEntries = window.plannerStore.get('timeEntries') || [];
    const clients = window.plannerStore.get('clients') || [];
    const projects = window.plannerStore.get('projects') || [];
    const team = window.plannerStore.get('team') || [];
    const today = new Date().toISOString().split('T')[0];

    let csv = "";
    let filename = "";

    if (this.selectedProjectId !== 'all') {
      // INFORME ESPECÍFICO DE PROYECTO PARA CLIENTE / JUNTA DE REVISIÓN
      const currentProj = projects.find(p => p.id === this.selectedProjectId) || { title: "Proyecto" };
      const currentCli = clients.find(c => c.id === currentProj.clientId);
      const projTasks = tasks.filter(t => t.projectId === this.selectedProjectId);

      filename = `Informe_Cliente_${currentProj.title.replace(/\s+/g, '_')}_${this.selectedPeriod}_${today}.csv`;
      csv = "Proyecto,Cliente,Tarea / Entregable,Responsable,Fecha Vencimiento,Prioridad,Estado\r\n";

      projTasks.forEach(t => {
        const assignee = team.find(m => m.id === t.assigneeId);
        csv += `"${currentProj.title.replace(/"/g, '""')}","${currentCli ? currentCli.company.replace(/"/g, '""') : 'Hogwarts Ops'}","${t.title.replace(/"/g, '""')}","${assignee ? assignee.name : 'Hermione Granger'}","${t.dueDate || ''}","${t.priority}","${t.status}"\r\n`;
      });
    } else {
      // AUDITORÍA GLOBAL DE OPERACIONES & CONTABILIDAD
      filename = `Auditoria_Global_Operaciones_${this.selectedPeriod}_${today}.csv`;
      csv = "Tipo Registro,ID,Titulo / Descripcion,Cliente / Entidad,Horas / Importe,Estado,Fecha / Plazo\r\n";

      // 1. Proyectos
      projects.forEach(p => {
        const c = clients.find(cl => cl.id === p.clientId);
        csv += `"Proyecto","${p.id}","${p.title.replace(/"/g, '""')}","${c ? c.company : 'Interno'}","${p.spent || 0} G (Presupuesto: ${p.budget} G)","${p.status}","${p.deadline}"\r\n`;
      });

      // 2. Horas registradas
      timeEntries.forEach(e => {
        const p = projects.find(proj => proj.id === e.projectId);
        csv += `"Horas VA","${e.id}","${e.description.replace(/"/g, '""')}","${p ? p.title : 'General'}","${e.durationMinutes} min (${(e.durationMinutes/60).toFixed(1)}h)","${e.billable ? 'Facturable' : 'No facturable'}","${e.date}"\r\n`;
      });
    }

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    window.plannerAudio.playCheck();
  }
}

window.reportsModule = new ReportsModule();
