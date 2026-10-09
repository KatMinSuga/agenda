/**
 * Módulo de Gestión de Proyectos
 * Objetivos, división en entregables, presupuesto, fechas límite y avance visual.
 */

class ProjectsModule {
  constructor() {
    this.selectedProjectId = null;
  }

  render(container) {
    const projects = window.plannerStore.get('projects') || [];
    const clients = window.plannerStore.get('clients') || [];
    const team = window.plannerStore.get('team') || [];

    const activeProject = this.selectedProjectId 
      ? projects.find(p => p.id === this.selectedProjectId) || projects[0]
      : projects[0];

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="folder-kanban"></i> Módulo 03 · Proyectos & Objetivos</div>
          <h2 class="planner-page-title">Gestión de Proyectos & Entregables</h2>
          <p class="planner-page-desc">Monitorea hitos clave, presupuesto ejercido vs asignado y control estricto de entregables sin saturación mental.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn primary" id="btn-new-project-modal">
            <i data-lucide="plus"></i> Nuevo Proyecto
          </button>
        </div>
      </div>

      <div class="projects-layout-grid">
        <!-- Columna Izquierda: Tarjetas de Proyectos -->
        <div class="projects-sidebar-list">
          <h4 class="list-title"><i data-lucide="layers"></i> Proyectos en Curso (${projects.length})</h4>
          <div class="projects-cards-stack">
            ${projects.map(proj => {
              const isSelected = activeProject && activeProject.id === proj.id;
              const client = clients.find(c => c.id === proj.clientId);
              const deliverables = proj.deliverables || [];
              const doneDeliverables = deliverables.filter(d => d.completed).length;
              const calculatedProgress = deliverables.length 
                ? Math.round((doneDeliverables / deliverables.length) * 100) 
                : proj.progress;

              return `
                <div class="project-selector-card ${isSelected ? 'is-selected' : ''}" data-project-id="${proj.id}">
                  <div class="card-status-dot-row">
                    <span class="project-client-name">${client ? client.company : 'Proyecto Interno'}</span>
                    <span class="status-pill status-${proj.status}">${proj.status}</span>
                  </div>
                  <h4 class="proj-card-title">${proj.title}</h4>
                  
                  <div class="proj-mini-progress">
                    <div class="proj-mini-bar">
                      <div class="fill" style="width: ${calculatedProgress}%"></div>
                    </div>
                    <span class="pct-text">${calculatedProgress}%</span>
                  </div>

                  <div class="proj-card-footer">
                    <span><i data-lucide="calendar"></i> ${proj.deadline}</span>
                    <span><i data-lucide="check-circle-2"></i> ${doneDeliverables}/${deliverables.length} entregables</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Columna Derecha: Detalle Completo del Proyecto Activo -->
        <div class="project-detail-panel">
          ${activeProject ? this.renderProjectDetail(activeProject, clients, team) : `
            <div class="empty-state-card">
              <p>Selecciona un proyecto para ver sus detalles</p>
            </div>
          `}
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderProjectDetail(proj, clients, team) {
    const client = clients.find(c => c.id === proj.clientId);
    const manager = team.find(m => m.id === proj.managerId);
    const deliverables = proj.deliverables || [];
    const doneCount = deliverables.filter(d => d.completed).length;
    const progress = deliverables.length ? Math.round((doneCount / deliverables.length) * 100) : proj.progress;
    const budgetPct = proj.budget ? Math.round((proj.spent / proj.budget) * 100) : 0;

    return `
      <div class="project-dossier-paper">
        <div class="dossier-header">
          <div>
            <div class="dossier-category">${client ? client.company : 'Operaciones Propias'}</div>
            <h3 class="dossier-title">${proj.title}</h3>
            <p class="dossier-desc">${proj.description}</p>
          </div>
          <div class="dossier-badge-stack">
            <span class="big-progress-circle">${progress}%</span>
          </div>
        </div>

        <!-- Barra de Métricas del Proyecto -->
        <div class="dossier-kpi-grid">
          <div class="dossier-kpi-card">
            <span class="kpi-label"><i data-lucide="user"></i> Responsable</span>
            <span class="kpi-value">${manager ? manager.name : 'Carolina M.'}</span>
          </div>
          <div class="dossier-kpi-card">
            <span class="kpi-label"><i data-lucide="clock"></i> Fecha Límite</span>
            <span class="kpi-value">${proj.deadline}</span>
          </div>
          <div class="dossier-kpi-card">
            <span class="kpi-label"><i data-lucide="wallet"></i> Presupuesto Ejercido</span>
            <span class="kpi-value">$${proj.spent} / $${proj.budget}</span>
            <div class="mini-budget-track"><div class="fill" style="width: ${budgetPct}%"></div></div>
          </div>
        </div>

        <!-- Lista de Entregables / Hitos Clave -->
        <div class="dossier-section">
          <div class="section-title-bar">
            <h4><i data-lucide="flag"></i> Control de Entregables & Hitos (${doneCount}/${deliverables.length})</h4>
            <button class="action-btn-sm" id="btn-add-deliverable-modal" data-project-id="${proj.id}">
              <i data-lucide="plus"></i> Añadir Hito
            </button>
          </div>

          <div class="deliverables-checklist">
            ${deliverables.map(del => `
              <div class="deliverable-item ${del.completed ? 'is-done' : ''}" data-del-id="${del.id}">
                <label class="del-checkbox-label">
                  <input type="checkbox" ${del.completed ? 'checked' : ''} data-action="toggle-deliverable" data-project-id="${proj.id}" data-del-id="${del.id}">
                  <span class="del-title">${del.title}</span>
                </label>
                <div class="del-meta">
                  <span class="del-date"><i data-lucide="calendar"></i> ${del.dueDate}</span>
                  <span class="del-badge ${del.completed ? 'badge-done' : 'badge-pending'}">
                    ${del.completed ? 'Entregado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    // Selección de proyecto en lista
    container.querySelectorAll('.project-selector-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedProjectId = e.currentTarget.dataset.projectId;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // Toggle entregable
    container.querySelectorAll('[data-action="toggle-deliverable"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const projId = e.target.dataset.projectId;
        const delId = e.target.dataset.delId;
        const projects = window.plannerStore.get('projects') || [];
        const proj = projects.find(p => p.id === projId);
        if (proj && proj.deliverables) {
          const item = proj.deliverables.find(d => d.id === delId);
          if (item) {
            item.completed = e.target.checked;
            window.plannerStore.saveData();
            window.plannerAudio.playCheck();
            this.render(container);
          }
        }
      });
    });

    // Botón nuevo proyecto
    const btnNew = container.querySelector('#btn-new-project-modal');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        window.plannerApp.openProjectModal();
      });
    }

    // Botón añadir entregable
    const btnAddDel = container.querySelector('#btn-add-deliverable-modal');
    if (btnAddDel) {
      btnAddDel.addEventListener('click', (e) => {
        const projId = e.currentTarget.dataset.projectId;
        const title = prompt("Título del entregable / hito:");
        if (title && title.trim()) {
          const dueDate = prompt("Fecha límite (AAAA-MM-DD):", "2026-10-25");
          const projects = window.plannerStore.get('projects') || [];
          const proj = projects.find(p => p.id === projId);
          if (proj) {
            if (!proj.deliverables) proj.deliverables = [];
            proj.deliverables.push({
              id: 'del-' + Date.now(),
              title: title.trim(),
              completed: false,
              dueDate: dueDate || "2026-10-31"
            });
            window.plannerStore.saveData();
            this.render(container);
          }
        }
      });
    }
  }
}

window.projectsModule = new ProjectsModule();
