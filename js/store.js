/**
 * Planificador Digital Notes Web - Store Central & Persistencia
 * Almacenamiento reactivo en LocalStorage con backup JSON y datos muestra profesionales.
 */

const STORAGE_KEY = 'notes_planner_db_v1';

const INITIAL_DATA = {
  profile: {
    name: "Carolina Méndez",
    role: "Directora Ejecutiva & Asistente Virtual Estratégica",
    business: "Méndez Executive Ops",
    email: "carolina@mendezops.com",
    avatar: "CM",
    dailyFocusScore: 92
  },
  settings: {
    theme: "caramel", // caramel, rose, midnight, sage
    soundEnabled: true,
    zenMode: false,
    activeTab: "dashboard",
    currency: "USD ($)",
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5
  },
  tasks: [
    {
      id: "tsk-1",
      title: "Revisar y auditar informe financiero Q3 para Cliente Alpha",
      description: "Comparar proyecciones con gastos reales y preparar diapositivas de resumen ejecutivo.",
      startDate: "2026-10-08",
      dueDate: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00",
      priority: "urgente", // baja, media, alta, urgente
      status: "en_proceso", // pendiente, en_proceso, completada, cancelada
      category: "Finanzas & VA",
      tags: ["Auditoría", "Cliente Alpha", "Q3"],
      projectId: "prj-1",
      clientId: "cli-1",
      assigneeId: "mem-1",
      recurrent: null,
      subtasks: [
        { id: "sub-1", title: "Descargar libro mayor de Stripe y QuickBooks", completed: true },
        { id: "sub-2", title: "Conciliar discrepancia de $450 en software", completed: true },
        { id: "sub-3", title: "Generar gráfico de margen neto en Excel", completed: false },
        { id: "sub-4", title: "Redactar 3 puntos clave de optimización", completed: false }
      ]
    },
    {
      id: "tsk-2",
      title: "Reunión de alineación semanal con equipo de desarrollo",
      description: "Revisar estado de sprints, cuellos de botella y fechas de entrega para el lanzamiento.",
      startDate: "2026-10-08",
      dueDate: "2026-10-08",
      startTime: "11:30",
      endTime: "12:30",
      priority: "alta",
      status: "pendiente",
      category: "Operaciones",
      tags: ["Reunión", "Scrum", "Lanzamiento"],
      projectId: "prj-2",
      clientId: null,
      assigneeId: "mem-2",
      recurrent: "semanal",
      subtasks: [
        { id: "sub-21", title: "Abrir tablero Jira y verificar pull requests", completed: false },
        { id: "sub-22", title: "Definir responsables de QA para el viernes", completed: false }
      ]
    },
    {
      id: "tsk-3",
      title: "Diseñar propuesta comercial de automatización con Make/Zapier",
      description: "Propuesta para Dr. Salgado: flujo de captación de leads y recordatorio por WhatsApp.",
      startDate: "2026-10-08",
      dueDate: "2026-10-09",
      startTime: "15:00",
      endTime: "17:00",
      priority: "alta",
      status: "pendiente",
      category: "Ventas & Clientes",
      tags: ["Propuesta", "Automatización"],
      projectId: "prj-3",
      clientId: "cli-2",
      assigneeId: "mem-1",
      recurrent: null,
      subtasks: [
        { id: "sub-31", title: "Diagramar arquitectura del flujo", completed: true },
        { id: "sub-32", title: "Calcular cotización horas de setup y mantenimiento", completed: false }
      ]
    },
    {
      id: "tsk-4",
      title: "Renovar licencias de Notion & Google Workspace",
      description: "Pago corporativo anual para aprovechar 20% de descuento.",
      startDate: "2026-10-08",
      dueDate: "2026-10-10",
      startTime: "14:00",
      endTime: "14:30",
      priority: "media",
      status: "pendiente",
      category: "Administración",
      tags: ["Suscripción", "Tarjetas"],
      projectId: null,
      clientId: null,
      assigneeId: "mem-1",
      recurrent: "anual",
      subtasks: []
    },
    {
      id: "tsk-5",
      title: "Enviar reporte semanal de entregables a Estudio Horizon",
      description: "Consolidar horas de asistencia virtual trabajadas en ClickUp y enviar acta.",
      startDate: "2026-10-07",
      dueDate: "2026-10-08",
      startTime: "17:00",
      endTime: "18:00",
      priority: "alta",
      status: "completada",
      category: "Asistente Virtual",
      tags: ["Facturación", "Horizon"],
      projectId: "prj-1",
      clientId: "cli-3",
      assigneeId: "mem-1",
      recurrent: "semanal",
      subtasks: [
        { id: "sub-51", title: "Extraer bitácora de horas de Harvest", completed: true },
        { id: "sub-52", title: "Adjuntar PDF con recibo y enlaces de Drive", completed: true }
      ]
    }
  ],
  events: [
    {
      id: "evt-1",
      title: "Auditoría Financiera Q3 - Cliente Alpha",
      date: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00",
      type: "compromiso",
      location: "Google Meet",
      attendees: "Andrés B. (CFO), Carolina M.",
      color: "#9C523B",
      reminder: "15 min antes"
    },
    {
      id: "evt-2",
      title: "Daily Standup & Sprints Equipo Tech",
      date: "2026-10-08",
      startTime: "11:30",
      endTime: "12:30",
      type: "reunion",
      location: "Zoom Sala 2",
      attendees: "Equipo de desarrollo (5 pers.)",
      color: "#3F6253",
      reminder: "10 min antes"
    },
    {
      id: "evt-3",
      title: "Almuerzo & Pausa Desconexión",
      date: "2026-10-08",
      startTime: "13:30",
      endTime: "14:30",
      type: "personal",
      location: "Terraza",
      attendees: "Personal",
      color: "#7E6B5A",
      reminder: "Sin alerta"
    },
    {
      id: "evt-4",
      title: "Demostración de CRM para Clínica Salgado",
      date: "2026-10-09",
      startTime: "10:00",
      endTime: "11:15",
      type: "cita",
      location: "Videollamada Teams",
      attendees: "Dr. Marco Salgado",
      color: "#B27D32",
      reminder: "30 min antes"
    },
    {
      id: "evt-5",
      title: "Sesión de Planificación Estratégica Semanal",
      date: "2026-10-12",
      startTime: "08:30",
      endTime: "10:00",
      type: "compromiso",
      location: "Oficina Privada",
      attendees: "Equipo Directivo",
      color: "#5B4B70",
      reminder: "1 hora antes"
    }
  ],
  projects: [
    {
      id: "prj-1",
      title: "Reestructuración Operativa & VA para Grupo Alpha",
      description: "Implementación de sistema de gestión documental, automatización de facturación y soporte ejecutivo.",
      clientId: "cli-1",
      managerId: "mem-1",
      startDate: "2026-09-15",
      deadline: "2026-11-15",
      budget: 4500,
      spent: 2850,
      status: "activo",
      progress: 68,
      deliverables: [
        { id: "del-1", title: "Manual de Procedimientos Estándar (SOPs)", completed: true, dueDate: "2026-09-30" },
        { id: "del-2", title: "Integración de pasarela y conciliación bancaria", completed: true, dueDate: "2026-10-15" },
        { id: "del-3", title: "Capacitación a secretaría y recepcionistas", completed: false, dueDate: "2026-10-28" },
        { id: "del-4", title: "Entrega de tablero de mando ejecutivo final", completed: false, dueDate: "2026-11-10" }
      ]
    },
    {
      id: "prj-2",
      title: "Lanzamiento Portal de Membresías Horizon",
      description: "Desarrollo y lanzamiento de la plataforma de e-learning y comunidad privada.",
      clientId: "cli-3",
      managerId: "mem-2",
      startDate: "2026-08-01",
      deadline: "2026-10-31",
      budget: 6800,
      spent: 5900,
      status: "activo",
      progress: 85,
      deliverables: [
        { id: "del-21", title: "Diseño UX/UI responsive de la academia", completed: true, dueDate: "2026-08-20" },
        { id: "del-22", title: "Grabación de 12 módulos de video introductorios", completed: true, dueDate: "2026-09-18" },
        { id: "del-23", title: "Fase Beta con 50 usuarios VIP y retroalimentación", completed: true, dueDate: "2026-10-05" },
        { id: "del-24", title: "Campaña de apertura pública e emails de bienvenida", completed: false, dueDate: "2026-10-25" }
      ]
    },
    {
      id: "prj-3",
      title: "Automatización Clínica & CRM Dr. Salgado",
      description: "Captación de pacientes online, confirmación vía WhatsApp y sincronización con Google Calendar.",
      clientId: "cli-2",
      managerId: "mem-1",
      startDate: "2026-10-01",
      deadline: "2026-11-05",
      budget: 2400,
      spent: 600,
      status: "activo",
      progress: 25,
      deliverables: [
        { id: "del-31", title: "Configuración de webhook y base de datos Airtable", completed: true, dueDate: "2026-10-10" },
        { id: "del-32", title: "Diseño de plantillas de mensaje y política de privacidad", completed: false, dueDate: "2026-10-20" },
        { id: "del-33", title: "Pruebas de estrés y entrega final", completed: false, dueDate: "2026-11-02" }
      ]
    }
  ],
  clients: [
    {
      id: "cli-1",
      name: "Andrés Beller",
      company: "Alpha Capital Partners",
      email: "andres@alphacapital.io",
      phone: "+34 611 982 344",
      ratePerHour: 45,
      services: "Asistencia Ejecutiva, Conciliación Financiera y Gestión de Agenda",
      status: "activo",
      hoursContracted: 40,
      hoursUsed: 28.5,
      instructions: "Priorizar respuestas antes de las 10:00 AM. Copiar siempre al CFO en temas de facturación.",
      credentialsVaultLink: "https://1password.com/vault/alphapartner",
      requests: [
        { id: "req-1", title: "Auditoría de suscripciones repetidas", status: "en_proceso", date: "2026-10-07" },
        { id: "req-2", title: "Reservar vuelos a Madrid para convención", status: "completado", date: "2026-10-02" }
      ]
    },
    {
      id: "cli-2",
      name: "Dr. Marco Salgado",
      company: "Clínica Dental Salgado",
      email: "dr.salgado@salgadodental.com",
      phone: "+34 688 201 192",
      ratePerHour: 40,
      services: "Automatización de Citas, Gestión de Pacientes y Soporte Web",
      status: "activo",
      hoursContracted: 25,
      hoursUsed: 12.0,
      instructions: "Los recordatorios deben enviarse exactamente 24 horas antes con confirmación Sí/No.",
      credentialsVaultLink: "https://bitwarden.com/vault/salgadodental",
      requests: [
        { id: "req-21", title: "Conectar pasarela de pago para señas de citas", status: "pendiente", date: "2026-10-06" }
      ]
    },
    {
      id: "cli-3",
      name: "Valeria Montero",
      company: "Estudio Creativo Horizon",
      email: "valeria@horizonstudio.design",
      phone: "+34 654 332 900",
      ratePerHour: 50,
      services: "Dirección de Operaciones VA, Seguimiento de Lanzamientos",
      status: "activo",
      hoursContracted: 50,
      hoursUsed: 44.0,
      instructions: "Reuniones de aprobación los viernes por la mañana. Uso estricto de Slack para emergencias.",
      credentialsVaultLink: "https://1password.com/vault/horizon",
      requests: [
        { id: "req-31", title: "Preparar correos para afiliados del lanzamiento", status: "en_proceso", date: "2026-10-08" }
      ]
    }
  ],
  timeEntries: [
    {
      id: "tim-1",
      clientId: "cli-1",
      projectId: "prj-1",
      description: "Conciliación de cuentas Stripe y depuración de recibos Q3",
      durationMinutes: 120,
      billable: true,
      rate: 45,
      date: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00"
    },
    {
      id: "tim-2",
      clientId: "cli-3",
      projectId: "prj-2",
      description: "Revisión de accesos de prueba a la membresía VIP",
      durationMinutes: 45,
      billable: true,
      rate: 50,
      date: "2026-10-07",
      startTime: "16:00",
      endTime: "16:45"
    },
    {
      id: "tim-3",
      clientId: null,
      projectId: null,
      description: "Optimización de base de datos interna y actualización de plantillas de agenda",
      durationMinutes: 60,
      billable: false,
      rate: 0,
      date: "2026-10-07",
      startTime: "08:00",
      endTime: "09:00"
    }
  ],
  team: [
    {
      id: "mem-1",
      name: "Carolina Méndez",
      role: "Lead Executive VA & Project Director",
      department: "Dirección & Estrategia",
      email: "carolina@mendezops.com",
      shift: "Jornada Completa",
      attendance: "Presente",
      tasksAssigned: 4,
      avatarColor: "#9C523B"
    },
    {
      id: "mem-2",
      name: "Carlos Velasco",
      role: "Especialista en Automatizaciones y CRM",
      department: "Tecnología & Integraciones",
      email: "carlos@mendezops.com",
      shift: "Mañana (08:00 - 15:00)",
      attendance: "Remoto Activo",
      tasksAssigned: 3,
      avatarColor: "#3F6253"
    },
    {
      id: "mem-3",
      name: "Sofía Navarro",
      role: "Diseñadora Gráfica & Community Lead",
      department: "Contenidos & Creatividad",
      email: "sofia@mendezops.com",
      shift: "Media Jornada (14:00 - 19:00)",
      attendance: "Presente",
      tasksAssigned: 2,
      avatarColor: "#B27D32"
    }
  ],
  contacts: [
    {
      id: "con-1",
      name: "Andrés Beller",
      email: "andres@alphacapital.io",
      phone: "+34 611 982 344",
      company: "Alpha Capital Partners",
      role: "Managing Director",
      type: "cliente",
      lastInteraction: "2026-10-08 (Auditoría Q3)",
      nextFollowUp: "2026-10-15 (Presentación Final)",
      notes: "Le gusta recibir resúmenes breves en viñetas de 3 puntos clave."
    },
    {
      id: "con-2",
      name: "Dr. Marco Salgado",
      email: "dr.salgado@salgadodental.com",
      phone: "+34 688 201 192",
      company: "Clínica Dental Salgado",
      role: "Director Médico",
      type: "cliente",
      lastInteraction: "2026-10-05 (Revisión técnica)",
      nextFollowUp: "2026-10-09 (Demostración de CRM)",
      notes: "Atiende llamadas prioritarias solo entre 14:00 y 15:30."
    },
    {
      id: "con-3",
      name: "Lucía Paredes",
      email: "lucia@legalpro.es",
      phone: "+34 622 119 090",
      company: "Paredes & Asociados Legal",
      role: "Abogada Corporativa / Asesoría",
      type: "proveedor",
      lastInteraction: "2026-09-28 (Revisión de contratos NDA)",
      nextFollowUp: "2026-10-30 (Renovación de póliza)",
      notes: "Contacto para acuerdos confidenciales y contratos de servicios de VA."
    }
  ],
  finance: {
    monthlyBudget: 6000,
    transactions: [
      { id: "trx-1", type: "ingreso", description: "Anticipo 50% Proyecto Reestructuración Alpha", amount: 2250, category: "Servicios VA", date: "2026-10-02", client: "Alpha Capital", status: "cobrado" },
      { id: "trx-2", type: "ingreso", description: "Retainer Mensual VA Septiembre/Octubre - Horizon", amount: 2500, category: "Retainer", date: "2026-10-05", client: "Estudio Horizon", status: "cobrado" },
      { id: "trx-3", type: "gasto", description: "Suscripción anual Make.com Enterprise", amount: 340, category: "Software & Herramientas", date: "2026-10-03", client: "Operaciones", status: "pagado" },
      { id: "trx-4", type: "gasto", description: "Google Workspace & Storage 2TB", amount: 72, category: "Software", date: "2026-10-06", client: "Operaciones", status: "pagado" },
      { id: "trx-5", type: "ingreso", description: "Factura setup automatización citas Dr. Salgado", amount: 1200, category: "Automatizaciones", date: "2026-10-08", client: "Clínica Salgado", status: "pendiente" },
      { id: "trx-6", type: "gasto", description: "Honorarios Asistente Especialista Carlos V.", amount: 850, category: "Equipo & Nómina", date: "2026-10-05", client: "Equipo", status: "pagado" }
    ],
    subscriptions: [
      { id: "sub-1", name: "Make.com Pro", amount: 29, cycle: "mensual", nextRenewal: "2026-11-03", category: "Automatización", active: true },
      { id: "sub-2", name: "1Password Business", amount: 19.99, cycle: "mensual", nextRenewal: "2026-10-22", category: "Seguridad", active: true },
      { id: "sub-3", name: "Notion Plus & AI", amount: 20, cycle: "mensual", nextRenewal: "2026-10-18", category: "Productividad", active: true },
      { id: "sub-4", name: "Zoom One Pro", amount: 15.99, cycle: "mensual", nextRenewal: "2026-10-25", category: "Comunicaciones", active: true }
    ],
    budgetCategories: [
      { category: "Software & Herramientas", allocated: 500, spent: 412 },
      { category: "Equipo & Nómina", allocated: 1500, spent: 850 },
      { category: "Marketing & Marca", allocated: 600, spent: 120 },
      { category: "Oficina & Varios", allocated: 300, spent: 85 }
    ]
  },
  notes: [
    {
      id: "not-1",
      title: "Minuta: Reunión de Diagnóstico con Dr. Salgado",
      type: "minuta",
      category: "Reuniones",
      updatedAt: "2026-10-05",
      pinned: true,
      tags: ["Dr. Salgado", "Acuerdos", "CRM"],
      content: `### Objetivos Acordados:
1. Eliminar el absentismo de citas médicas que actualmente ronda el 22%.
2. Implementar recordatorio automatizado por WhatsApp con 24h y 2h de antelación.
3. Se integrará Google Calendar de los 3 odontólogos para evitar solapamientos.

### Compromisos y Próximos Pasos:
* [x] Carolina envía propuesta y contrato de confidencialidad (NDA).
* [ ] Dr. Salgado facilita acceso a la cuenta Business de Meta antes del viernes.
* [ ] Fecha estimada de entrega piloto: 20 de Octubre de 2026.`
    },
    {
      id: "not-2",
      title: "Plantilla: Brief de Inicio de Cliente Nuevo (VA)",
      type: "plantilla",
      category: "Plantillas",
      updatedAt: "2026-10-01",
      pinned: true,
      tags: ["Onboarding", "Plantilla", "SOP"],
      content: `### Ficha de Cliente Nuevo:
* **Nombre de la Empresa:** [Completar]
* **Contacto Principal:** [Nombre y Cargo]
* **Canal oficial de comunicación:** [Slack / WhatsApp / Email]
* **Horario de disponibilidad:** [ej: 09:00 a 18:00 CET]

### Requisitos Técnicos y Accesos:
* [ ] Bóveda compartida en 1Password creada.
* [ ] Accesos verificados: Correo delegado, Calendario, Drive.
* [ ] Definición de tareas recurrentes de la semana 1.`
    },
    {
      id: "not-3",
      title: "Ideas Rápidas de Optimización Semanal",
      type: "rapida",
      category: "Estrategia",
      updatedAt: "2026-10-08",
      pinned: false,
      tags: ["Ideas", "Deep Work"],
      content: `- Bloquear las mañanas de 8:00 a 11:00 para Deep Work (cero reuniones, cero notificaciones).
- Centralizar todas las solicitudes de clientes en el formulario unificado de Notes.
- Delegar a Carlos la revisión técnica previa a las demos con clientes.`
    }
  ],
  personal: {
    habits: [
      { id: "hab-1", name: "Hidratación (2.5 Litros)", icon: "💧", streak: 14, days: { "2026-10-04": true, "2026-10-05": true, "2026-10-06": true, "2026-10-07": true, "2026-10-08": true } },
      { id: "hab-2", name: "Deep Work (2 bloques de 90m)", icon: "🎯", streak: 8, days: { "2026-10-05": true, "2026-10-06": true, "2026-10-07": true, "2026-10-08": true } },
      { id: "hab-3", name: "Lectura Profesional (20 min)", icon: "📖", streak: 5, days: { "2026-10-06": true, "2026-10-07": true, "2026-10-08": false } },
      { id: "hab-4", name: "Ejercicio / Caminata 8k pasos", icon: "🏃‍♀️", streak: 11, days: { "2026-10-04": true, "2026-10-05": true, "2026-10-06": true, "2026-10-07": true, "2026-10-08": true } },
      { id: "hab-5", name: "Cero Pantallas después de 22:00", icon: "🌙", streak: 4, days: { "2026-10-06": true, "2026-10-07": true, "2026-10-08": false } }
    ],
    routines: [
      { id: "rou-1", title: "Rutina Matutina de Enfoque", period: "manana", time: "06:45", completed: true, items: ["Vaso de agua con limón", "10 min de movilidad o yoga", "Revisión de las 3 prioridades en la agenda", "Café sin teléfono móvil"] },
      { id: "rou-2", title: "Cierre de Jornada Laboral", period: "tarde", time: "18:00", completed: false, items: ["Bandeja de entrada a cero (Inbox Zero)", "Revisar tareas pendientes y reasignar a mañana", "Apagar notificaciones de trabajo y laptop"] },
      { id: "rou-3", title: "Ritual Nocturno de Descanso", period: "noche", time: "22:00", completed: false, items: ["Agradecimiento del día en la libreta", "Preparar ropa y agua del día siguiente", "Modo avión en el teléfono"] }
    ],
    goals: [
      { id: "gol-1", title: "Certificación de Gestión de Operaciones & PM", category: "Carrera", progress: 75, targetDate: "Diciembre 2026" },
      { id: "gol-2", title: "Fondo de Emergencia Negocio 6 meses", category: "Finanzas", progress: 90, targetDate: "Noviembre 2026" },
      { id: "gol-3", title: "Completar Media Maratón de Valencia", category: "Salud", progress: 60, targetDate: "Octubre 2026" },
      { id: "gol-4", title: "Viaje de desconexión 10 días a Japón", category: "Vida Personal", progress: 40, targetDate: "Marzo 2027" }
    ],
    shoppingList: [
      { id: "shp-1", item: "Soporte ergonómico para laptop de aluminio", category: "Oficina", bought: false },
      { id: "shp-2", item: "Café de especialidad en grano (Etiopía)", category: "Hogar", bought: true },
      { id: "shp-3", item: "Cuaderno punteado recambio Notes", category: "Papelería", bought: true },
      { id: "shp-4", item: "Cable Thunderbolt 4 trenzado 2m", category: "Tecnología", bought: false }
    ]
  },
  automations: [
    {
      id: "aut-1",
      name: "Alertar Tareas Urgentes del Día",
      trigger: "Cuando falten menos de 3 horas para la fecha límite",
      action: "Resaltar en rojo y emitir notificación sonora",
      enabled: true,
      lastRun: "Hoy a las 08:00"
    },
    {
      id: "aut-2",
      name: "Generar Tarea de Revisión Semanal",
      trigger: "Cada viernes a las 16:00",
      action: "Crear tarea 'Auditoría de entregables y balance de horas'",
      enabled: true,
      lastRun: "Viernes pasado"
    },
    {
      id: "aut-3",
      name: "Detección Automática de Solapamiento de Horarios",
      trigger: "Al registrar o modificar un evento en la agenda",
      action: "Verificar cruce de horas y mostrar aviso de conflicto",
      enabled: true,
      lastRun: "Activo en vivo"
    },
    {
      id: "aut-4",
      name: "Recordatorio de Hábitos Nocturnos",
      trigger: "Diariamente a las 21:30",
      action: "Enviar alerta push de desconexión digital",
      enabled: true,
      lastRun: "Ayer 21:30"
    }
  ],
  notifications: [
    { id: "notif-1", title: "Auditoría Financiera Q3", message: "En curso ahora con Andrés Beller (09:00 - 11:00)", time: "Hace 15m", type: "alerta", read: false },
    { id: "notif-2", title: "Cobro Acreditado", message: "Recibido pago de $2,500 de Estudio Horizon", time: "Hace 2h", type: "sistema", read: false },
    { id: "notif-3", title: "Conflicto evitado", message: "La cita de las 11:30 no solapa con compromisos previos", time: "Ayer", type: "recordatorio", read: true }
  ]
};

