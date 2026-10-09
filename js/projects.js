/**
 * Módulo de Gestión de Proyectos
 * Objetivos, división en entregables/hitos, presupuesto, fechas límite y avance visual.
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
      <div id="projects-module-root" class="projects-module-root">
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
            <span class="kpi-value">${manager ? manager.name : 'Hermione Granger'}</span>
          </div>
          <div class="dossier-kpi-card">
            <span class="kpi-label"><i data-lucide="clock"></i> Fecha Límite</span>
            <span class="kpi-value">${proj.deadline}</span>
          </div>
          <div class="dossier-kpi-card">
            <span class="kpi-label"><i data-lucide="wallet"></i> Presupuesto Ejercido</span>
            <span class="kpi-value">${proj.spent} G / ${proj.budget} G</span>
            <div class="mini-budget-track"><div class="fill" style="width: ${budgetPct}%"></div></div>
          </div>
        </div>

        <!-- Lista de Entregables / Hitos Clave -->
        <div class="dossier-section">
          <div class="section-title-bar">
            <h4><i data-lucide="flag"></i> Control de Entregables & Hitos (${doneCount}/${deliverables.length})</h4>
            <button class="action-btn-xs primary" id="btn-add-deliverable-modal" data-project-id="${proj.id}">
              <i data-lucide="plus"></i> + Añadir Hito
            </button>
          </div>

          <div class="deliverables-checklist">
            ${deliverables.length === 0 ? `
              <div class="empty-state-card" style="padding: 16px;">
                <p>No hay hitos registrados en este proyecto. Pulsa "+ Añadir Hito" para registrar el primero.</p>
              </div>
            ` : deliverables.map(del => `
              <div class="deliverable-item ${del.completed ? 'is-done' : ''}" data-del-id="${del.id}">
                <label class="del-checkbox-label">
                  <input type="checkbox" ${del.completed ? 'checked' : ''} data-action="toggle-deliverable" data-project-id="${proj.id}" data-del-id="${del.id}">
                  <div class="del-text-group">
                    <span class="del-title">${del.title}</span>
                    ${del.description ? `<p class="del-desc-mini">${del.description}</p>` : ''}
                  </div>
                </label>
                <div class="del-meta">
                  <span class="del-date"><i data-lucide="calendar"></i> ${del.dueDate}</span>
                  <span class="del-badge ${del.completed ? 'badge-done' : (del.status === 'en_proceso' ? 'badge-process' : 'badge-pending')}">
                    ${del.completed ? 'Entregado' : (del.status === 'en_proceso' ? 'En Proceso' : 'Pendiente')}
                  </span>
                  <div class="del-actions">
                    <button class="icon-action-btn-xs" data-action="edit-deliverable" data-project-id="${proj.id}" data-del-id="${del.id}" title="Editar Hito">
                      <i data-lucide="pencil"></i>
                    </button>
                    <button class="icon-action-btn-xs delete" data-action="delete-deliverable" data-project-id="${proj.id}" data-del-id="${del.id}" title="Eliminar Hito">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const root = container.querySelector('#projects-module-root') || container;

    // Selección de proyecto en lista
    root.querySelectorAll('.project-selector-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedProjectId = e.currentTarget.dataset.projectId;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // Toggle entregable (independiente y reactivo)
    root.querySelectorAll('[data-action="toggle-deliverable"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const projId = e.target.dataset.projectId;
        const delId = e.target.dataset.delId;
        window.plannerStore.toggleDeliverable(projId, delId);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // Botón nuevo proyecto
    const btnNew = root.querySelector('#btn-new-project-modal');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        window.plannerApp.openProjectModal();
      });
    }

    // Botón "+ Añadir Hito" (Abre modal de hito)
    const btnAddDel = root.querySelector('#btn-add-deliverable-modal');
    if (btnAddDel) {
      btnAddDel.addEventListener('click', (e) => {
        const projId = e.currentTarget.dataset.projectId;
        this.openDeliverableModal(projId);
      });
    }

    // Botón Editar Hito
    root.querySelectorAll('[data-action="edit-deliverable"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.dataset.projectId;
        const delId = e.currentTarget.dataset.delId;
        const projects = window.plannerStore.get('projects') || [];
        const proj = projects.find(p => p.id === projId);
        if (proj && proj.deliverables) {
          const deliverable = proj.deliverables.find(d => d.id === delId);
          if (deliverable) {
            this.openDeliverableModal(projId, deliverable);
          }
        }
      });
    });

    // Botón Eliminar Hito
    root.querySelectorAll('[data-action="delete-deliverable"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.dataset.projectId;
        const delId = e.currentTarget.dataset.delId;
        if (confirm('¿Eliminar este hito del proyecto?')) {
          window.plannerStore.deleteDeliverable(projId, delId);
          window.plannerAudio.playCheck();
          this.render(container);
        }
      });
    });
  }

  // Modal Menú de Hito / Entregable
  openDeliverableModal(projectId, deliverable = null) {
    const modal = document.getElementById('deliverable-editor-modal');
    if (!modal) return;

    const projects = window.plannerStore.get('projects') || [];
    const team = window.plannerStore.get('team') || [];

    const projectSelect = document.getElementById('modal-del-project');
    const assigneeSelect = document.getElementById('modal-del-assignee');
    const headerTitle = document.getElementById('modal-del-header-title');
    const idInput = document.getElementById('modal-del-id');
    const titleInput = document.getElementById('modal-del-title');
    const descInput = document.getElementById('modal-del-desc');
    const dateInput = document.getElementById('modal-del-date');
    const statusSelect = document.getElementById('modal-del-status');
    const prioritySelect = document.getElementById('modal-del-priority');

    // Llenar proyectos
    if (projectSelect) {
      projectSelect.innerHTML = projects.map(p => `
        <option value="${p.id}" ${p.id === projectId ? 'selected' : ''}>${p.title}</option>
      `).join('');
    }

    // Llenar responsables del equipo
    if (assigneeSelect) {
      assigneeSelect.innerHTML = team.map(m => `
        <option value="${m.id}">${m.name} (${m.role})</option>
      `).join('');
    }

    if (deliverable) {
      if (headerTitle) headerTitle.textContent = 'Editar Hito / Entregable';
      if (idInput) idInput.value = deliverable.id;
      if (titleInput) titleInput.value = deliverable.title || '';
      if (descInput) descInput.value = deliverable.description || '';
      if (dateInput) dateInput.value = deliverable.dueDate || new Date().toISOString().split('T')[0];
      if (statusSelect) statusSelect.value = deliverable.completed ? 'completado' : (deliverable.status || 'pendiente');
      if (prioritySelect) prioritySelect.value = deliverable.priority || 'alta';
      if (assigneeSelect && deliverable.assigneeId) assigneeSelect.value = deliverable.assigneeId;
    } else {
      if (headerTitle) headerTitle.textContent = 'Nuevo Hito / Entregable de Proyecto';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (descInput) descInput.value = '';
      if (dateInput) {
        const activeProj = projects.find(p => p.id === projectId);
        dateInput.value = activeProj ? activeProj.deadline : new Date().toISOString().split('T')[0];
      }
      if (statusSelect) statusSelect.value = 'pendiente';
      if (prioritySelect) prioritySelect.value = 'alta';
    }

    modal.classList.add('open');
    if (titleInput) setTimeout(() => titleInput.focus(), 80);
    if (window.lucide) window.lucide.createIcons();
  }
}

window.projectsModule = new ProjectsModule();
