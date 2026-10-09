/**
 * Módulo de Notas & Actas de Reunión
 * Formato cuaderno de notas Notes con plantillas reutilizables,
 * minutas con acuerdos, búsqueda y notas rápidas.
 */

class NotesModule {
  constructor() {
    this.selectedNoteId = 'not-1';
    this.activeFilter = 'all'; // 'all', 'minuta', 'plantilla', 'rapida'
    this.searchQuery = '';
  }

  render(container) {
    const notes = window.plannerStore.get('notes') || [];

    const filteredNotes = notes.filter(n => {
      if (this.activeFilter !== 'all' && n.type !== this.activeFilter) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q);
      }
      return true;
    });

    const activeNote = notes.find(n => n.id === this.selectedNoteId) || filteredNotes[0] || notes[0];

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="book-open"></i> Módulo 07 · Cuaderno & Documentos</div>
          <h2 class="planner-page-title">Notas, Minutas & Plantillas</h2>
          <p class="planner-page-desc">Papel punteado digital estilo Notes. Plantillas reutilizables para reuniones, acuerdos de clientes y registro de ideas.</p>
        </div>
        <div class="header-actions">
          <div class="template-dropdown-wrap">
            <button class="action-btn secondary" id="btn-insert-template">
              <i data-lucide="file-text"></i> Usar Plantilla
            </button>
          </div>
          <button class="action-btn primary" id="btn-new-note">
            <i data-lucide="plus"></i> Nueva Nota
          </button>
        </div>
      </div>

      <div class="notes-workspace-layout">
        <!-- Barra Lateral de Notas -->
        <div class="notes-sidebar">
          <div class="notes-search-box">
            <i data-lucide="search"></i>
            <input type="text" id="note-search-input" placeholder="Buscar en notas..." value="${this.searchQuery}">
          </div>

          <div class="notes-type-tabs">
            <button class="n-tab ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todas</button>
            <button class="n-tab ${this.activeFilter === 'minuta' ? 'active' : ''}" data-filter="minuta">Minutas</button>
            <button class="n-tab ${this.activeFilter === 'plantilla' ? 'active' : ''}" data-filter="plantilla">Plantillas</button>
            <button class="n-tab ${this.activeFilter === 'rapida' ? 'active' : ''}" data-filter="rapida">Rápidas</button>
          </div>

          <div class="notes-thumbnails-stack">
            ${filteredNotes.map(n => {
              const isSelected = activeNote && activeNote.id === n.id;
              return `
                <div class="note-thumb-card ${isSelected ? 'is-selected' : ''}" data-note-id="${n.id}">
                  <div class="thumb-header">
                    <span class="note-type-badge type-${n.type}">${n.type.toUpperCase()}</span>
                    <span class="note-date">${n.updatedAt}</span>
                  </div>
                  <h4 class="thumb-title">${n.title}</h4>
                  <p class="thumb-snippet">${n.content.replace(/#|\*|\[|\]|-/g, '').substring(0, 70)}...</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Área de Edición / Lectura Papel Notes -->
        <div class="note-editor-sheet">
          ${activeNote ? this.renderNoteEditor(activeNote) : `
            <div class="empty-state-card">
              <p>Selecciona una nota o crea una nueva.</p>
            </div>
          `}
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderNoteEditor(n) {
    return `
      <div class="lined-paper-editor">
        <div class="paper-top-binder-hole"></div>
        <div class="paper-meta-header">
          <input type="text" id="active-note-title" class="paper-title-input" value="${n.title}" placeholder="Título de la nota o acta...">
          <div class="paper-badges-bar">
            <span class="paper-badge"><i data-lucide="tag"></i> ${n.category || 'General'}</span>
            <span class="paper-badge"><i data-lucide="clock"></i> Última edición: ${n.updatedAt}</span>
            <button class="btn-text-danger" id="btn-delete-active-note" data-note-id="${n.id}">
              <i data-lucide="trash-2"></i> Eliminar
            </button>
          </div>
        </div>

        <div class="paper-ruled-body">
          <textarea id="active-note-content" class="paper-textarea" placeholder="Escribe aquí tus acuerdos, puntos de reunión o ideas...">${n.content}</textarea>
        </div>

        <div class="paper-footer-hint">
          <span><i data-lucide="check"></i> Los cambios se guardan automáticamente al escribir</span>
          <span class="stationery-brand">Méndez Digital Stationery · Notes Web</span>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    // Selección de nota
    container.querySelectorAll('.note-thumb-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedNoteId = e.currentTarget.dataset.noteId;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // Filtros de categoría
    container.querySelectorAll('.n-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.activeFilter = e.currentTarget.dataset.filter;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    // Buscador
    const searchInput = container.querySelector('#note-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }

    // Auto-guardado de título y contenido
    const titleInput = container.querySelector('#active-note-title');
    const contentInput = container.querySelector('#active-note-content');

    if (titleInput && this.selectedNoteId) {
      titleInput.addEventListener('input', (e) => {
        window.plannerStore.updateNote(this.selectedNoteId, { title: e.target.value });
      });
    }

    if (contentInput && this.selectedNoteId) {
      contentInput.addEventListener('input', (e) => {
        window.plannerStore.updateNote(this.selectedNoteId, { content: e.target.value });
      });
    }

    // Nueva nota
    const btnNew = container.querySelector('#btn-new-note');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        const newNote = window.plannerStore.addNote({
          title: "Nueva Nota sin Título",
          type: "rapida",
          category: "General",
          content: "Comienza a escribir tus notas aquí..."
        });
        this.selectedNoteId = newNote.id;
        window.plannerAudio.playPageTurn();
        this.render(container);
      });
    }

    // Usar plantilla
    const btnTpl = container.querySelector('#btn-insert-template');
    if (btnTpl) {
      btnTpl.addEventListener('click', () => {
        const choice = prompt("Elige plantilla: \n1 - Minuta de Reunión\n2 - Brief de Cliente\n3 - Planificación Semanal");
        let tplTitle = "Plantilla";
        let tplContent = "";
        let tplType = "plantilla";

        if (choice === "1") {
          tplTitle = "Minuta de Reunión - " + new Date().toISOString().split('T')[0];
          tplType = "minuta";
          tplContent = `### Participantes:\n- \n\n### Puntos Tratados:\n1. \n2. \n\n### Acuerdos & Compromisos:\n- [ ] Responsable: Tarea - Fecha límite:\n- [ ] Responsable: Tarea - Fecha límite:`;
        } else if (choice === "2") {
          tplTitle = "Brief de Inicio de Cliente";
          tplContent = `### Datos Generales:\n- Cliente:\n- Objetivos del proyecto:\n- Alcance de servicios:\n\n### Canales & Accesos:\n- Correo / Slack:\n- Herramientas requeridas:`;
        } else {
          tplTitle = "Planificación de Enfoque Semanal";
          tplContent = `### Objetivo Estrella de la Semana:\n- \n\n### 3 Grandes Tareas:\n1. \n2. \n3. \n\n### Hábitos no negociables:\n- Hidratación y 8h de sueño.`;
        }

        const note = window.plannerStore.addNote({
          title: tplTitle,
          type: tplType,
          category: "Plantillas",
          content: tplContent
        });
        this.selectedNoteId = note.id;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    }

    // Eliminar nota
    const btnDel = container.querySelector('#btn-delete-active-note');
    if (btnDel) {
      btnDel.addEventListener('click', (e) => {
        const noteId = e.currentTarget.dataset.noteId;
        if (confirm("¿Seguro que deseas eliminar esta nota?")) {
          window.plannerStore.deleteNote(noteId);
          this.selectedNoteId = null;
          this.render(container);
        }
      });
    }
  }
}

window.notesModule = new NotesModule();
