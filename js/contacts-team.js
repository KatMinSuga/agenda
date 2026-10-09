/**
 * Módulo de Contactos & Equipo
 * Directorio de clientes/proveedores, seguimiento de interacciones,
 * control de colaboradores, turnos, asistencia y roles.
 */

class ContactsTeamModule {
  constructor() {
    this.activeSection = 'contacts'; // 'contacts' o 'team'
    this.searchQuery = '';
    this.contactFilter = 'all';
  }

  render(container) {
    const contacts = window.plannerStore.get('contacts') || [];
    const team = window.plannerStore.get('team') || [];

    const filteredContacts = contacts.filter(c => {
      if (this.contactFilter !== 'all' && c.type !== this.contactFilter) return false;
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q);
      }
      return true;
    });

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="users"></i> Módulo 05 · Personas & Colaboradores</div>
          <h2 class="planner-page-title">Directorio de Contactos & Equipo</h2>
          <p class="planner-page-desc">Historial de interacciones, seguimientos programados, control de turnos y responsabilidades por departamento.</p>
        </div>
        <div class="header-actions">
          <div class="view-toggle-group">
            <button class="view-toggle-btn ${this.activeSection === 'contacts' ? 'active' : ''}" id="btn-sec-contacts">
              <i data-lucide="contact"></i> Directorio (${contacts.length})
            </button>
            <button class="view-toggle-btn ${this.activeSection === 'team' ? 'active' : ''}" id="btn-sec-team">
              <i data-lucide="badge-check"></i> Equipo (${team.length})
            </button>
          </div>
          <button class="action-btn primary" id="btn-new-contact-modal">
            <i data-lucide="plus"></i> ${this.activeSection === 'contacts' ? 'Nuevo Contacto' : 'Añadir Colaborador'}
          </button>
        </div>
      </div>

      ${this.activeSection === 'contacts' 
        ? this.renderContactsView(filteredContacts) 
        : this.renderTeamView(team)}
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
            <option value="equipo" ${this.contactFilter === 'equipo' ? 'selected' : ''}>Equipo</option>
          </select>
        </div>
      </div>

      <div class="contacts-cards-grid">
        ${contacts.map(c => `
          <div class="contact-business-card type-${c.type}">
            <div class="card-role-strip">
              <span class="type-pill pill-${c.type}">${c.type.toUpperCase()}</span>
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

  renderTeamView(team) {
    return `
      <div class="team-management-grid">
        ${team.map(m => `
          <div class="team-member-card">
            <div class="member-header-row">
              <span class="avatar-large" style="background: ${m.avatarColor || '#9C523B'}">
                ${m.name.charAt(0)}
              </span>
              <div class="member-info">
                <h4>${m.name}</h4>
                <span class="member-dept">${m.department}</span>
                <span class="member-role">${m.role}</span>
              </div>
              <span class="attendance-tag status-${m.attendance.toLowerCase().replace(' ', '-')}">
                ${m.attendance}
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
              <button class="btn-text-sm" onclick="alert('Abriendo chat interno con ${m.name}')">
                <i data-lucide="message-square"></i> Mensaje Interno
              </button>
              <button class="btn-text-sm" onclick="alert('Historial de productividad de ${m.name}')">
                <i data-lucide="bar-chart-2"></i> Productividad
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  attachEvents(container) {
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

    const searchInput = container.querySelector('#contact-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }

    const filterType = container.querySelector('#filter-contact-type');
    if (filterType) {
      filterType.addEventListener('change', (e) => {
        this.contactFilter = e.target.value;
        this.render(container);
      });
    }

    const btnNew = container.querySelector('#btn-new-contact-modal');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        if (this.activeSection === 'contacts') {
          const name = prompt("Nombre completo del contacto:");
          if (name && name.trim()) {
            const company = prompt("Empresa u Organización:", "Empresa S.L.");
            const email = prompt("Correo electrónico:", "contacto@ejemplo.com");
            const phone = prompt("Teléfono:", "+34 600 000 000");
            const type = prompt("Tipo (cliente / proveedor / equipo):", "cliente");

            const contacts = window.plannerStore.get('contacts') || [];
            contacts.unshift({
              id: 'con-' + Date.now(),
              name: name.trim(),
              company: company || "Independiente",
              email: email || "",
              phone: phone || "",
              role: "Responsable",
              type: type || "cliente",
              lastInteraction: "Hoy (Añadido a agenda)",
              nextFollowUp: "Próxima semana",
              notes: ""
            });
            window.plannerStore.saveData();
            this.render(container);
          }
        } else {
          alert('Función de registro de nuevo colaborador del equipo.');
        }
      });
    }
  }
}

window.contactsTeamModule = new ContactsTeamModule();
