/**
 * Módulo 08 · Vida Personal, Hábitos & Metas Trimestrales
 * Menú y diseño para registrar nuevos hábitos, metas u objetivos personales,
 * interfaz balanceada, editable y minimalista con ajuste interactivo de progreso.
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

    // Promedio de progreso en metas trimestrales
    const avgGoalProgress = goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
      : 0;

    container.innerHTML = `
      <div class="module-header">
        <div>
          <div class="planner-page-eyebrow"><i data-lucide="heart"></i> Módulo 08 · Vida Personal & Hábitos</div>
          <h2 class="planner-page-title">Bienestar, Hábitos & Metas Trimestrales</h2>
          <p class="planner-page-desc">Diseño minimalista para balance de vida: rastreo semanal de hábitos, rutinas diarias y metas cuantificables.</p>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" id="btn-add-goal-top">
            <i data-lucide="compass"></i> + Nueva Meta
          </button>
          <button class="action-btn primary" id="btn-add-habit-top">
            <i data-lucide="plus"></i> + Nuevo Hábito
          </button>
        </div>
      </div>

      <!-- Barra de Resumen Minimalista -->
      <div class="personal-summary-strip">
        <div class="sum-pill">
          <i data-lucide="sparkles" style="color:var(--accent-primary);"></i>
          <span>${habits.length} Hábitos activos</span>
        </div>
        <div class="sum-pill">
          <i data-lucide="target" style="color:#226e38;"></i>
          <span>${goals.length} Metas (${avgGoalProgress}% avance promedio)</span>
        </div>
        <div class="sum-pill">
          <i data-lucide="sun" style="color:#b27d32;"></i>
          <span>${routines.filter(r => r.completed).length} de ${routines.length} Rutinas resueltas hoy</span>
        </div>
      </div>

      <div class="personal-grid-layout">
        <!-- Panel 1: Habit Tracker Cuadriculado Semanal -->
        <div class="habit-tracker-card">
          <div class="card-top-row">
            <div>
              <h4><i data-lucide="sparkles"></i> Registro Semanal de Hábitos</h4>
              <span class="sub-label">Haz clic en cada día para marcar tu cumplimiento</span>
            </div>
            <button class="action-btn-xs secondary" id="btn-add-habit-card">
              <i data-lucide="plus"></i> Añadir Hábito
            </button>
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
                  <th style="width:36px;"></th>
                </tr>
              </thead>
              <tbody>
                ${habits.length === 0 ? `
                  <tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No hay hábitos registrados. ¡Crea uno con el botón superior!</td></tr>
                ` : habits.map(h => `
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
                    <td style="text-align:center;">
                      <button class="btn-icon-del-habit" data-habit-id="${h.id}" title="Eliminar hábito">
                        <i data-lucide="trash-2"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Panel 2: Metas & Objetivos Trimestrales Controlables y Editables -->
        <div class="goals-card">
          <div class="card-top-row">
            <div>
              <h4><i data-lucide="compass"></i> Objetivos Personales & Trimestrales</h4>
              <span class="sub-label">Ajusta el porcentaje de progreso con los controles rápidos</span>
            </div>
            <button class="action-btn-xs primary" id="btn-add-goal-card">
              <i data-lucide="plus"></i> Nueva Meta
            </button>
          </div>

          <div class="goals-list-stack">
            ${goals.length === 0 ? `
              <p class="empty-hint">No hay metas trimestrales registradas.</p>
            ` : goals.map(g => `
              <div class="goal-item-box" data-goal-id="${g.id}">
                <div class="goal-info-row">
                  <div style="flex:1;">
                    <div class="goal-title-line">
                      <strong>${g.title}</strong>
                      <button class="btn-icon-del-goal" data-goal-id="${g.id}" title="Eliminar objetivo">&times;</button>
                    </div>
                    <span class="goal-cat">${g.category || 'General'} · Meta: ${g.targetDate || 'Trimestre actual'}</span>
                  </div>
                  
                  <!-- Controles de progreso interactivo -->
                  <div class="goal-progress-controls">
                    <button class="btn-goal-step minus" data-goal-id="${g.id}" data-delta="-5" title="Restar 5%">-5%</button>
                    <span class="goal-pct font-bold">${g.progress || 0}%</span>
                    <button class="btn-goal-step plus" data-goal-id="${g.id}" data-delta="5" title="Sumar 5%">+5%</button>
                  </div>
                </div>

                <div class="goal-progress-bar">
                  <div class="fill ${g.progress >= 100 ? 'done' : ''}" style="width: ${Math.min(100, g.progress || 0)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Panel 3: Rutinas Diarias de Enfoque -->
        <div class="routines-card">
          <div class="card-top-row">
            <div>
              <h4><i data-lucide="sun"></i> Rutinas de Enfoque</h4>
              <span class="sub-label">Mañana / Tarde / Noche</span>
            </div>
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

        <!-- Panel 4: Lista de Compras & Pendientes Personales -->
        <div class="shopping-card">
          <div class="card-top-row">
            <div>
              <h4><i data-lucide="shopping-bag"></i> Lista de Compras & Suministros</h4>
              <span class="sub-label">${shoppingList.filter(i => i.bought).length} de ${shoppingList.length} adquiridos</span>
            </div>
          </div>

          <!-- Input Rápido para Añadir Artículo sin Prompt -->
          <div class="quick-shop-input-bar">
            <input type="text" id="input-quick-shopping" class="form-input-sm" placeholder="Añadir artículo a comprar...">
            <button class="action-btn-xs primary" id="btn-quick-add-shop">
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
    // 1. Alternar estado diario del hábito
    container.querySelectorAll('[data-action="toggle-habit-day"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const habitId = e.currentTarget.dataset.habitId;
        const dateStr = e.currentTarget.dataset.date;
        window.plannerStore.toggleHabit(habitId, dateStr);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // 2. Eliminar hábito
    container.querySelectorAll('.btn-icon-del-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hId = e.currentTarget.dataset.habitId;
        if (confirm("¿Deseas eliminar este hábito de tu seguimiento?")) {
          window.plannerStore.deletePersonalHabit(hId);
          this.render(container);
        }
      });
    });

    // 3. Ajuste de progreso interactivo en metas (-5% / +5%)
    container.querySelectorAll('.btn-goal-step').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gId = e.currentTarget.dataset.goalId;
        const delta = parseInt(e.currentTarget.dataset.delta, 10);
        const personal = window.plannerStore.get('personal') || {};
        const goal = (personal.goals || []).find(g => g.id === gId);
        if (goal) {
          const newProgress = Math.max(0, Math.min(100, (goal.progress || 0) + delta));
          window.plannerStore.updatePersonalGoal(gId, { progress: newProgress });
          window.plannerAudio.playCheck();
          this.render(container);
        }
      });
    });

    // 4. Eliminar meta
    container.querySelectorAll('.btn-icon-del-goal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gId = e.currentTarget.dataset.goalId;
        if (confirm("¿Deseas eliminar este objetivo trimestral?")) {
          window.plannerStore.deletePersonalGoal(gId);
          this.render(container);
        }
      });
    });

    // 5. Alternar rutina
    container.querySelectorAll('[data-action="toggle-routine"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const routineId = e.currentTarget.dataset.routineId;
        window.plannerStore.toggleRoutine(routineId);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // 6. Alternar item de compras
    container.querySelectorAll('[data-action="toggle-shopping-item"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const itemId = e.target.dataset.itemId;
        window.plannerStore.toggleShoppingItem(itemId);
        window.plannerAudio.playCheck();
        this.render(container);
      });
    });

    // 7. Input rápido para compras
    const btnShop = container.querySelector('#btn-quick-add-shop');
    const inputShop = container.querySelector('#input-quick-shopping');
    const addShopItem = () => {
      if (inputShop && inputShop.value.trim()) {
        window.plannerStore.addShoppingItem({
          item: inputShop.value.trim(),
          category: "Personal & Hogwarts",
          bought: false
        });
        inputShop.value = '';
        window.plannerAudio.playCheck();
        this.render(container);
      }
    };

    if (btnShop) btnShop.addEventListener('click', addShopItem);
    if (inputShop) {
      inputShop.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addShopItem();
      });
    }

    // 8. Botones para abrir Modal de Registro Personal (Hábito o Meta)
    const btnAddHabitTop = container.querySelector('#btn-add-habit-top');
    const btnAddHabitCard = container.querySelector('#btn-add-habit-card');
    const btnAddGoalTop = container.querySelector('#btn-add-goal-top');
    const btnAddGoalCard = container.querySelector('#btn-add-goal-card');

    const openPersonalModal = (kind) => {
      const modal = document.getElementById('personal-item-modal');
      if (!modal) return;

      const kindSelect = document.getElementById('modal-personal-kind');
      const habitFields = document.getElementById('personal-fields-habit');
      const goalFields = document.getElementById('personal-fields-goal');

      if (kindSelect) {
        kindSelect.value = kind;
        if (kind === 'habit') {
          if (habitFields) habitFields.style.display = 'block';
          if (goalFields) goalFields.style.display = 'none';
        } else {
          if (habitFields) habitFields.style.display = 'none';
          if (goalFields) goalFields.style.display = 'block';
        }

        kindSelect.onchange = (e) => {
          if (e.target.value === 'habit') {
            if (habitFields) habitFields.style.display = 'block';
            if (goalFields) goalFields.style.display = 'none';
          } else {
            if (habitFields) habitFields.style.display = 'none';
            if (goalFields) goalFields.style.display = 'block';
          }
        };
      }

      modal.classList.add('open');
    };

    if (btnAddHabitTop) btnAddHabitTop.addEventListener('click', () => openPersonalModal('habit'));
    if (btnAddHabitCard) btnAddHabitCard.addEventListener('click', () => openPersonalModal('habit'));
    if (btnAddGoalTop) btnAddGoalTop.addEventListener('click', () => openPersonalModal('goal'));
    if (btnAddGoalCard) btnAddGoalCard.addEventListener('click', () => openPersonalModal('goal'));
  }
}

window.personalModule = new PersonalModule();
