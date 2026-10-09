/**
 * Módulo 05 · Directorio de Contactos & Gestión de Colaboradores / Equipos
 * Menú y diseño para agregar colaboradores desde "Nuevo Contacto",
 * asignación directa de contactos registrados a grupos/equipos y control de turnos.
 */

class ContactsTeamModule {
  constructor() {
    this.activeSection = 'contacts'; // 'contacts' o 'team'
    this.searchQuery = '';
    this.contactFilter = 'all';
    this.departmentFilter = 'all';
  }

  render(container) {
    const contacts = window.plannerStore.get('contacts') || [];
    const team = window.plannerStore.get('team') || [];

    const filteredContacts = contacts.filter(c => {
      if (this.contactFilter !== 'all' && c.type !== this.contactFilter) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q) || (c.role || '').toLowerCase().includes(q);
      }
      return true;
    });

    const filteredTeam = team.filter(m => {
      if (this.departmentFilter !== 'all' && m.department !== this.departmentFilter) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || (m.role || '').toLowerCase().includes(q) || (m.department || '').toLowerCase().includes(q);
      }
      return true;
    });

    // Departamentos/Grupos únicos
    const departments = Array.from(new Set(team.map(m => m.department).filter(Boolean)));

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="users"></i> Módulo 05 · Personas & Colaboradores</div>
          <h2 class="planner-page-title">Directorio de Contactos & Equipos</h2>
          <p class="planner-page-desc">Registra contactos con opción de asignarlos directamente a un equipo y gestiona la asignación de contactos existentes a grupos de trabajo.</p>
        </div>
        <div class="header-actions">
          <div class="view-toggle-group">
            <button class="view-toggle-btn ${this.activeSection === 'contacts' ? 'active' : ''}" id="btn-sec-contacts">
              <i data-lucide="contact"></i> Directorio (${contacts.length})
            </button>
            <button class="view-toggle-btn ${this.activeSection === 'team' ? 'active' : ''}" id="btn-sec-team">
              <i data-lucide="badge-check"></i> Equipo & Grupos (${team.length})
            </button>
          </div>
          
          <div class="header-buttons-group" style="display:flex; gap:8px;">
            ${this.activeSection === 'contacts' ? `
              <button class="action-btn secondary" id="btn-header-assign-contact">
                <i data-lucide="shield-plus"></i> Asignar a Equipo
              </button>
              <button class="action-btn primary" id="btn-header-add-contact">
                <i data-lucide="user-plus"></i> + Nuevo Contacto
              </button>
            ` : `
              <button class="action-btn secondary" id="btn-header-assign-existing-collab">
                <i data-lucide="user-check"></i> + Asignar Contacto Registrado
              </button>
              <button class="action-btn primary" id="btn-header-add-collab-direct">
                <i data-lucide="plus"></i> + Nuevo Colaborador
              </button>
            `}
          </div>
        </div>
      </div>

      ${this.activeSection === 'contacts' 
        ? this.renderContactsView(filteredContacts, team) 
        : this.renderTeamView(filteredTeam, departments, contacts)}
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderContactsView(contacts, team) {
    return `
      <div class="contacts-toolbar">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="contact-search-input" placeholder="Buscar por nombre, empresa, especialidad..." value="${this.searchQuery}">
        </div>
        <div class="filter-dropdowns">
          <select id="filter-contact-type" class="form-select-sm">
            <option value="all" ${this.contactFilter === 'all' ? 'selected' : ''}>Todos los Tipos</option>
            <option value="aliado" ${this.contactFilter === 'aliado' ? 'selected' : ''}>Aliados Estratégicos</option>
            <option value="profesor" ${this.contactFilter === 'profesor' ? 'selected' : ''}>Claustro Hogwarts</option>
            <option value="cliente" ${this.contactFilter === 'cliente' ? 'selected' : ''}>Clientes</option>
            <option value="proveedor" ${this.contactFilter === 'proveedor' ? 'selected' : ''}>Proveedores</option>
            <option value="institucional" ${this.contactFilter === 'institucional' ? 'selected' : ''}>Institucional</option>
          </select>
        </div>
      </div>

      <div class="contacts-cards-grid">
        ${contacts.map(c => {
          const inTeam = team.find(m => m.contactId === c.id || m.name.toLowerCase() === c.name.toLowerCase());

          return `
            <div class="contact-business-card type-${c.type || 'aliado'}">
              <div class="card-role-strip">
                <span class="type-pill pill-${c.type || 'aliado'}">${(c.type || 'contacto').toUpperCase()}</span>
                <span class="company-tag">${c.company || 'Independiente'}</span>
              </div>

              <div class="contact-main">
                <div class="contact-avatar-round">${c.name.charAt(0)}</div>
                <div>
                  <h4 class="contact-person-name">${c.name}</h4>
                  <div class="contact-job-title">${c.role || 'Especialista'}</div>
                </div>
              </div>

              <div class="contact-details-list">
                <div class="detail-row">
                  <i data-lucide="mail"></i>
                  <a href="mailto:${c.email}">${c.email || 'Sin correo'}</a>
                </div>
                ${c.phone ? `
                  <div class="detail-row">
                    <i data-lucide="phone"></i>
                    <span>${c.phone}</span>
                  </div>
                ` : ''}
              </div>

              <div class="contact-interaction-box">
                <div class="box-label">Última interacción:</div>
                <div class="box-text">${c.lastInteraction || 'Sin registro reciente'}</div>
                <div class="box-label follow-up">Próximo seguimiento:</div>
                <div class="box-text highlight">${c.nextFollowUp || 'No programado'}</div>
              </div>

              ${c.notes ? `
                <div class="contact-notes-mini">
                  <i data-lucide="sticky-note"></i> <em>"${c.notes}"</em>
                </div>
              ` : ''}

              <!-- TIRA DE ASIGNACIÓN A GRUPO / EQUIPO -->
              <div class="contact-team-footer-strip">
                ${inTeam ? `
                  <div class="contact-in-team-badge">
                    <span class="badge-text"><i data-lucide="shield-check"></i> En Equipo: <strong>${inTeam.department}</strong></span>
                    <button class="btn-text-xs btn-reassign-contact-team" data-contact-id="${c.id}" data-current-dept="${inTeam.department}" title="Cambiar a otro grupo o equipo">
                      <i data-lucide="git-branch"></i> Cambiar
                    </button>
                  </div>
                ` : `
                  <button class="action-btn-xs secondary btn-add-contact-to-team" data-contact-id="${c.id}" title="Agregar este contacto a un grupo o equipo">
                    <i data-lucide="user-plus"></i> + Añadir a Grupo / Equipo
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderTeamView(team, departments, contacts) {
    return `
      <!-- Toolbar de Equipos con Selector de Grupos -->
      <div class="contacts-toolbar">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="team-search-input" placeholder="Buscar colaborador por nombre, grupo o cargo..." value="${this.searchQuery}">
        </div>
        <div class="filter-dropdowns">
          <select id="filter-team-dept" class="form-select-sm">
            <option value="all" ${this.departmentFilter === 'all' ? 'selected' : ''}>Todos los Grupos & Equipos</option>
            ${departments.map(d => `
              <option value="${d}" ${this.departmentFilter === d ? 'selected' : ''}>👥 ${d}</option>
            `).join('')}
          </select>
          <button class="action-btn-xs secondary" id="btn-toolbar-assign-existing" title="Incorporar un contacto existente del directorio al equipo">
            <i data-lucide="user-check"></i> + Asignar Contacto Registrado
          </button>
          <button class="action-btn-xs primary" id="btn-modal-add-collab-direct">
            <i data-lucide="plus"></i> Nuevo Colaborador
          </button>
        </div>
      </div>

      <div class="team-management-grid">
        ${team.map(m => {
          // Buscar si está vinculado a un contacto del directorio
          const linkedContact = contacts.find(c => c.id === m.contactId || c.name.toLowerCase() === m.name.toLowerCase());

          return `
            <div class="team-member-card" data-member-id="${m.id}">
              <div class="member-header-row">
                <span class="avatar-large" style="background: ${m.avatarColor || '#9C523B'}">
                  ${m.name.charAt(0)}
                </span>
                <div class="member-info">
                  <h4>${m.name}</h4>
                  <div class="member-group-badge">
                    <i data-lucide="shield"></i> <span>${m.department}</span>
                  </div>
                  <span class="member-role">${m.role}</span>
                </div>
                <span class="attendance-tag status-${(m.attendance || 'presente').toLowerCase().replace(/\s+/g, '-')}">
                  ${m.attendance || 'Presente'}
                </span>
              </div>

              <div class="member-stats-row">
                <div class="stat-cell">
                  <span class="label">Turno / Horario</span>
                  <span class="val">${m.shift}</span>
                </div>
                <div class="stat-cell">
                  <span class="label">Tareas Asignadas</span>
                  <span class="val font-bold">${m.tasksAssigned || 0} activas</span>
                </div>
                <div class="stat-cell">
                  <span class="label">Email Directo</span>
                  <span class="val">${m.email || (linkedContact ? linkedContact.email : 'Sin email')}</span>
                </div>
              </div>

              <div class="member-actions-strip">
                <button class="btn-text-sm btn-reassign-dept" data-member-id="${m.id}" data-current-dept="${m.department}">
                  <i data-lucide="git-branch"></i> Cambiar Grupo/Equipo
                </button>
                <button class="btn-text-sm" onclick="alert('Abriendo canal interno con ${m.name} (${m.department})')">
                  <i data-lucide="message-square"></i> Mensaje Interno
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  attachEvents(container) {
    // Alternar Directorio vs Equipo
    const btnSecContacts = container.querySelector('#btn-sec-contacts');
    const btnSecTeam = container.querySelector('#btn-sec-team');

    if (btnSecContacts && btnSecTeam) {
      btnSecContacts.addEventListener('click', () => {
        this.activeSection = 'contacts';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
      btnSecTeam.addEventListener('click', () => {
        this.activeSection = 'team';
        this.render(container);
        window.plannerAudio.playTabClick();
      });
    }

    // Buscador
    const searchInput = container.querySelector('#contact-search-input') || container.querySelector('#team-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }

    // Filtros
    const filterType = container.querySelector('#filter-contact-type');
    if (filterType) {
      filterType.addEventListener('change', (e) => {
        this.contactFilter = e.target.value;
        this.render(container);
      });
    }

    const filterDept = container.querySelector('#filter-team-dept');
    if (filterDept) {
      filterDept.addEventListener('change', (e) => {
        this.departmentFilter = e.target.value;
        this.render(container);
      });
    }

    // Botón "+ Nuevo Contacto" (Abre modal limpio de nuevo contacto)
    const btnHeaderAddContact = container.querySelector('#btn-header-add-contact');
    if (btnHeaderAddContact) {
      btnHeaderAddContact.addEventListener('click', () => {
        this.openContactModal();
      });
    }

    // Botón "Asignar a Equipo" desde cabecera de contactos
    const btnHeaderAssign = container.querySelector('#btn-header-assign-contact');
    if (btnHeaderAssign) {
      btnHeaderAssign.addEventListener('click', () => {
        this.openAssignContactModal();
      });
    }

    // Botones "+ Asignar Contacto Registrado" en sección de Equipo
    const btnHeaderAssignExisting = container.querySelector('#btn-header-assign-existing-collab');
    const btnToolbarAssignExisting = container.querySelector('#btn-toolbar-assign-existing');
    [btnHeaderAssignExisting, btnToolbarAssignExisting].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.openAssignContactModal();
        });
      }
    });

    // Botón "+ Nuevo Colaborador" directo
    const btnAddCollabDirect = container.querySelector('#btn-header-add-collab-direct') || container.querySelector('#btn-modal-add-collab-direct');
    if (btnAddCollabDirect) {
      btnAddCollabDirect.addEventListener('click', () => {
        this.openCollaboratorModal();
      });
    }

    // Botón "+ Añadir a Grupo / Equipo" en tarjeta de contacto individual
    container.querySelectorAll('.btn-add-contact-to-team').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const contactId = e.currentTarget.dataset.contactId;
        this.openAssignContactModal(contactId);
      });
    });

    // Botón "Cambiar" en tarjeta de contacto que ya está en equipo
    container.querySelectorAll('.btn-reassign-contact-team').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const contactId = e.currentTarget.dataset.contactId;
        this.openAssignContactModal(contactId);
      });
    });

    // Reasignar grupo de colaborador desde la tarjeta de equipo
    container.querySelectorAll('.btn-reassign-dept').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const memId = e.currentTarget.dataset.memberId;
        const currentDept = e.currentTarget.dataset.currentDept;
        const team = window.plannerStore.get('team') || [];
        const member = team.find(m => m.id === memId);
        if (member) {
          const newDept = prompt(`Reasignar grupo/equipo para ${member.name}:\n(Actualmente: ${currentDept})`, currentDept);
          if (newDept && newDept.trim()) {
            member.department = newDept.trim();
            window.plannerStore.saveData();
            window.plannerAudio.playCheck();
            this.render(container);
          }
        }
      });
    });
  }

  // Modal Nuevo Contacto (con opción de asignar a equipo)
  openContactModal() {
    const modal = document.getElementById('contact-editor-modal');
    if (modal) {
      modal.classList.add('open');
      const form = document.getElementById('form-modal-contact');
      if (form) form.reset();

      const teamLinkCheck = document.getElementById('modal-contact-link-team');
      const teamFields = document.getElementById('modal-contact-team-fields');
      if (teamLinkCheck && teamFields) {
        teamFields.style.display = 'none';
        teamLinkCheck.checked = false;
        teamLinkCheck.onchange = () => {
          teamFields.style.display = teamLinkCheck.checked ? 'block' : 'none';
        };
      }

      const nameInput = document.getElementById('modal-contact-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 80);
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // Modal Asignar Contacto Registrado a Equipo
  openAssignContactModal(preselectedContactId = null) {
    const modal = document.getElementById('assign-contact-team-modal');
    const select = document.getElementById('modal-assign-contact-select');
    const contacts = window.plannerStore.get('contacts') || [];

    if (!modal || !select) return;

    // Llenar selector de contactos
    select.innerHTML = contacts.map(c => `
      <option value="${c.id}" ${preselectedContactId === c.id ? 'selected' : ''}>
        ${c.name} (${c.company || 'Independiente'} · ${c.role || 'Contacto'})
      </option>
    `).join('');

    const updatePreview = () => {
      const selectedId = select.value;
      const found = contacts.find(c => c.id === selectedId);
      const nameEl = document.getElementById('modal-assign-preview-name');
      const detailsEl = document.getElementById('modal-assign-preview-details');
      const roleInput = document.getElementById('modal-assign-role');

      if (found) {
        if (nameEl) nameEl.textContent = found.name;
        if (detailsEl) detailsEl.textContent = `${found.company || 'Hogwarts'} · ${found.role || 'Especialista'} · ${found.email || 'Sin correo'}`;
        if (roleInput && !roleInput.value) roleInput.value = found.role || 'Colaborador Especialista';
      }
    };

    select.onchange = updatePreview;
    updatePreview();

    modal.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  }

  // Modal Colaborador Directo
  openCollaboratorModal() {
    const modal = document.getElementById('collaborator-editor-modal');
    if (modal) {
      modal.classList.add('open');
      const nameInput = document.getElementById('modal-collab-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 80);
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

window.contactsTeamModule = new ContactsTeamModule();
