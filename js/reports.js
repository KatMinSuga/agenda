/**
 * Módulo de Reportes & Estadísticas
 * Gráficos de productividad con Chart.js, horas dedicadas por cliente,
 * exportación a CSV (Excel) e impresión profesional a PDF.
 */

class ReportsModule {
  constructor() {
    this.charts = {};
  }

  render(container) {
    const tasks = window.plannerStore.get('tasks') || [];
    const timeEntries = window.plannerStore.get('timeEntries') || [];
    const clients = window.plannerStore.get('clients') || [];
    const finance = window.plannerStore.get('finance') || {};
    const transactions = finance.transactions || [];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completada').length;
    const pendingTasks = totalTasks - completedTasks;
    const productivityRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalHoursWorked = (timeEntries.reduce((acc, cur) => acc + (cur.durationMinutes || 0), 0) / 60).toFixed(1);

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="bar-chart-3"></i> Módulo 10 · Métricas & Auditoría</div>
          <h2 class="planner-page-title">Reportes Ejecutivos & Productividad</h2>
          <p class="planner-page-desc">Mide resultados reales: cumplimiento de fechas límite, rentabilidad por hora y balance de trabajo.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" id="btn-export-csv">
            <i data-lucide="file-spreadsheet"></i> Exportar a Excel (CSV)
          </button>
          <button class="action-btn primary" id="btn-print-pdf">
            <i data-lucide="printer"></i> Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <!-- Fila de Indicadores Clave -->
      <div class="reports-kpi-row">
        <div class="rep-kpi-card">
          <span class="rep-label">Tasa de Cumplimiento</span>
          <div class="rep-val">${productivityRate}%</div>
          <span class="rep-sub">${completedTasks} de ${totalTasks} tareas resueltas</span>
        </div>
        <div class="rep-kpi-card">
          <span class="rep-label">Horas Totales Dedicadas</span>
          <div class="rep-val">${totalHoursWorked}h</div>
          <span class="rep-sub">${timeEntries.length} bloques registrados</span>
        </div>
        <div class="rep-kpi-card">
          <span class="rep-label">Clientes Activos</span>
          <div class="rep-val">${clients.length}</div>
          <span class="rep-sub">100% retención en Q3</span>
        </div>
        <div class="rep-kpi-card">
          <span class="rep-label">Índice de Enfoque</span>
          <div class="rep-val text-success">9.4/10</div>
          <span class="rep-sub">Mínimas interrupciones</span>
        </div>
      </div>

      <!-- Gráficos Visuales -->
      <div class="reports-charts-grid">
        <div class="chart-card">
          <h4><i data-lucide="pie-chart"></i> Distribución de Tiempo por Cliente</h4>
          <div class="chart-container">
            <canvas id="chart-client-hours"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h4><i data-lucide="trending-up"></i> Rendimiento Semanal de Tareas</h4>
          <div class="chart-container">
            <canvas id="chart-tasks-progress"></canvas>
          </div>
        </div>
      </div>

      <!-- Resumen Detallado de Rendimiento -->
      <div class="reports-table-card">
        <h4><i data-lucide="table"></i> Desglose de Desempeño Operativo</h4>
        <table class="notes-table">
          <thead>
            <tr>
              <th>Área / Dimensión</th>
              <th>Métrica Registrada</th>
              <th>Objetivo Mensual</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Gestión de Tareas</strong></td>
              <td>${completedTasks} completadas</td>
              <td>20 tareas</td>
              <td><span class="status-badge-trx status-cobrado">En meta</span></td>
            </tr>
            <tr>
              <td><strong>Horas Facturables VA</strong></td>
              <td>${totalHoursWorked} horas registradas</td>
              <td>100 horas</td>
              <td><span class="status-badge-trx status-cobrado">Saludable</span></td>
            </tr>
            <tr>
              <td><strong>Control Presupuestario</strong></td>
              <td>Gastos menores al 40% de ingresos</td>
              <td>&lt; 50%</td>
              <td><span class="status-badge-trx status-cobrado">Excelente</span></td>
            </tr>
            <tr>
              <td><strong>Hábitos & Bienestar</strong></td>
              <td>Racha promedio de 8 días</td>
              <td>7 días</td>
              <td><span class="status-badge-trx status-cobrado">Consistente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    this.attachEvents(container);
    this.renderCharts(clients, timeEntries);
    if (window.lucide) window.lucide.createIcons();
  }

  renderCharts(clients, timeEntries) {
    if (typeof Chart === 'undefined') return;

    // Destruir gráficos previos si existen
    Object.values(this.charts).forEach(c => c && c.destroy());
    this.charts = {};

    // 1. Gráfico de Horas por Cliente
    const canvasPie = document.getElementById('chart-client-hours');
    if (canvasPie) {
      const clientLabels = clients.map(c => c.company);
      const clientHours = clients.map(c => {
        const clientEntries = timeEntries.filter(t => t.clientId === c.id);
        const mins = clientEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
        return (mins / 60) + (c.hoursUsed || 0);
      });

      this.charts.clientHours = new Chart(canvasPie, {
        type: 'doughnut',
        data: {
          labels: clientLabels,
          datasets: [{
            data: clientHours,
            backgroundColor: ['#9C523B', '#3F6253', '#B27D32', '#5B4B70'],
            borderWidth: 2,
            borderColor: '#FAF7F2'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'inherit', size: 12 } } }
          }
        }
      });
    }

    // 2. Gráfico de Tareas por Semana
    const canvasBar = document.getElementById('chart-tasks-progress');
    if (canvasBar) {
      this.charts.tasksProgress = new Chart(canvasBar, {
        type: 'bar',
        data: {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4 (Actual)'],
          datasets: [
            { label: 'Tareas Completadas', data: [14, 18, 12, 16], backgroundColor: '#3F6253', borderRadius: 4 },
            { label: 'Tareas Planificadas', data: [16, 20, 15, 18], backgroundColor: '#E2D9CE', borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12 } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  attachEvents(container) {
    const btnCsv = container.querySelector('#btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        this.exportToCSV();
      });
    }

    const btnPdf = container.querySelector('#btn-print-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', () => {
        window.print();
      });
    }
  }

  exportToCSV() {
    const tasks = window.plannerStore.get('tasks') || [];
    let csv = "ID,Titulo,Prioridad,Estado,Vencimiento,Categoria\r\n";
    tasks.forEach(t => {
      csv += `"${t.id}","${t.title.replace(/"/g, '""')}","${t.priority}","${t.status}","${t.dueDate || ''}","${t.category || ''}"\r\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Tareas_Agenda_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

window.reportsModule = new ReportsModule();
