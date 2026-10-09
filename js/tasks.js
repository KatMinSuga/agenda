/**
 * Módulo de Tareas - Gestión completa con Vistas Lista y Kanban,
 * subtareas, prioridades, estados y filtros rápidos.
 */

class TasksModule {
  constructor() {
    this.currentView = 'list'; // 'list' o 'kanban'
    this.filterPriority = 'all';
    this.filterStatus = 'all';
    this.searchQuery = '';
  }

  render(container) {
    const tasks = window.plannerStore.get('tasks') || [];
    const team = window.plannerStore.get('team') || [];
    const projects = window.plannerStore.get('projects') || [];

    // Filtrar tareas
    const filteredTasks = tasks.filter(t => {
      if (this.filterPriority !== 'all' && t.priority !== this.filterPriority) return false;
      if (this.filterStatus !== 'all' && t.status !== this.filterStatus) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = (t.description || '').toLowerCase().includes(q);
        const matchCat = (t.category || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      return true;
    });

    const completedCount = tasks.filter(t => t.status === 'completada').length;
    const totalCount = tasks.length;
    const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="check-square"></i> Módulo 01 · Tareas & Entregables</div>
          <h2 class="planner-page-title">Gestión de Tareas & Flujo de Trabajo</h2>
          <p class="planner-page-desc">Optimiza tu tiempo sin distracciones: divide en subtareas, prioriza según la regla 80/20 y gestiona el estado en lista o tablero Kanban.</p>
        </div>
        <div class="header-actions">
          <div class="view-toggle-group">
            <button class="view-toggle-btn ${this.currentView === 'list' ? 'active' : ''}" id="btn-tasks-view-list">
              <i data-lucide="list"></i> Lista
            </button>
            <button class="view-toggle-btn ${this.currentView === 'kanban' ? 'active' : ''}" id="btn-tasks-view-kanban">
              <i data-lucide="layout-grid"></i> Kanban
            </button>
          </div>
          <button class="action-btn primary" id="btn-add-task-modal">
            <i data-lucide="plus"></i> Nueva Tarea
          </button>
        </div>
      </div>

      <!-- Barra de métricas y filtros rápidos -->
      <div class="tasks-toolbar">
        <div class="tasks-summary-bar">
          <div class="summary-chip">
            <span class="chip-num">${totalCount}</span>
            <span class="chip-label">Total Tareas</span>
          </div>
          <div class="summary-chip urgent">
            <span class="chip-num">${tasks.filter(t => t.priority === 'urgente' && t.status !== 'completada').length}</span>
            <span class="chip-label">Urgentes Hoy</span>
          </div>
          <div class="summary-chip success">
            <span class="chip-num">${completedCount}</span>
            <span class="chip-label">Completadas</span>
          </div>
          <div class="progress-mini-bar">
            <div class="progress-labels">
              <span>Progreso Global</span>
              <span><strong>${progressPct}%</strong></span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${progressPct}%"></div></div>
          </div>
        </div>

        <div class="filters-row">
          <div class="search-input-wrapper">
            <i data-lucide="search"></i>
            <input type="text" id="tasks-search-input" placeholder="Buscar tarea, etiqueta o cliente..." value="${this.searchQuery}">
          </div>

          <div class="filter-dropdowns">
            <select id="filter-task-priority" class="form-select-sm">
              <option value="all" ${this.filterPriority === 'all' ? 'selected' : ''}>Todas las Prioridades</option>
              <option value="urgente" ${this.filterPriority === 'urgente' ? 'selected' : ''}>🔴 Urgente</option>
              <option value="alta" ${this.filterPriority === 'alta' ? 'selected' : ''}>🟠 Alta</option>
              <option value="media" ${this.filterPriority === 'media' ? 'selected' : ''}>🟡 Media</option>
              <option value="baja" ${this.filterPriority === 'baja' ? 'selected' : ''}>🟢 Baja</option>
            </select>

            <select id="filter-task-status" class="form-select-sm">
              <option value="all" ${this.filterStatus === 'all' ? 'selected' : ''}>Todos los Estados</option>
              <option value="pendiente" ${this.filterStatus === 'pendiente' ? 'selected' : ''}>Pendientes</option>
              <option value="en_proceso" ${this.filterStatus === 'en_proceso' ? 'selected' : ''}>En Proceso</option>
              <option value="completada" ${this.filterStatus === 'completada' ? 'selected' : ''}>Completadas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contenedor dinámico según vista seleccionada -->
      <div id="tasks-content-wrapper">
        ${this.currentView === 'list' 
          ? this.renderListView(filteredTasks, team, projects) 
          : this.renderKanbanView(filteredTasks, team, projects)}
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderListView(tasks, team, projects) {
    if (tasks.length === 0) {
      return `
        <div class="empty-state-card">
          <div class="empty-icon"><i data-lucide="inbox"></i></div>
          <h3>No hay tareas con estos filtros</h3>
          <p>Crea una nueva tarea o relaja los criterios de búsqueda para comenzar.</p>
        </div>
      `;
    }

    return `
      <div class="tasks-list-container">
        ${tasks.map(task => {
          const assignee = team.find(m => m.id === task.assigneeId);
          const project = projects.find(p => p.id === task.projectId);
          const subtasks = task.subtasks || [];
          const subtasksCompleted = subtasks.filter(s => s.completed).length;

          return `
            <div class="task-card-notes ${task.status === 'completada' ? 'is-completed' : ''} priority-${task.priority}" data-task-id="${task.id}">
              <div class="task-card-left">
                <button class="task-check-circle ${task.status === 'completada' ? 'checked' : ''}" data-action="toggle-complete" data-task-id="${task.id}" title="Marcar completada">
                  <i data-lucide="${task.status === 'completada' ? 'check' : 'circle'}"></i>
                </button>
              </div>

              <div class="task-card-body">
                <div class="task-main-row">
                  <div class="task-title-group">
                    <span class="task-title">${task.title}</span>
                    ${task.recurrent ? `<span class="recurrent-badge" title="Recurrencia: ${task.recurrent}"><i data-lucide="repeat"></i> ${task.recurrent}</span>` : ''}
                  </div>
                  <div class="task-badges">
                    <span class="priority-tag tag-${task.priority}">${task.priority.toUpperCase()}</span>
                    <span class="status-tag status-${task.status}">${task.status.replace('_', ' ')}</span>
                  </div>
                </div>

                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}

                <div class="task-meta-row">
                  <div class="meta-item">
                    <i data-lucide="calendar"></i>
                    <span>${task.dueDate ? `Vence: ${task.dueDate}` : 'Sin fecha'}</span>
                  </div>
                  ${task.startTime ? `
                    <div class="meta-item">
                      <i data-lucide="clock"></i>
                      <span>${task.startTime} - ${task.endTime || 'fin'}</span>
                    </div>
                  ` : ''}
                  ${project ? `
                    <div class="meta-item project-pill" title="Proyecto vinculado">
                      <i data-lucide="folder-kanban"></i>
                      <span>${project.title.substring(0, 24)}...</span>
                    </div>
                  ` : ''}
                  ${assignee ? `
                    <div class="meta-item assignee-pill" title="Responsable: ${assignee.name}">
                      <span class="avatar-dot" style="background: ${assignee.avatarColor || '#666'}">${assignee.name.charAt(0)}</span>
                      <span>${assignee.name}</span>
                    </div>
                  ` : ''}
                  ${task.category ? `
                    <div class="meta-item category-badge">
                      <i data-lucide="tag"></i>
                      <span>${task.category}</span>
                    </div>
                  ` : ''}
                </div>

                <!-- Subtareas / Lista de verificación -->
                ${subtasks.length > 0 ? `
                  <div class="subtasks-container">
                    <div class="subtasks-header" data-action="toggle-subtasks-view">
                      <span class="subtasks-count">
                        <i data-lucide="list-checks"></i> Subtareas (${subtasksCompleted}/${subtasks.length})
                      </span>
                      <div class="subtasks-bar-track">
                        <div class="subtasks-bar-fill" style="width: ${(subtasksCompleted / subtasks.length) * 100}%"></div>
                      </div>
                    </div>
                    <div class="subtasks-checklist">
                      ${subtasks.map(sub => `
                        <label class="subtask-checkbox-item ${sub.completed ? 'completed' : ''}">
                          <input type="checkbox" ${sub.completed ? 'checked' : ''} data-action="toggle-subtask" data-task-id="${task.id}" data-subtask-id="${sub.id}">
                          <span class="subtask-label">${sub.title}</span>
                        </label>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <div class="task-card-actions">
                <button class="icon-action-btn" data-action="edit-task" data-task-id="${task.id}" title="Editar tarea">
                  <i data-lucide="pencil"></i>
                </button>
                <button class="icon-action-btn delete" data-action="delete-task" data-task-id="${task.id}" title="Eliminar tarea">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderKanbanView(tasks, team, projects) {
    const columns = [
      { id: 'pendiente', title: 'Pendientes', color: '#B27D32', icon: 'clock' },
      { id: 'en_proceso', title: 'En Proceso', color: '#2B6CB0', icon: 'play' },
      { id: 'completada', title: 'Completadas', color: '#2F855A', icon: 'check-circle' }
    ];

    return `
      <div class="kanban-board-grid">
        ${columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return `
            <div class="kanban-column" data-status="${col.id}">
              <div class="kanban-column-header">
                <div class="column-title-wrap">
                  <span class="column-dot" style="background: ${col.color}"></span>
                  <h4>${col.title}</h4>
                </div>
                <span class="kanban-badge">${colTasks.length}</span>
              </div>
              
              <div class="kanban-cards-stack" data-column-status="${col.id}">
                ${colTasks.length === 0 ? `
                  <div class="kanban-empty-placeholder">
                    <span>Sin tareas aquí</span>
                  </div>
                ` : colTasks.map(t => {
                  const assignee = team.find(m => m.id === t.assigneeId);
                  const subtasks = t.subtasks || [];
                  const subCompleted = subtasks.filter(s => s.completed).length;

                  return `
                    <div class="kanban-task-card priority-${t.priority}" data-task-id="${t.id}">
                      <div class="kanban-card-top">
                        <span class="priority-tag tag-${t.priority}">${t.priority}</span>
                        <div class="kanban-quick-actions">
                          <button class="kanban-shift-btn" data-action="shift-status" data-task-id="${t.id}" data-target-status="${col.id === 'pendiente' ? 'en_proceso' : (col.id === 'en_proceso' ? 'completada' : 'pendiente')}" title="Avanzar estado">
                            <i data-lucide="${col.id === 'completada' ? 'rotate-ccw' : 'chevron-right'}"></i>
                          </button>
                        </div>
                      </div>

                      <h5 class="kanban-card-title">${t.title}</h5>

                      ${subtasks.length > 0 ? `
                        <div class="kanban-subtask-mini">
                          <i data-lucide="check-square"></i>
                          <span>${subCompleted}/${subtasks.length} subtareas</span>
                        </div>
                      ` : ''}

                      <div class="kanban-card-footer">
                        <span class="kanban-date"><i data-lucide="calendar"></i> ${t.dueDate || 'Hoy'}</span>
                        ${assignee ? `
                          <span class="avatar-dot-sm" style="background: ${assignee.avatarColor}" title="${assignee.name}">
                            ${assignee.name.charAt(0)}
                          </span>
                        ` : ''}
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

  attachEvents(container) {
    // Alternar vistas Lista / Kanban
    const btnList = container.querySelector('#btn-tasks-view-list');
    const btnKanban = container.querySelector('#btn-tasks-view-kanban');
    if (btnList && btnKanban) {
      btnList.addEventListener('click', () => {
        this.currentView = 'list';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
      btnKanban.addEventListener('click', () => {
        this.currentView = 'kanban';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // Buscador
    const searchInput = container.querySelector('#tasks-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const wrapper = container.querySelector('#tasks-content-wrapper');
        const tasks = window.plannerStore.get('tasks') || [];
        const team = window.plannerStore.get('team') || [];
        const projects = window.plannerStore.get('projects') || [];
        const filtered = tasks.filter(t => {
          if (this.filterPriority !== 'all' && t.priority !== this.filterPriority) return false;
          if (this.filterStatus !== 'all' && t.status !== this.filterStatus) return false;
          if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            return t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
          }
          return true;
        });

        wrapper.innerHTML = this.currentView === 'list'
          ? this.renderListView(filtered, team, projects)
          : this.renderKanbanView(filtered, team, projects);
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Filtros dropdown
    const filterPri = container.querySelector('#filter-task-priority');
    if (filterPri) {
      filterPri.addEventListener('change', (e) => {
        this.filterPriority = e.target.value;
        this.render(container);
      });
    }
    const filterSta = container.querySelector('#filter-task-status');
    if (filterSta) {
      filterSta.addEventListener('change', (e) => {
        this.filterStatus = e.target.value;
        this.render(container);
      });
    }

    // Modal Crear Tarea
    const btnAdd = container.querySelector('#btn-add-task-modal');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        window.plannerApp.openTaskModal();
      });
    }

    // Delegación de clics en tareas
    container.addEventListener('click', (e) => {
      // Toggle completar tarea
      const toggleCompleteBtn = e.target.closest('[data-action="toggle-complete"]');
      if (toggleCompleteBtn) {
        const taskId = toggleCompleteBtn.dataset.taskId;
        const task = window.plannerStore.get('tasks').find(t => t.id === taskId);
        if (task) {
          const newStatus = task.status === 'completada' ? 'pendiente' : 'completada';
          window.plannerStore.updateTask(taskId, { status: newStatus });
          window.plannerAudio.playCheck();
          this.render(container);
        }
        return;
      }

      // Toggle subtarea
      const subtaskBox = e.target.closest('[data-action="toggle-subtask"]');
      if (subtaskBox) {
        const taskId = subtaskBox.dataset.taskId;
        const subtaskId = subtaskBox.dataset.subtaskId;
        window.plannerStore.toggleSubtask(taskId, subtaskId);
        window.plannerAudio.playCheck();
        this.render(container);
        return;
      }

      // Eliminar tarea
      const deleteBtn = e.target.closest('[data-action="delete-task"]');
      if (deleteBtn) {
        const taskId = deleteBtn.dataset.taskId;
        if (confirm('¿Eliminar esta tarea de forma permanente?')) {
          window.plannerStore.deleteTask(taskId);
          this.render(container);
        }
        return;
      }

      // Editar tarea
      const editBtn = e.target.closest('[data-action="edit-task"]');
      if (editBtn) {
        const taskId = editBtn.dataset.taskId;
        const task = window.plannerStore.get('tasks').find(t => t.id === taskId);
        if (task) {
          window.plannerApp.openTaskModal(task);
        }
        return;
      }

      // Kanban Shift Status
      const shiftBtn = e.target.closest('[data-action="shift-status"]');
      if (shiftBtn) {
        const taskId = shiftBtn.dataset.taskId;
        const targetStatus = shiftBtn.dataset.targetStatus;
        window.plannerStore.updateTask(taskId, { status: targetStatus });
        window.plannerAudio.playCheck();
        this.render(container);
        return;
      }
    });
  }
}

window.tasksModule = new TasksModule();
