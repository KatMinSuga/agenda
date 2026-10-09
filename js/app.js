/**
 * Controlador Principal de la Agenda Digital Notes Web
 * Gestión de pestañas laterales hipervinculadas, paleta de comandos (Ctrl+K),
 * atajos de teclado, modales globales y modo Zen anti-distracción.
 */

class PlannerApp {
  constructor() {
    this.currentTab = 'dashboard';
    this.zenMode = false;
  }

  init() {
    // Cargar ajustes guardados
    const settings = window.plannerStore.get('settings') || {};
    this.setTheme(settings.theme || 'caramel');
    if (settings.soundEnabled !== undefined) {
      window.plannerAudio.enabled = settings.soundEnabled;
    }

    this.bindSidebarTabs();
    this.bindTopNav();
    this.bindKeyboardShortcuts();
    this.bindCommandPalette();
    this.bindGlobalModals();
    this.updateTopHeader();

    // Navegar a la pestaña inicial
    this.navigateToTab(settings.activeTab || 'dashboard', false);
  }

  updateTopHeader() {
    const profile = window.plannerStore.get('profile') || {};
    const avatarEl = document.getElementById('user-header-avatar');
    const nameEl = document.getElementById('user-header-name');
    const roleEl = document.getElementById('user-header-role');

    if (avatarEl) avatarEl.textContent = profile.avatar || 'CM';
    if (nameEl) nameEl.textContent = profile.name || 'Carolina Méndez';
    if (roleEl) roleEl.textContent = profile.role || 'Executive Ops & VA';
  }

  setTheme(themeName) {
    document.body.className = `theme-${themeName}`;
    if (this.zenMode) document.body.classList.add('zen-focus-mode');
    window.plannerStore.data.settings.theme = themeName;
    window.plannerStore.saveData();
  }

  toggleZenMode() {
    this.zenMode = !this.zenMode;
    if (this.zenMode) {
      document.body.classList.add('zen-focus-mode');
    } else {
      document.body.classList.remove('zen-focus-mode');
    }
    window.plannerAudio.playTabClick();
  }