class Store {
  constructor() {
    this.data = this.loadData();
    this.listeners = [];
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error leyendo localStorage, usando datos iniciales", e);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveData(dataToSave = null) {
    if (dataToSave) {
      this.data = dataToSave;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
    } catch (e) {
      console.error("Error guardando en localStorage", e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.data));
  }

  // Métodos de acceso rápido
  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    this.saveData();
  }

  // Operaciones de Tareas
  addTask(task) {
    if (!task.id) task.id = 'tsk-' + Date.now();
    if (!task.subtasks) task.subtasks = [];
    this.data.tasks.unshift(task);
    this.saveData();
    return task;
  }

  updateTask(id, updates) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.tasks[idx] = { ...this.data.tasks[idx], ...updates };
      this.saveData();
      return this.data.tasks[idx];
    }
    return null;
  }

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.saveData();
  }

  toggleSubtask(taskId, subtaskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const sub = task.subtasks.find(s => s.id === subtaskId);
      if (sub) {
        sub.completed = !sub.completed;
        this.saveData();
      }
    }
  }

  // Operaciones de Calendario / Eventos
  addEvent(event) {
    if (!event.id) event.id = 'evt-' + Date.now();
    this.data.events.push(event);
    this.saveData();
    return event;
  }

  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.data.events[idx] = { ...this.data.events[idx], ...updates };
      this.saveData();
      return this.data.events[idx];
    }
    return null;
  }

  deleteEvent(id) {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.saveData();
  }

  // Verificación de conflicto de horario en eventos
  checkScheduleConflict(date, startTime, endTime, excludeEventId = null) {
    return this.data.events.filter(e => {
      if (e.id === excludeEventId) return false;
      if (e.date !== date) return false;
      // Comprobar solape de tiempos
      const eStart = e.startTime;
      const eEnd = e.endTime;
      return (startTime < eEnd && endTime > eStart);
    });
  }

  // Operaciones de Proyectos
  addProject(project) {
    if (!project.id) project.id = 'prj-' + Date.now();
    if (!project.deliverables) project.deliverables = [];
    this.data.projects.unshift(project);
    this.saveData();
    return project;
  }

  updateProject(id, updates) {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
      this.saveData();
      return this.data.projects[idx];
    }
    return null;
  }

  // Operaciones de Clientes & VA
  addClient(client) {
    if (!client.id) client.id = 'cli-' + Date.now();
    if (!client.requests) client.requests = [];
    this.data.clients.unshift(client);
    this.saveData();
    return client;
  }

  addTimeEntry(entry) {
    if (!entry.id) entry.id = 'tim-' + Date.now();
    this.data.timeEntries.unshift(entry);
    // Si tiene cliente, sumamos horas
    if (entry.clientId) {
      const client = this.data.clients.find(c => c.id === entry.clientId);
      if (client) {
        client.hoursUsed = (client.hoursUsed || 0) + (entry.durationMinutes / 60);
      }
    }
    this.saveData();
    return entry;
  }

  // Operaciones de Finanzas
  addTransaction(trx) {
    if (!trx.id) trx.id = 'trx-' + Date.now();
    this.data.finance.transactions.unshift(trx);
    this.saveData();
    return trx;
  }

  // Operaciones de Notas
  addNote(note) {
    if (!note.id) note.id = 'not-' + Date.now();
    note.updatedAt = new Date().toISOString().split('T')[0];
    this.data.notes.unshift(note);
    this.saveData();
    return note;
  }

  updateNote(id, updates) {
    const idx = this.data.notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.data.notes[idx] = { ...this.data.notes[idx], ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      this.saveData();
      return this.data.notes[idx];
    }
    return null;
  }

  deleteNote(id) {
    this.data.notes = this.data.notes.filter(n => n.id !== id);
    this.saveData();
  }

  // Operaciones Personales (Hábitos, Rutinas, Compras)
  toggleHabit(habitId, dateStr) {
    const habit = this.data.personal.habits.find(h => h.id === habitId);
    if (habit) {
      if (!habit.days) habit.days = {};
      habit.days[dateStr] = !habit.days[dateStr];
      // recalcular racha aproximada
      let streak = 0;
      const sortedKeys = Object.keys(habit.days).sort().reverse();
      for (const k of sortedKeys) {
        if (habit.days[k]) streak++;
        else break;
      }
      habit.streak = streak;
      this.saveData();
    }
  }

  toggleRoutine(routineId) {
    const r = this.data.personal.routines.find(item => item.id === routineId);
    if (r) {
      r.completed = !r.completed;
      this.saveData();
    }
  }

  toggleShoppingItem(itemId) {
    const item = this.data.personal.shoppingList.find(i => i.id === itemId);
    if (item) {
      item.bought = !item.bought;
      this.saveData();
    }
  }

  addShoppingItem(item) {
    if (!item.id) item.id = 'shp-' + Date.now();
    this.data.personal.shoppingList.push(item);
    this.saveData();
  }

  // Operaciones de Notificaciones
  markNotificationRead(id) {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveData();
    }
  }

  // Backup & Restauración
  exportBackup() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Agenda_Notes_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks && parsed.profile) {
        this.data = parsed;
        this.saveData();
        return true;
      }
    } catch (e) {
      console.error("Archivo de respaldo inválido", e);
    }
    return false;
  }

  resetToInitial() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData();
  }
}

// Exportamos instancia global accesible por todos los módulos
window.plannerStore = new Store();
