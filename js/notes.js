/**
 * Módulo 07 · Notas, Cuaderno & Documentos
 * Papel punteado digital estilo Notes, menú visual para escoger plantillas,
 * edición completa de etiquetas/categorías e inserción y control interactivo de checkboxes.
 */

class NotesModule {
  constructor() {
    this.selectedNoteId = 'not-1';
    this.activeFilter = 'all'; // 'all', 'minuta', 'plantilla', 'rapida'
    this.searchQuery = '';
    this.showTemplatePicker = false;
    this.viewMode = 'edit'; // 'edit' o 'interactive'
  }

  render(container) {
    const notes = window.plannerStore.get('notes') || [];

    const filteredNotes = notes.filter(n => {
      if (this.activeFilter !== 'all' && n.type !== this.activeFilter) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q) || (n.category || '').toLowerCase().includes(q);
      }
      return true;
    });

    const activeNote = notes.find(n => n.id === this.selectedNoteId) || filteredNotes[0] || notes[0];

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="book-open"></i> Módulo 07 · Cuaderno & Documentos</div>
          <h2 class="planner-page-title">Notas, Minutas & Papelería Digital</h2>
          <p class="planner-page-desc">Papel punteado estilo Notes. Catálogo de plantillas, etiquetas editables y soporte de casillas de verificación interactivas.</p>
        </div>
        <div class="header-actions">
          <div class="template-dropdown-wrap">
            <button class="action-btn secondary" id="btn-open-template-menu">
              <i data-lucide="layout-template"></i> Escoger Plantilla
            </button>
          </div>
          <button class="action-btn primary" id="btn-new-note">
            <i data-lucide="plus"></i> Nueva Nota
          </button>
        </div>
      </div>

      <!-- Menú Flotante / Selector de Plantillas Visual -->
      ${this.showTemplatePicker ? this.renderTemplatePickerMenu() : ''}

      <div class="notes-workspace-layout">
        <!-- Barra Lateral de Notas -->
        <div class="notes-sidebar">
          <div class="notes-search-box">
            <i data-lucide="search"></i>
            <input type="text" id="note-search-input" placeholder="Buscar por título, texto o etiqueta..." value="${this.searchQuery}">
          </div>

          <div class="notes-type-tabs">
            <button class="n-tab ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todas</button>
            <button class="n-tab ${this.activeFilter === 'minuta' ? 'active' : ''}" data-filter="minuta">Minutas</button>
            <button class="n-tab ${this.activeFilter === 'plantilla' ? 'active' : ''}" data-filter="plantilla">Plantillas</button>
            <button class="n-tab ${this.activeFilter === 'rapida' ? 'active' : ''}" data-filter="rapida">Rápidas</button>
          </div>

          <div class="notes-thumbnails-stack">
            ${filteredNotes.length === 0 ? `<p class="empty-hint" style="padding:16px;">No hay notas con este criterio.</p>` : filteredNotes.map(n => {
              const isSelected = activeNote && activeNote.id === n.id;
              return `
                <div class="note-thumb-card ${isSelected ? 'is-selected' : ''}" data-note-id="${n.id}">
                  <div class="thumb-header">
                    <span class="note-type-badge type-${n.type}">${n.type.toUpperCase()}</span>
                    <span class="thumb-cat-badge">${n.category || 'General'}</span>
                  </div>
                  <h4 class="thumb-title">${n.title}</h4>
                  <p class="thumb-snippet">${n.content.replace(/#|\*|\[|\]|-/g, '').substring(0, 65)}...</p>
                  <div class="thumb-meta-footer">
                    <span><i data-lucide="clock"></i> ${n.updatedAt}</span>
                    ${(n.content.match(/- \[[ xX]\]/g) || []).length > 0 ? `
                      <span class="checkbox-count-pill"><i data-lucide="check-square"></i> ${(n.content.match(/- \[[ xX]\]/g) || []).length} checks</span>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Área de Edición / Lectura Papel Notes -->
        <div class="note-editor-sheet">
          ${activeNote ? this.renderNoteEditor(activeNote) : `
            <div class="empty-state-card">
              <p>Selecciona una nota del panel izquierdo o crea una nueva.</p>
            </div>
          `}
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  // Menú visual para escoger plantillas
  renderTemplatePickerMenu() {
    return `
      <div class="template-picker-card">
        <div class="tpl-picker-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="layout-template" style="color:var(--accent-primary);"></i>
            <h4 style="font-family:var(--font-serif); font-size:1.1rem; margin:0;">Catálogo de Plantillas Notes</h4>
          </div>
          <button class="btn-text-sm" id="btn-close-template-picker">&times; Cerrar</button>
        </div>
        <div class="template-options-grid">
          <div class="tpl-option-box" data-template-key="minuta">
            <div class="tpl-icon-banner gold"><i data-lucide="users"></i></div>
            <strong class="tpl-name">Minuta de Reunión Ejecutiva</strong>
            <p class="tpl-desc">Participantes, acuerdos, compromisos y checklist interactivo de tareas con fecha.</p>
            <span class="tpl-tag">Minuta · Reuniones</span>
          </div>

          <div class="tpl-option-box" data-template-key="pociones">
            <div class="tpl-icon-banner green"><i data-lucide="flask-conical"></i></div>
            <strong class="tpl-name">Protocolo Alquímico / Pociones</strong>
            <p class="tpl-desc">Insumos críticos con casillas de verificación, temperaturas y fases lunares.</p>
            <span class="tpl-tag">Alquimia · Protocolo</span>
          </div>

          <div class="tpl-option-box" data-template-key="brief">
            <div class="tpl-icon-banner blue"><i data-lucide="briefcase"></i></div>
            <strong class="tpl-name">Brief de Cliente & Proyecto</strong>
            <p class="tpl-desc">Objetivos de proyecto, tarifas, entregables clave y accesos seguros a bóvedas.</p>
            <span class="tpl-tag">Cliente · Operaciones</span>
          </div>

          <div class="tpl-option-box" data-template-key="semanal">
            <div class="tpl-icon-banner purple"><i data-lucide="calendar"></i></div>
            <strong class="tpl-name">Plan Semanal de Alto Enfoque</strong>
            <p class="tpl-desc">Objetivo estrella de la semana, 3 grandes metas con checkbox y hábitos no negociables.</p>
            <span class="tpl-tag">Estrategia · Hábitos</span>
          </div>

          <div class="tpl-option-box" data-template-key="one_on_one">
            <div class="tpl-icon-banner terracotta"><i data-lucide="user-check"></i></div>
            <strong class="tpl-name">Sesión 1:1 de Tutoría & Equipo</strong>
            <p class="tpl-desc">Revisión de avance, puntos de bloqueo y acuerdos bilaterales de seguimiento.</p>
            <span class="tpl-tag">Equipo · Prefectura</span>
          </div>
        </div>
      </div>
    `;
  }

  renderNoteEditor(n) {
    const hasCheckboxes = (n.content.match(/- \[[ xX]\]/g) || []).length > 0;

    return `
      <div class="lined-paper-editor">
        <div class="paper-top-binder-hole"></div>

        <!-- Cabecera de la hoja con título y etiqueta editable -->
        <div class="paper-meta-header">
          <input type="text" id="active-note-title" class="paper-title-input" value="${n.title}" placeholder="Título de la nota o acta...">
          
          <div class="paper-badges-bar">
            <!-- Etiqueta / Categoría 100% editable -->
            <div class="paper-editable-tag-field" title="Editar etiqueta o categoría de la nota">
              <i data-lucide="tag"></i>
              <input type="text" id="active-note-category" class="paper-category-input" value="${n.category || 'General'}" placeholder="Etiqueta / Categoría">
            </div>

            <span class="paper-badge"><i data-lucide="clock"></i> ${n.updatedAt}</span>

            <!-- Selector de modo interactivo si tiene checkboxes -->
            ${hasCheckboxes ? `
              <button class="action-btn-xs ${this.viewMode === 'interactive' ? 'primary' : 'secondary'}" id="btn-toggle-view-mode" title="Ver casillas clickeables">
                <i data-lucide="${this.viewMode === 'interactive' ? 'edit-2' : 'check-square'}"></i>
                ${this.viewMode === 'interactive' ? 'Modo Texto' : 'Modo Casillas'}
              </button>
            ` : ''}

            <button class="btn-text-danger" id="btn-delete-active-note" data-note-id="${n.id}">
              <i data-lucide="trash-2"></i> Eliminar
            </button>
          </div>
        </div>

        <!-- Barra de Herramientas para Insertar Checkboxes y Formato -->
        <div class="paper-toolbar-bar">
          <div class="toolbar-left">
            <button class="paper-tool-btn" id="btn-insert-single-check" title="Insertar casilla de verificación - [ ]">
              <i data-lucide="check-square"></i> + Checkbox [ ]
            </button>
            <button class="paper-tool-btn" id="btn-insert-check-block" title="Insertar bloque de 3 tareas con checkbox">
              <i data-lucide="list-checks"></i> + Bloque de Casillas
            </button>
            <button class="paper-tool-btn" id="btn-insert-bullet" title="Insertar viñeta">
              <i data-lucide="list"></i> Viñeta •
            </button>
            <button class="paper-tool-btn" id="btn-insert-heading" title="Insertar subtítulo">
              <i data-lucide="heading"></i> Subtítulo ###
            </button>
          </div>
          <div class="toolbar-right">
            <span class="toolbar-hint"><i data-lucide="save"></i> Auto-guardado activo</span>
          </div>
        </div>

        <!-- Cuerpo del papel: Vista interactiva de casillas o Textarea clásico -->
        ${this.viewMode === 'interactive' ? `
          <div class="paper-interactive-body">
            ${this.renderInteractiveContent(n.content)}
          </div>
        ` : `
          <div class="paper-ruled-body">
            <textarea id="active-note-content" class="paper-textarea" placeholder="Escribe aquí tus acuerdos, puntos de reunión o ideas...">${n.content}</textarea>
          </div>
        `}

        <div class="paper-footer-hint">
          <span style="display:flex; align-items:center; gap:6px;">
            <i data-lucide="shield-check" style="width:13px; height:13px; color:var(--accent-secondary);"></i>
            Notas sincronizadas localmente · Soporte completo para listas de verificación
          </span>
          <span class="stationery-brand">Méndez Digital Stationery · Notes Web</span>
        </div>
      </div>
    `;
  }

  // Renderiza el contenido con checkboxes clickeables interactivos
  renderInteractiveContent(content) {
    const lines = content.split('\n');
    let html = '';

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const isUnchecked = trimmed.startsWith('- [ ]') || trimmed.startsWith('* [ ]');
      const isChecked = trimmed.startsWith('- [x]') || trimmed.startsWith('- [X]') || trimmed.startsWith('* [x]') || trimmed.startsWith('* [X]');

      if (isUnchecked || isChecked) {
        const text = trimmed.substring(5).trim();
        html += `
          <div class="interactive-check-line ${isChecked ? 'is-completed' : ''}" data-line-index="${index}">
            <button class="interactive-checkbox-box ${isChecked ? 'checked' : ''}" data-action="toggle-check-line" data-line-index="${index}">
              <i data-lucide="${isChecked ? 'check-square' : 'square'}"></i>
            </button>
            <span class="interactive-check-text">${text}</span>
          </div>
        `;
      } else if (trimmed.startsWith('###')) {
        html += `<h4 class="paper-rendered-heading">${trimmed.replace(/^###\s*/, '')}</h4>`;
      } else if (trimmed.startsWith('##')) {
        html += `<h3 class="paper-rendered-heading-big">${trimmed.replace(/^##\s*/, '')}</h3>`;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        html += `<div class="paper-rendered-bullet">• ${trimmed.substring(2)}</div>`;
      } else if (trimmed === '') {
        html += `<div style="height:12px;"></div>`;
      } else {
        html += `<p class="paper-rendered-p">${trimmed}</p>`;
      }
    });

    return html;
  }

  attachEvents(container) {
    // 1. Selección de nota
    container.querySelectorAll('.note-thumb-card').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedNoteId = e.currentTarget.dataset.noteId;
        this.showTemplatePicker = false;
        this.render(container);
        window.plannerAudio.playPageTurn();
      });
    });

    // 2. Filtros de categoría de notas
    container.querySelectorAll('.n-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.activeFilter = e.currentTarget.dataset.filter;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    });

    // 3. Buscador
    const searchInput = container.querySelector('#note-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }

    // 4. Auto-guardado de título
    const titleInput = container.querySelector('#active-note-title');
    if (titleInput && this.selectedNoteId) {
      titleInput.addEventListener('input', (e) => {
        window.plannerStore.updateNote(this.selectedNoteId, { title: e.target.value });
      });
    }

    // 5. Auto-guardado de categoría / etiqueta
    const catInput = container.querySelector('#active-note-category');
    if (catInput && this.selectedNoteId) {
      catInput.addEventListener('input', (e) => {
        window.plannerStore.updateNote(this.selectedNoteId, { category: e.target.value.trim() || 'General' });
      });
    }

    // 6. Auto-guardado de contenido
    const contentTextarea = container.querySelector('#active-note-content');
    if (contentTextarea && this.selectedNoteId) {
      contentTextarea.addEventListener('input', (e) => {
        window.plannerStore.updateNote(this.selectedNoteId, { content: e.target.value });
      });
    }

    // 7. Insertar Checkbox individual
    const btnSingleCheck = container.querySelector('#btn-insert-single-check');
    if (btnSingleCheck && contentTextarea) {
      btnSingleCheck.addEventListener('click', () => {
        this.insertTextAtCursor(contentTextarea, '\n- [ ] Tarea pendiente: ');
      });
    }

    // 8. Insertar Bloque de Checkboxes
    const btnCheckBlock = container.querySelector('#btn-insert-check-block');
    if (btnCheckBlock && contentTextarea) {
      btnCheckBlock.addEventListener('click', () => {
        this.insertTextAtCursor(contentTextarea, '\n### Compromisos & Acuerdos:\n- [ ] Compromiso 1:\n- [ ] Compromiso 2:\n- [ ] Compromiso 3:');
      });
    }

    // 9. Insertar Viñeta y Subtítulo
    const btnBullet = container.querySelector('#btn-insert-bullet');
    if (btnBullet && contentTextarea) {
      btnBullet.addEventListener('click', () => {
        this.insertTextAtCursor(contentTextarea, '\n- Punto clave: ');
      });
    }

    const btnHeading = container.querySelector('#btn-insert-heading');
    if (btnHeading && contentTextarea) {
      btnHeading.addEventListener('click', () => {
        this.insertTextAtCursor(contentTextarea, '\n### Nuevo Apartado:\n');
      });
    }

    // 10. Alternar Modo Texto vs Modo Casillas Interactivas
    const btnToggleMode = container.querySelector('#btn-toggle-view-mode');
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', () => {
        this.viewMode = this.viewMode === 'edit' ? 'interactive' : 'edit';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // 11. Clic en casilla interactiva (toggle check)
    container.querySelectorAll('[data-action="toggle-check-line"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lineIdx = parseInt(e.currentTarget.dataset.lineIndex, 10);
        const notes = window.plannerStore.get('notes') || [];
        const note = notes.find(n => n.id === this.selectedNoteId);
        if (note && note.content) {
          const lines = note.content.split('\n');
          if (lines[lineIdx]) {
            if (lines[lineIdx].includes('- [ ]')) {
              lines[lineIdx] = lines[lineIdx].replace('- [ ]', '- [x]');
            } else if (lines[lineIdx].includes('- [x]') || lines[lineIdx].includes('- [X]')) {
              lines[lineIdx] = lines[lineIdx].replace(/- \[[xX]\]/, '- [ ]');
            } else if (lines[lineIdx].includes('* [ ]')) {
              lines[lineIdx] = lines[lineIdx].replace('* [ ]', '* [x]');
            } else if (lines[lineIdx].includes('* [x]') || lines[lineIdx].includes('* [X]')) {
              lines[lineIdx] = lines[lineIdx].replace(/\* \[[xX]\]/, '* [ ]');
            }
            note.content = lines.join('\n');
            window.plannerStore.updateNote(this.selectedNoteId, { content: note.content });
            window.plannerAudio.playCheck();
            this.render(container);
          }
        }
      });
    });

    // 12. Menú para escoger plantillas
    const btnOpenTpl = container.querySelector('#btn-open-template-menu');
    if (btnOpenTpl) {
      btnOpenTpl.addEventListener('click', () => {
        this.showTemplatePicker = !this.showTemplatePicker;
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    const btnCloseTpl = container.querySelector('#btn-close-template-picker');
    if (btnCloseTpl) {
      btnCloseTpl.addEventListener('click', () => {
        this.showTemplatePicker = false;
        this.render(container);
      });
    }

    // 13. Selección de plantilla desde el catálogo
    container.querySelectorAll('.tpl-option-box').forEach(box => {
      box.addEventListener('click', (e) => {
        const key = e.currentTarget.dataset.templateKey;
        this.createNoteFromTemplate(key);
      });
    });

    // 14. Nueva Nota en blanco
    const btnNew = container.querySelector('#btn-new-note');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        const newNote = window.plannerStore.addNote({
          title: "Nueva Nota sin Título",
          type: "rapida",
          category: "General",
          content: "### Resumen:\nEscribe aquí tus ideas, notas rápidas o lista de verificación:\n- [ ] Primer punto clave a resolver\n- [ ] Segundo acuerdo pendiente"
        });
        this.selectedNoteId = newNote.id;
        this.showTemplatePicker = false;
        this.viewMode = 'edit';
        window.plannerAudio.playPageTurn();
        this.render(container);
      });
    }

    // 15. Eliminar nota
    const btnDel = container.querySelector('#btn-delete-active-note');
    if (btnDel) {
      btnDel.addEventListener('click', (e) => {
        const noteId = e.currentTarget.dataset.noteId;
        if (confirm("¿Seguro que deseas eliminar esta nota y sus acuerdos?")) {
          window.plannerStore.deleteNote(noteId);
          this.selectedNoteId = null;
          this.render(container);
        }
      });
    }
  }

  insertTextAtCursor(textarea, textToInsert) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + textToInsert + val.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    textarea.focus();
    if (this.selectedNoteId) {
      window.plannerStore.updateNote(this.selectedNoteId, { content: textarea.value });
    }
    window.plannerAudio.playCheck();
  }

  createNoteFromTemplate(templateKey) {
    const today = new Date().toISOString().split('T')[0];
    let title = "Plantilla";
    let type = "plantilla";
    let category = "Plantillas";
    let content = "";

    switch (templateKey) {
      case "minuta":
        title = `Minuta de Reunión Ejecutiva (${today})`;
        type = "minuta";
        category = "Reuniones & Prefectura";
        content = `### Participantes:\n- Hermione Granger (Coordinadora)\n- Ron Weasley (Logística)\n- Harry Potter (Enlace)\n\n### Orden del Día:\n1. Revisión de protocolos de seguridad del castillo.\n2. Presupuesto de insumos para Sortilegios Weasley.\n3. Turnos de patrulla de prefectos.\n\n### Acuerdos & Compromisos:\n- [ ] Hermione: Revisar salvoconducto firmado por McGonagall - Plazo: Mañana\n- [ ] Ron: Auditar stock de bombones desmayo en Bóveda 93 - Plazo: 2 días\n- [ ] Harry: Validar encantamiento Protego en los accesos - Plazo: Fin de semana`;
        break;

      case "pociones":
        title = `Protocolo Alquímico: Formulación de Alta Precisión (${today})`;
        type = "plantilla";
        category = "Pociones & Alquimia";
        content = `### Datos del Preparado:\n* **Poción:** [Nombre de la poción]\n* **Grado de Dificultad:** É.X.T.A.S.I.S.\n* **Tiempo de Ebullición:** 21 días lunares\n* **Color Esperado:** Nácar con vapor en espirales\n\n### Insumos Críticos & Verificación:\n- [ ] 16 onzas de sanguijuelas frescas recolectadas al amanecer\n- [ ] 2 cucharadas de cuerno de bicornio en polvo fino\n- [ ] Piel de serpiente arbórea africana picada con cuchillo de plata\n- [ ] Crisopos macerados durante luna llena\n\n### Pasos Críticos:\n1. Calentar caldero de latón a fuego azul suave.\n2. Añadir bicornio removiendo 4 vueltas hacia la derecha y 1 a la izquierda.`;
        break;

      case "brief":
        title = `Brief de Cliente & Proyecto: Alcance Operativo (${today})`;
        type = "plantilla";
        category = "Comercio Mágico";
        content = `### Datos Generales del Cliente:\n* **Cliente / Entidad:** Sortilegios Weasley S.L.\n* **Responsables:** Fred & George Weasley\n* **Tarifa Acordada:** 55 Galeones / hora facturable\n\n### Objetivos Principales:\n1. Apertura de sucursal en Hogsmeade.\n2. Patentes mágicas para Carameleros Salta-Clases.\n\n### Checklist de Entregables Requeridos:\n- [ ] Alquiler del local en calle mayor de Hogsmeade\n- [ ] Tramitar permisos en el Ministerio de Magia\n- [ ] Diseñar campaña publicitaria con lechuzas mensajeras`;
        break;

      case "semanal":
        title = `Plan Semanal de Alto Enfoque (${today})`;
        type = "plantilla";
        category = "Estrategia Semanal";
        content = `### Objetivo Estrella de la Semana:\n* Consolidar el informe anual de derechos de los elfos (P.E.D.D.O.)\n\n### Las 3 Grandes Victorias:\n- [ ] Victoria 1: Auditar balance de inventario de mazmorras\n- [ ] Victoria 2: Calibración semanal del Giratiempo sin paradojas\n- [ ] Victoria 3: Reunión de balance con Fred & George Weasley\n\n### Hábitos No Negociables:\n- [ ] 30 min de lectura de 'Historia de la Magia'\n- [ ] Cuidado y aperitivos para Crookshanks\n- [ ] Dormir antes de las 22:30`;
        break;

      case "one_on_one":
        title = `Sesión 1:1 de Tutoría & Equipo (${today})`;
        type = "minuta";
        category = "Equipo & Tutoría";
        content = `### Participantes:\n* Mentor/a: Hermione Granger\n* Colaborador/a: [Nombre del Colaborador]\n\n### Puntos Clave de la Charla:\n1. ¿Qué ha ido especialmente bien esta semana?\n2. ¿Qué obstáculos o dificultades técnicas han surgido?\n\n### Compromisos Bilaterales:\n- [ ] Mentor/a: Proveer salvoconducto para la biblioteca restringida\n- [ ] Colaborador/a: Completar el borrador de herbología para el jueves`;
        break;
    }

    const note = window.plannerStore.addNote({
      title: title,
      type: type,
      category: category,
      content: content
    });

    this.selectedNoteId = note.id;
    this.showTemplatePicker = false;
    this.viewMode = 'edit';
    window.plannerAudio.playPageTurn();
    this.render(document.getElementById('planner-active-page'));
  }
}

window.notesModule = new NotesModule();
