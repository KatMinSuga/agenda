/**
 * Módulo de Organización Personal & Balance de Vida
 * Rastreador de hábitos semanal interactivo estilo Notes,
 * rutinas diarias, metas de vida y lista de compras.
 */

class PersonalModule {
  constructor() {
    this.weekDates = [
      { date: "2026-10-05", label: "L" },
      { date: "2026-10-06", label: "M" },
      { date: "2026-10-07", label: "X" },
      { date: "2026-10-08", label: "J", isToday: true },
      { date: "2026-10-09", label: "V" },
      { date: "2026-10-10", label: "S" },
      { date: "2026-10-11", label: "D" }
    ];
  }

  render(container) {
    const personal = window.plannerStore.get('personal') || { habits: [], routines: [], goals: [], shoppingList: [] };
    const habits = personal.habits || [];
    const routines = personal.routines || [];
    const goals = personal.goals || [];
    const shoppingList = personal.shoppingList || [];

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="heart"></i> Módulo 08 · Vida Personal & Hábitos</div>
          <h2 class="planner-page-title">Bienestar, Hábitos & Metas Personales</h2>
          <p class="planner-page-desc">El alto rendimiento requiere descanso intencional y constancia. Rastrea tus hábitos y equilibra tu vida.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn primary" id="btn-add-habit">
            <i data-lucide="plus"></i> Nuevo Hábito
          </button>
        </div>
      </div>

      <div class="personal-grid-layout">
        <!-- Panel 1: Habit Tracker Cuadriculado Semanal -->
        <div class="habit-tracker-card">
          <div class="card-top-row">
            <h4><i data-lucide="sparkles"></i> Registro de Hábitos de la Semana</h4>
            <span class="badge-streak-fire">🔥 Mantén tu racha activa</span>
          </div>

          <div class="habit-table-responsive">
            <table class="habit-tracker-table">
              <thead>
                <tr>
                  <th class="habit-name-col">Hábito</th>
                  ${this.weekDates.map(d => `
                    <th class="habit-day-col ${d.isToday ? 'is-today-col' : ''}">
                      <span class="day-letter">${d.label}</span>
                      <span class="day-num">${d.date.slice(-2)}</span>
                    </th>
                  `).join('')}
                  <th class="habit-streak-col">Racha</th>
                </tr>
              </thead>
              <tbody>
                ${habits.map(h => `
                  <tr class="habit-row" data-habit-id="${h.id}">
                    <td class="habit-title-cell">
                      <span class="habit-icon">${h.icon || '✓'}</span>
                      <span class="habit-text">${h.name}</span>
                    </td>
                    ${this.weekDates.map(d => {
                      const isDone = h.days && h.days[d.date];
                      return `
                        <td class="habit-check-cell ${d.isToday ? 'is-today-cell' : ''}">
                          <button class="habit-bubble ${isDone ? 'checked' : ''}" data-action="toggle-habit-day" data-habit-id="${h.id}" data-date="${d.date}">
                            <i data-lucide="${isDone ? 'check' : 'circle'}"></i>
                          </button>
                        </td>
                      `;
                    }).join('')}
                    <td class="habit-streak-cell">
                      <span class="streak-pill"><strong>${h.streak || 0}</strong> días</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Panel 2: Rutinas Diarias de Enfoque -->
        <div class="routines-card">
          <div class="card-top-row">
            <h4><i data-lucide="sun"></i> Rutinas Diarias</h4>
            <span class="sub-label">Mañana / Tarde / Noche</span>
          </div>
          <div class="routines-stack">
            ${routines.map(r => `
              <div class="routine-box period-${r.period}">
                <div class="routine-title-bar">
                  <div class="routine-period-tag">
                    <i data-lucide="${r.period === 'manana' ? 'sunrise' : (r.period === 'tarde' ? 'sun' : 'moon')}"></i>
                    <span>${r.title} (${r.time})</span>
                  </div>
                  <button class="btn-routine-toggle ${r.completed ? 'completed' : ''}" data-action="toggle-routine" data-routine-id="${r.id}">
                    <i data-lucide="${r.completed ? 'check-circle-2' : 'circle'}"></i>
                    ${r.completed ? 'Completada' : 'Marcar lista'}
                  </button>
                </div>
                <ul class="routine-items-list">
                  ${(r.items || []).map(item => `
                    <li><i data-lucide="arrow-right-circle"></i> ${item}</li>
                  `).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Panel 3: Metas & Objetivos de Vida -->
        <div class="goals-card">
          <h4><i data-lucide="compass"></i> Objetivos Personales & Trimestrales</h4>
          <div class="goals-list-stack">
            ${goals.map(g => `
              <div class="goal-item-box">
                <div class="goal-info-row">
                  <div>
                    <strong>${g.title}</strong>
                    <span class="goal-cat">${g.category} · Meta: ${g.targetDate}</span>
                  </div>
                  <span class="goal-pct">${g.progress}%</span>
                </div>
                <div class="goal-progress-bar">
                  <div class="fill" style="width: ${g.progress}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Panel 4: Lista de Compras & Pendientes Personales -->
        <div class="shopping-card">
          <div class="card-top-row">
            <h4><i data-lucide="shopping-bag"></i> Lista de Compras & Suministros</h4>
            <button class="action-btn-xs" id="btn-add-shopping-item">
              <i data-lucide="plus"></i> Añadir
            </button>
          </div>
          <div class="shopping-checklist">
            ${shoppingList.map(item => `
              <label class="shopping-check-row ${item.bought ? 'is-bought' : ''}">
                <input type="checkbox" ${item.bought ? 'checked' : ''} data-action="toggle-shopping-item" data-item-id="${item.id}">
                <span class="shopping-text">${item.item}</span>
                <span class="shopping-cat-badge">${item.category}</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.attachEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  attachEvents(container) {
    // Toggle habit bubble
    container.querySelectorAll('[data-action="toggle-habit-day"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const habitId = e.currentTarget.dataset.habitId;
        const dateStr = e.currentTarget.dataset.date;
        window.plannerStore.toggleHabit(habitId, dateStr);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // Toggle routine
    container.querySelectorAll('[data-action="toggle-routine"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const routineId = e.currentTarget.dataset.routineId;
        window.plannerStore.toggleRoutine(routineId);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // Toggle shopping item
    container.querySelectorAll('[data-action="toggle-shopping-item"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const itemId = e.target.dataset.itemId;
        window.plannerStore.toggleShoppingItem(itemId);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // Add shopping item
    const btnAddShop = container.querySelector('#btn-add-shopping-item');
    if (btnAddShop) {
      btnAddShop.addEventListener('click', () => {
        const item = prompt("Artículo a comprar:");
        if (item && item.trim()) {
          const cat = prompt("Categoría (Oficina, Tecnología, Hogar, etc.):", "Oficina");
          window.plannerStore.addShoppingItem({
            item: item.trim(),
            category: cat || "Varios",
            bought: false
          });
          this.render(container);
        }
      });
    }

    // Add habit
    const btnAddHabit = container.querySelector('#btn-add-habit');
    if (btnAddHabit) {
      btnAddHabit.addEventListener('click', () => {
        const name = prompt("Nombre del nuevo hábito:");
        if (name && name.trim()) {
          const icon = prompt("Emoji representativo:", "✨");
          const habits = window.plannerStore.data.personal.habits;
          habits.push({
            id: 'hab-' + Date.now(),
            name: name.trim(),
            icon: icon || "✓",
            streak: 0,
            days: {}
          });
          window.plannerStore.saveData();
          this.render(container);
        }
      });
    }
  }
}

window.personalModule = new PersonalModule();
