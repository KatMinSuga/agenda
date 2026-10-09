/**
 * Módulo 05 · Directorio de Contactos & Gestión de Colaboradores / Equipos
 * Menú y diseño para agregar colaboradores desde "Nuevo Contacto",
 * asignación directa a grupos/equipos y control de turnos y responsabilidades.
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
        return c.name.toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q);
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

    // Grupos/Departamentos únicos
    const departments = Array.from(new Set(team.map(m => m.department).filter(Boolean)));

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="users"></i> Módulo 05 · Personas & Colaboradores</div>
          <h2 class="planner-page-title">Directorio de Contactos & Equipo</h2>
          <p class="planner-page-desc">Gestión integral de colaboradores asignados a grupos de trabajo y libreta de contactos clave con seguimiento.</p>
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
          
          <!-- Botón / Menú para Nuevo Contacto o Colaborador -->
          <div class="dropdown-action-wrap">
            <button class="action-btn primary" id="btn-open-add-person-menu">
              <i data-lucide="user-plus"></i> ${this.activeSection === 'contacts' ? '+ Nuevo Contacto' : '+ Añadir a Equipo'}
            </button>
          </div>
        </div>
      </div>

      ${this.activeSection === 'contacts' 
        ? this.renderContactsView(filteredContacts) 
        : this.renderTeamView(filteredTeam, departments)}
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  renderContactsView(contacts) {
    return `
      <div class="contacts-toolbar">
        <div class="search-input-wrapper">
          <i data-lucide="search"></i>
          <input type="text" id="contact-search-input" placeholder="Buscar por nombre, empresa o cargo..." value="${this.searchQuery}">
        </div>
        <div class="filter-dropdowns">
          <select id="filter-contact-type" class="form-select-sm">
            <option value="all" ${this.contactFilter === 'all' ? 'selected' : ''}>Todos los Tipos</option>
            <option value="cliente" ${this.contactFilter === 'cliente' ? 'selected' : ''}>Clientes</option>
            <option value="proveedor" ${this.contactFilter === 'proveedor' ? 'selected' : ''}>Proveedores</option>
            <option value="aliado" ${this.contactFilter === 'aliado' ? 'selected' : ''}>Aliados</option>
            <option value="profesor" ${this.contactFilter === 'profesor' ? 'selected' : ''}>Claustro Hogwarts</option>
          </select>
        </div>
      </div>

      <div class="contacts-cards-grid">
        ${contacts.map(c => `
          <div class="contact-business-card type-${c.type}">
            <div class="card-role-strip">
              <span class="type-pill pill-${c.type}">${(c.type || 'contacto').toUpperCase()}</span>
              <span class="company-tag">${c.company}</span>
            </div>

            <div class="contact-main">
              <div class="contact-avatar-round">${c.name.charAt(0)}</div>
              <div>
                <h4 class="contact-person-name">${c.name}</h4>
                <div class="contact-job-title">${c.role}</div>
              </div>
            </div>

            <div class="contact-details-list">
              <div class="detail-row">
                <i data-lucide="mail"></i>
                <a href="mailto:${c.email}">${c.email}</a>
              </div>
              <div class="detail-row">
                <i data-lucide="phone"></i>
                <a href="tel:${c.phone}">${c.phone}</a>
              </div>
            </div>

            <div class="contact-interaction-box">
              <div class="box-label">Última interacción:</div>
              <div class="box-text">${c.lastInteraction}</div>
              <div class="box-label follow-up">Próximo seguimiento:</div>
              <div class="box-text highlight">${c.nextFollowUp}</div>
            </div>

            ${c.notes ? `
              <div class="contact-notes-mini">
                <i data-lucide="sticky-note"></i> <em>"${c.notes}"</em>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  renderTeamView(team, departments) {
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
          <button class="action-btn-xs primary" id="btn-modal-add-collab-direct">
            <i data-lucide="plus"></i> Nuevo Colaborador
          </button>
        </div>
      </div>

      <div class="team-management-grid">
        ${team.map(m => `
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
                <span class="val font-bold">${m.tasksAssigned} activas</span>
              </div>
              <div class="stat-cell">
                <span class="label">Email Directo</span>
                <span class="val">${m.email}</span>
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
        `).join('')}
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

    // Filtro por tipo de contacto
    const filterType = container.querySelector('#filter-contact-type');
    if (filterType) {
      filterType.addEventListener('change', (e) => {
        this.contactFilter = e.target.value;
        this.render(container);
      });
    }

    // Filtro por grupo/departamento
    const filterDept = container.querySelector('#filter-team-dept');
    if (filterDept) {
      filterDept.addEventListener('change', (e) => {
        this.departmentFilter = e.target.value;
        this.render(container);
      });
    }

    // Botón principal de añadir personas
    const btnAddPerson = container.querySelector('#btn-open-add-person-menu');
    if (btnAddPerson) {
      btnAddPerson.addEventListener('click', () => {
        if (this.activeSection === 'team') {
          this.openCollaboratorModal();
        } else {
          // Menú para escoger qué tipo de persona registrar
          const choice = prompt("¿Qué deseas registrar?\n1 - Añadir Colaborador a Grupo/Equipo\n2 - Registrar Contacto Externo (Directorio)", "1");
          if (choice === "1") {
            this.openCollaboratorModal();
          } else if (choice === "2") {
            const name = prompt("Nombre completo del contacto:");
            if (name && name.trim()) {
              const company = prompt("Empresa u Organización:", "Ministerio de Magia");
              const email = prompt("Correo electrónico:", "contacto@hogwarts.ac.uk");
              const phone = prompt("Teléfono / Lechucería:", "+44 20 7946 0000");
              const type = prompt("Tipo (cliente, proveedor, aliado, profesor):", "aliado");
              const role = prompt("Cargo o Puesto:", "Especialista");

              const contacts = window.plannerStore.get('contacts') || [];
              contacts.unshift({
                id: 'con-' + Date.now(),
                name: name.trim(),
                company: company || "Independiente",
                email: email || "",
                phone: phone || "",
                role: role || "Contacto",
                type: type || "aliado",
                lastInteraction: "Hoy (Registro inicial)",
                nextFollowUp: "Próxima semana",
                notes: "Contacto registrado en el directorio de la agenda."
              });
              window.plannerStore.saveData();
              window.plannerAudio.playCheck();
              this.render(container);
            }
          }
        }
      });
    }

    // Botón directo para añadir colaborador
    const btnDirectCollab = container.querySelector('#btn-modal-add-collab-direct');
    if (btnDirectCollab) {
      btnDirectCollab.addEventListener('click', () => {
        this.openCollaboratorModal();
      });
    }

    // Reasignar grupo/departamento
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

  openCollaboratorModal() {
    const modal = document.getElementById('collaborator-editor-modal');
    if (modal) {
      modal.classList.add('open');
      const nameInput = document.getElementById('modal-collab-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 80);
    }
  }
}

window.contactsTeamModule = new ContactsTeamModule();