  navigateToTab(tabId, playSound = true) {
    this.currentTab = tabId;
    window.plannerStore.data.settings.activeTab = tabId;
    window.plannerStore.saveData();

    if (playSound) {
      window.plannerAudio.playPageTurn();
    }

    // Actualizar pestañas activas
    document.querySelectorAll('.planner-tab').forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Efecto de cambio de página
    const pageContainer = document.getElementById('planner-active-page');
    if (!pageContainer) return;

    pageContainer.classList.add('page-flipping');
    setTimeout(() => {
      // Renderizar el módulo correspondiente
      switch (tabId) {
        case 'dashboard':
          window.dashboardModule.render(pageContainer);
          break;
        case 'calendar':
          window.calendarModule.render(pageContainer);
          break;
        case 'tasks':
          window.tasksModule.render(pageContainer);
          break;
        case 'projects':
          window.projectsModule.render(pageContainer);
          break;
        case 'vabox':
          window.vaHubModule.render(pageContainer);
          break;
        case 'contacts':
          window.contactsTeamModule.render(pageContainer);
          break;
        case 'finance':
          window.financeModule.render(pageContainer);
          break;
        case 'notes':
          window.notesModule.render(pageContainer);
          break;
        case 'personal':
          window.personalModule.render(pageContainer);
          break;
        case 'automations':
          window.automationsModule.render(pageContainer);
          break;
        case 'reports':
          window.reportsModule.render(pageContainer);
          break;
        case 'settings':
          window.settingsModule.render(pageContainer);
          break;
        default:
          window.dashboardModule.render(pageContainer);
      }
      pageContainer.classList.remove('page-flipping');
      if (window.lucide) window.lucide.createIcons();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 90);
  }

  bindSidebarTabs() {
    document.querySelectorAll('.planner-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.navigateToTab(tabId);
      });
    });

    // Clic en cintas marcapáginas superiores (Bookmarks)
    document.querySelectorAll('.ribbon-bookmark').forEach(ribbon => {
      ribbon.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.targetTab;
        if (targetTab) this.navigateToTab(targetTab);
      });
    });
  }

  bindTopNav() {
    // Botón de Modo Zen
    const btnZen = document.getElementById('top-btn-zen');
    if (btnZen) {
      btnZen.addEventListener('click', () => this.toggleZenMode());
    }

    // Botón de salir de modo Zen flotante
    const btnExitZen = document.getElementById('floating-exit-zen');
    if (btnExitZen) {
      btnExitZen.addEventListener('click', () => this.toggleZenMode());
    }

    // Botón de paleta de búsqueda (Ctrl+K)
    const btnSearch = document.getElementById('top-btn-search');
    if (btnSearch) {
      btnSearch.addEventListener('click', () => this.openCommandPalette());
    }

    // Botón + Rápido
    const btnPlus = document.getElementById('top-btn-quick-add');
    if (btnPlus) {
      btnPlus.addEventListener('click', () => this.openQuickEntryModal());
    }

    // Campana de notificaciones
    const btnNotif = document.getElementById('top-btn-notifications');
    if (btnNotif) {
      btnNotif.addEventListener('click', () => {
        this.navigateToTab('automations');
      });
    }
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);

      // Cmd+K o Ctrl+K -> Paleta de Comandos
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openCommandPalette();
        return;
      }

      // Esc -> Cerrar modales
      if (e.key === 'Escape') {
        this.closeAllModals();
        return;
      }

      if (!isInput) {
        // 'F' -> Toggle Zen Mode
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          this.toggleZenMode();
          return;
        }

        // 'N' -> Nuevo Rápido
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          this.openQuickEntryModal();
          return;
        }

        // Números 1 a 9 para cambiar de pestaña al instante
        const num = parseInt(e.key);
        const tabsMap = ['dashboard', 'calendar', 'tasks', 'projects', 'vabox', 'contacts', 'finance', 'notes', 'personal'];
        if (num >= 1 && num <= 9 && tabsMap[num - 1]) {
          this.navigateToTab(tabsMap[num - 1]);
        }
      }
    });
  }

  // Paleta de Comandos Universal (Ctrl+K)
  bindCommandPalette() {
    const modal = document.getElementById('command-palette-modal');
    const input = document.getElementById('command-search-input');
    const resultsContainer = document.getElementById('command-results-list');

    if (!modal || !input) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = `
          <div class="cmd-quick-section">
            <span class="cmd-sec-title">Acciones Frecuentes</span>
            <div class="cmd-item" data-jump-tab="tasks"><i data-lucide="check-square"></i> Ver todas las tareas</div>
            <div class="cmd-item" data-jump-tab="calendar"><i data-lucide="calendar"></i> Ver calendario mensual</div>
            <div class="cmd-item" data-jump-tab="vabox"><i data-lucide="clock"></i> Iniciar cronómetro de horas VA</div>
            <div class="cmd-item" data-jump-tab="finance"><i data-lucide="wallet"></i> Revisar ingresos y facturas</div>
            <div class="cmd-item" data-jump-tab="notes"><i data-lucide="edit-3"></i> Abrir minutas y notas</div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      // Buscar en Store
      const tasks = window.plannerStore.get('tasks') || [];
      const events = window.plannerStore.get('events') || [];
      const clients = window.plannerStore.get('clients') || [];
      const notes = window.plannerStore.get('notes') || [];

      let matchesHtml = '';

      // Tareas coincidentes
      tasks.filter(t => t.title.toLowerCase().includes(q)).slice(0, 4).forEach(t => {
        matchesHtml += `
          <div class="cmd-item" data-jump-tab="tasks">
            <span class="cmd-badge task">Tarea</span>
            <strong>${t.title}</strong>
            <span class="cmd-sub">${t.priority} · ${t.status}</span>
          </div>
        `;
      });

      // Eventos
      events.filter(ev => ev.title.toLowerCase().includes(q)).slice(0, 3).forEach(ev => {
        matchesHtml += `
          <div class="cmd-item" data-jump-tab="calendar">
            <span class="cmd-badge event">Cita</span>
            <strong>${ev.title}</strong>
            <span class="cmd-sub">${ev.date} (${ev.startTime})</span>
          </div>
        `;
      });

      // Clientes
      clients.filter(c => c.company.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)).slice(0, 3).forEach(c => {
        matchesHtml += `
          <div class="cmd-item" data-jump-tab="vabox">
            <span class="cmd-badge client">Cliente</span>
            <strong>${c.company}</strong>
            <span class="cmd-sub">${c.name} · $${c.ratePerHour}/h</span>
          </div>
        `;
      });

      // Notas
      notes.filter(n => n.title.toLowerCase().includes(q)).slice(0, 3).forEach(n => {
        matchesHtml += `
          <div class="cmd-item" data-jump-tab="notes">
            <span class="cmd-badge note">Nota</span>
            <strong>${n.title}</strong>
            <span class="cmd-sub">${n.updatedAt}</span>
          </div>
        `;
      });

      if (!matchesHtml) {
        resultsContainer.innerHTML = `<div class="cmd-no-results">No se encontraron resultados para "${q}"</div>`;
      } else {
        resultsContainer.innerHTML = matchesHtml;
      }
      if (window.lucide) window.lucide.createIcons();
    });

    resultsContainer.addEventListener('click', (e) => {
      const item = e.target.closest('[data-jump-tab]');
      if (item) {
        const tab = item.dataset.jumpTab;
        this.closeAllModals();
        this.navigateToTab(tab);
      }
    });
  }

  openCommandPalette() {
    this.closeAllModals();
    const modal = document.getElementById('command-palette-modal');
    const input = document.getElementById('command-search-input');
    if (modal) {
      modal.classList.add('open');
      if (input) {
        input.value = '';
        input.focus();
        input.dispatchEvent(new Event('input'));
      }
    }
  }

  // Modales
  openQuickEntryModal() {
    this.closeAllModals();
    const modal = document.getElementById('quick-entry-modal');
    if (modal) modal.classList.add('open');
  }

  openTaskModal(taskToEdit = null) {
    this.closeAllModals();
    const modal = document.getElementById('task-editor-modal');
    if (!modal) return;

    modal.classList.add('open');
    const titleInput = document.getElementById('modal-task-title');
    const descInput = document.getElementById('modal-task-desc');
    const dateInput = document.getElementById('modal-task-date');
    const startIn = document.getElementById('modal-task-start');
    const endIn = document.getElementById('modal-task-end');
    const priSelect = document.getElementById('modal-task-priority');
    const catInput = document.getElementById('modal-task-category');
    const idInput = document.getElementById('modal-task-id');

    if (taskToEdit) {
      idInput.value = taskToEdit.id;
      titleInput.value = taskToEdit.title;
      descInput.value = taskToEdit.description || '';
      dateInput.value = taskToEdit.dueDate || '2026-10-08';
      startIn.value = taskToEdit.startTime || '09:00';
      endIn.value = taskToEdit.endTime || '10:00';
      priSelect.value = taskToEdit.priority;
      catInput.value = taskToEdit.category || 'General';
    } else {
      idInput.value = '';
      titleInput.value = '';
      descInput.value = '';
      dateInput.value = '2026-10-08';
      startIn.value = '10:00';
      endIn.value = '11:00';
      priSelect.value = 'alta';
      catInput.value = 'Operaciones';
    }
    titleInput.focus();
  }

  openEventModal() {
    this.closeAllModals();
    const modal = document.getElementById('event-editor-modal');
    if (!modal) return;
    modal.classList.add('open');
  }

  openProjectModal() {
    this.closeAllModals();
    const modal = document.getElementById('project-editor-modal');
    if (!modal) return;
    modal.classList.add('open');
  }

  openClientModal() {
    this.closeAllModals();
    const modal = document.getElementById('client-editor-modal');
    if (!modal) return;
    modal.classList.add('open');
  }

  openTransactionModal() {
    this.closeAllModals();
    const modal = document.getElementById('trx-editor-modal');
    if (!modal) return;
    modal.classList.add('open');
  }

  closeAllModals() {
    document.querySelectorAll('.planner-modal-backdrop').forEach(m => m.classList.remove('open'));
  }

  bindGlobalModals() {
    // Cerrar al hacer clic en fondo o en botón de cerrar
    document.querySelectorAll('.planner-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop || e.target.closest('.modal-close-btn')) {
          this.closeAllModals();
        }
      });
    });

    // Guardar Tarea Modal
    const formTask = document.getElementById('form-modal-task');
    if (formTask) {
      formTask.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskId = document.getElementById('modal-task-id').value;
        const taskObj = {
          title: document.getElementById('modal-task-title').value.trim(),
          description: document.getElementById('modal-task-desc').value.trim(),
          dueDate: document.getElementById('modal-task-date').value,
          startTime: document.getElementById('modal-task-start').value,
          endTime: document.getElementById('modal-task-end').value,
          priority: document.getElementById('modal-task-priority').value,
          category: document.getElementById('modal-task-category').value.trim(),
          status: 'pendiente'
        };

        if (taskId) {
          window.plannerStore.updateTask(taskId, taskObj);
        } else {
          window.plannerStore.addTask(taskObj);
        }

        window.plannerAudio.playCheck();
        this.closeAllModals();
        this.navigateToTab(this.currentTab, false);
      });
    }

    // Guardar Evento con Detección de Conflictos
    const formEvent = document.getElementById('form-modal-event');
    if (formEvent) {
      formEvent.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('modal-event-date').value;
        const startTime = document.getElementById('modal-event-start').value;
        const endTime = document.getElementById('modal-event-end').value;
        const title = document.getElementById('modal-event-title').value.trim();

        // Validar conflicto de horario
        const conflicts = window.plannerStore.checkScheduleConflict(date, startTime, endTime);
        if (conflicts.length > 0) {
          const proceed = confirm(`⚠️ ¡Alerta de Conflicto de Horario!\nYa existe el compromiso: "${conflicts[0].title}" (${conflicts[0].startTime} - ${conflicts[0].endTime}) en este mismo horario.\n\n¿Deseas registrar este evento de todos modos?`);
          if (!proceed) return;
        }

        window.plannerStore.addEvent({
          title: title,
          date: date,
          startTime: startTime,
          endTime: endTime,
          type: document.getElementById('modal-event-type').value,
          location: document.getElementById('modal-event-location').value.trim() || 'Videollamada',
          attendees: document.getElementById('modal-event-attendees').value.trim() || 'General',
          color: document.getElementById('modal-event-color').value || '#9C523B'
        });

        window.plannerAudio.playCheck();
        this.closeAllModals();
        this.navigateToTab(this.currentTab, false);
      });
    }

    // Guardar Transacción
    const formTrx = document.getElementById('form-modal-trx');
    if (formTrx) {
      formTrx.addEventListener('submit', (e) => {
        e.preventDefault();
        window.plannerStore.addTransaction({
          type: document.getElementById('modal-trx-type').value,
          description: document.getElementById('modal-trx-desc').value.trim(),
          amount: parseFloat(document.getElementById('modal-trx-amount').value) || 0,
          category: document.getElementById('modal-trx-category').value.trim(),
          date: document.getElementById('modal-trx-date').value,
          client: document.getElementById('modal-trx-client').value.trim() || 'Operaciones',
          status: document.getElementById('modal-trx-status').value
        });

        window.plannerAudio.playCheck();
        this.closeAllModals();
        this.navigateToTab(this.currentTab, false);
      });
    }

    // Guardar Cliente
    const formClient = document.getElementById('form-modal-client');
    if (formClient) {
      formClient.addEventListener('submit', (e) => {
        e.preventDefault();
        window.plannerStore.addClient({
          company: document.getElementById('modal-client-company').value.trim(),
          name: document.getElementById('modal-client-name').value.trim(),
          email: document.getElementById('modal-client-email').value.trim(),
          phone: document.getElementById('modal-client-phone').value.trim(),
          ratePerHour: parseFloat(document.getElementById('modal-client-rate').value) || 40,
          hoursContracted: parseFloat(document.getElementById('modal-client-hours').value) || 20,
          hoursUsed: 0,
          services: document.getElementById('modal-client-services').value.trim(),
          instructions: document.getElementById('modal-client-instructions').value.trim(),
          status: 'activo',
          requests: []
        });

        window.plannerAudio.playCheck();
        this.closeAllModals();
        this.navigateToTab('vabox', false);
      });
    }

    // Guardar Proyecto
    const formProject = document.getElementById('form-modal-project');
    if (formProject) {
      formProject.addEventListener('submit', (e) => {
        e.preventDefault();
        window.plannerStore.addProject({
          title: document.getElementById('modal-project-title').value.trim(),
          description: document.getElementById('modal-project-desc').value.trim(),
          deadline: document.getElementById('modal-project-deadline').value,
          budget: parseFloat(document.getElementById('modal-project-budget').value) || 3000,
          spent: 0,
          status: 'activo',
          progress: 10,
          deliverables: [
            { id: 'del-' + Date.now(), title: 'Fase 1: Diagnóstico inicial', completed: false, dueDate: document.getElementById('modal-project-deadline').value }
          ]
        });

        window.plannerAudio.playCheck();
        this.closeAllModals();
        this.navigateToTab('projects', false);
      });
    }

    // Opciones del Quick Entry Modal
    document.querySelectorAll('[data-quick-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.quickAction;
        this.closeAllModals();
        switch (action) {
          case 'task': this.openTaskModal(); break;
          case 'event': this.openEventModal(); break;
          case 'trx': this.openTransactionModal(); break;
          case 'client': this.openClientModal(); break;
          case 'note':
            this.navigateToTab('notes');
            break;
        }
      });
    });
  }
}

window.plannerApp = new PlannerApp();

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.plannerApp.init();
});
