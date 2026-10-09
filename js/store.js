/**
 * Planificador Digital Notes Web - Store Central & Persistencia
 * Temática Oficial: Hogwarts & Harry Potter Universe (Hermione Granger Lead Ops)
 * Motor Predictivo de Tiempos y Costos con Control Total de Reglas y Horarios.
 */

const STORAGE_KEY = 'notes_planner_db_hp_v2';

const INITIAL_DATA = {
  profile: {
    name: "Hermione Granger",
    role: "Prefecta Principal & Directora de Operaciones Mágicas",
    business: "Hogwarts Ops & S.P.E.W. (P.E.D.D.O.)",
    email: "hermione.granger@hogwarts.ac.uk",
    avatar: "assets/avatar-cat.svg", // Gatito Crookshanks con gafas y bufanda Gryffindor
    dailyFocusScore: 98
  },
  settings: {
    theme: "caramel", // caramel, rose, midnight, sage
    soundEnabled: true,
    zenMode: false,
    activeTab: "dashboard",
    currency: "Galeones (🪙 G)",
    pomodoroWorkTime: 25,
    pomodoroBreakTime: 5
  },
  tasks: [
    {
      id: "tsk-1",
      title: "Auditar inventario de ingredientes para Poción Multijugos con Severus Snape",
      description: "Verificar pesaje de cuerno de bicornio en polvo, piel de serpiente arbórea africana y crisopos tras 21 días de cocción en las mazmorras.",
      startDate: "2026-10-08",
      dueDate: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00",
      priority: "urgente", // baja, media, alta, urgente
      status: "en_proceso", // pendiente, en_proceso, completada, cancelada
      category: "Pociones & Alquimia",
      tags: ["Snape", "Mazmorras", "Multijugos"],
      projectId: "prj-1",
      clientId: "cli-2",
      assigneeId: "mem-1",
      recurrent: null,
      subtasks: [
        { id: "sub-1", title: "Recolectar crisopos tras 21 días de maceración", completed: true },
        { id: "sub-2", title: "Pesar 16 onzas de sanguijuelas y polvo de bicornio", completed: true },
        { id: "sub-3", title: "Picar hojas de descurainia sophia en luna llena", completed: false },
        { id: "sub-4", title: "Conseguir muestra de esencia para prueba piloto", completed: false }
      ]
    },
    {
      id: "tsk-2",
      title: "Calibración del Giratiempo para asignaturas simultáneas (Aritmancia & Runas Antiguas)",
      description: "Ajustar desfase de rotación a 3 vueltas hacia atrás y verificar salvoconducto firmado por la Subdirectora McGonagall.",
      startDate: "2026-10-08",
      dueDate: "2026-10-08",
      startTime: "11:30",
      endTime: "12:30",
      priority: "alta",
      status: "pendiente",
      category: "Académico & Giratiempo",
      tags: ["Giratiempo", "McGonagall", "Turnos"],
      projectId: "prj-2",
      clientId: null,
      assigneeId: "mem-2",
      recurrent: "semanal",
      subtasks: [
        { id: "sub-21", title: "Validar reloj de arena de oro con Profesora Vector", completed: false },
        { id: "sub-22", title: "Coordinar aula de reserva para evitar paradojas temporales", completed: false }
      ]
    },
    {
      id: "tsk-3",
      title: "Revisión de presupuesto y stock para Sortilegios Weasley (Carameleros Salta-Clases)",
      description: "Revisar costos de producción de turrón de hemorragia y bombones desmayo; conciliar 1,250 Galeones transferidos desde Bóveda 93 en Gringotts.",
      startDate: "2026-10-08",
      dueDate: "2026-10-09",
      startTime: "15:00",
      endTime: "17:00",
      priority: "alta",
      status: "pendiente",
      category: "Comercio Mágico",
      tags: ["Fred & George", "Callejón Diagon", "Gringotts"],
      projectId: "prj-3",
      clientId: "cli-1",
      assigneeId: "mem-1",
      recurrent: null,
      subtasks: [
        { id: "sub-31", title: "Auditar balance de ventas en Callejón Diagon 93", completed: true },
        { id: "sub-32", title: "Proyectar margen de ganancia para nueva tienda en Hogsmeade", completed: false }
      ]
    },
    {
      id: "tsk-4",
      title: "Renovar suscripción anual a 'El Trasgo de las Finanzas' y 'El Profeta'",
      description: "Pago corporativo con débito directo desde Bóveda Gringotts con 15% de descuento para prefectos.",
      startDate: "2026-10-08",
      dueDate: "2026-10-10",
      startTime: "14:00",
      endTime: "14:30",
      priority: "media",
      status: "pendiente",
      category: "Suscripciones Mágicas",
      tags: ["Gringotts", "Lechuzas"],
      projectId: null,
      clientId: null,
      assigneeId: "mem-1",
      recurrent: "anual",
      subtasks: []
    },
    {
      id: "tsk-5",
      title: "Enviar informe de derechos laborales de elfos domésticos (P.E.D.D.O.) al Ministerio",
      description: "Consolidar testimonios de cocinas del Gran Comedor y lacrar con sello oficial de Gryffindor para envío urgente por lechuza real.",
      startDate: "2026-10-07",
      dueDate: "2026-10-08",
      startTime: "17:00",
      endTime: "18:00",
      priority: "alta",
      status: "completada",
      category: "Causas & P.E.D.D.O.",
      tags: ["S.P.E.W.", "Dobby", "Ministerio"],
      projectId: "prj-1",
      clientId: "cli-3",
      assigneeId: "mem-1",
      recurrent: "semanal",
      subtasks: [
        { id: "sub-51", title: "Tejer 12 gorros de lana para dejar en la sala común", completed: true },
        { id: "sub-52", title: "Adjuntar carta de respaldo firmada por Albus Dumbledore", completed: true }
      ]
    }
  ],
  events: [
    {
      id: "evt-1",
      title: "Sesión de Aritmancia Predictiva con Profesora Vector",
      date: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00",
      type: "compromiso",
      location: "Torre Séptima (Aula 7B)",
      attendees: "Profesora Septima Vector, Hermione Granger",
      color: "#9C523B",
      reminder: "15 min antes"
    },
    {
      id: "evt-2",
      title: "Ronda Nocturna de Prefectos en Pasillos de Hogwarts",
      date: "2026-10-08",
      startTime: "11:30",
      endTime: "12:30",
      type: "reunion",
      location: "Gran Comedor y Pasillo del Tercer Piso",
      attendees: "Hermione Granger, Ron Weasley (Prefectos Gryffindor)",
      color: "#3F6253",
      reminder: "10 min antes"
    },
    {
      id: "evt-3",
      title: "Almuerzo y Cerveza de Mantequilla en Las Tres Escobas",
      date: "2026-10-08",
      startTime: "13:30",
      endTime: "14:30",
      type: "personal",
      location: "Las Tres Escobas, Aldea de Hogsmeade",
      attendees: "Harry Potter, Ron Weasley, Hermione Granger",
      color: "#7E6B5A",
      reminder: "Sin alerta"
    },
    {
      id: "evt-4",
      title: "Reunión de balance de Sortilegios Weasley con Fred & George",
      date: "2026-10-09",
      startTime: "10:00",
      endTime: "11:15",
      type: "cita",
      location: "Espejo Comunicador / Callejón Diagon 93",
      attendees: "Fred Weasley, George Weasley, Hermione G.",
      color: "#B27D32",
      reminder: "30 min antes"
    },
    {
      id: "evt-5",
      title: "Asamblea General de la Orden en el Despacho Principal",
      date: "2026-10-12",
      startTime: "08:30",
      endTime: "10:00",
      type: "compromiso",
      location: "Despacho del Director (Gárgola de Piedra)",
      attendees: "Albus Dumbledore, Minerva McGonagall, Severus Snape",
      color: "#5B4B70",
      reminder: "1 hora antes"
    }
  ],
  projects: [
    {
      id: "prj-1",
      title: "Defensa del Castillo & Red de Encantamientos Protectores",
      description: "Implementación del escudo Protego Horribilis, animación de estatuas de piedra y protocolo de evacuación de alumnos menores.",
      clientId: "cli-2",
      managerId: "mem-1",
      startDate: "2026-09-15",
      deadline: "2026-11-15",
      budget: 5000,
      spent: 3200,
      status: "activo",
      progress: 68,
      deliverables: [
        { id: "del-1", title: "Manual de Hechizos Protectores de Frontera", completed: true, dueDate: "2026-09-30" },
        { id: "del-2", title: "Instalación de barrera Protego Maxima en el puente", completed: true, dueDate: "2026-10-15" },
        { id: "del-3", title: "Entrenamiento de centinelas de piedra (Piertotum Locomotor)", completed: false, dueDate: "2026-10-28" },
        { id: "del-4", title: "Distribución de Frascos de Felix Felicis a prefectos", completed: false, dueDate: "2026-11-10" }
      ]
    },
    {
      id: "prj-2",
      title: "Optimización del Cronograma y Aulas con Giratiempo",
      description: "Planificación de 12 asignaturas simultáneas para alumnos avanzados sin colisiones de física espacio-temporal.",
      clientId: "cli-2",
      managerId: "mem-1",
      startDate: "2026-08-01",
      deadline: "2026-10-31",
      budget: 2800,
      spent: 1400,
      status: "activo",
      progress: 75,
      deliverables: [
        { id: "del-21", title: "Matriz horaria de Aritmancia, Runas y Cuidado de Criaturas", completed: true, dueDate: "2026-08-20" },
        { id: "del-22", title: "Permisos especiales sellados por el Departamento de Misterios", completed: true, dueDate: "2026-09-18" },
        { id: "del-23", title: "Pruebas de desfase temporal de 3 horas en la Torre del Reloj", completed: true, dueDate: "2026-10-05" },
        { id: "del-24", title: "Auditoría de integridad física del reloj de arena de oro", completed: false, dueDate: "2026-10-25" }
      ]
    },
    {
      id: "prj-3",
      title: "Expansión Comercial de Sortilegios Weasley a Hogsmeade",
      description: "Apertura de la segunda sucursal de Fred & George: Carameleros Salta-Clases, Pociones de Amor y Orejas Extensibles.",
      clientId: "cli-1",
      managerId: "mem-3",
      startDate: "2026-10-01",
      deadline: "2026-11-05",
      budget: 7500,
      spent: 6400,
      status: "activo",
      progress: 85,
      deliverables: [
        { id: "del-31", title: "Alquiler del local adyacente a la tienda de chascos Zonko", completed: true, dueDate: "2026-10-10" },
        { id: "del-32", title: "Patentes mágicas para fuegos artificiales 'Wildfire Whiz-bangs'", completed: true, dueDate: "2026-10-20" },
        { id: "del-33", title: "Lanzamiento y campaña masiva con 50 lechuzas doradas", completed: false, dueDate: "2026-11-02" }
      ]
    }
  ],
  clients: [
    {
      id: "cli-1",
      name: "Fred & George Weasley",
      company: "Sortilegios Weasley (Weasleys' Wizard Wheezes)",
      email: "twins@wizardwheezes.co.uk",
      phone: "+44 20 7946 0993",
      ratePerHour: 55,
      services: "Dirección de Operaciones, Logística de Inventario y Contabilidad en Gringotts",
      status: "activo",
      hoursContracted: 40,
      hoursUsed: 36.5,
      instructions: "No permitir que Ron pruebe los productos en fase beta. Todas las facturas deben liquidarse en Galeones de oro puro.",
      credentialsVaultLink: "https://gringotts.wizard/vault/weasleys93",
      requests: [
        { id: "req-1", title: "Auditoría de pérdidas por bombones desmayo defectuosos", status: "en_proceso", date: "2026-10-07" },
        { id: "req-2", title: "Envío urgente de 200 Sombreros Escudo al Ministerio", status: "completado", date: "2026-10-02" }
      ]
    },
    {
      id: "cli-2",
      name: "Profesora Minerva McGonagall",
      company: "Colegio Hogwarts de Magia y Hechicería",
      email: "minerva.mcgonagall@hogwarts.ac.uk",
      phone: "+44 131 496 0110",
      ratePerHour: 50,
      services: "Coordinación de Prefectos, Gestión del Giratiempo y Protocolos de Seguridad",
      status: "activo",
      hoursContracted: 30,
      hoursUsed: 18.0,
      instructions: "Las consultas urgentes se atienden mediante patronus mensajero o en el despacho del segundo piso después del té.",
      credentialsVaultLink: "https://hogwarts.ac.uk/archive/prefect-records",
      requests: [
        { id: "req-21", title: "Revisar lista de alumnos castigados para el Bosque Prohibido", status: "pendiente", date: "2026-10-06" }
      ]
    },
    {
      id: "cli-3",
      name: "Xenophilius Lovegood",
      company: "El Quisquilloso (The Quibbler Publishing)",
      email: "xeno@thequibbler.mag",
      phone: "+44 1865 920 440",
      ratePerHour: 35,
      services: "Edición de Ensayos Mágicos, Corrección de Pruebas y Difusión de P.E.D.D.O.",
      status: "activo",
      hoursContracted: 20,
      hoursUsed: 14.5,
      instructions: "Asegurarse de incluir en cada edición una nota sobre los Nargles y los Snorkacks de cuerno arrugado.",
      credentialsVaultLink: "https://quibbler.mag/vault/lovegood-press",
      requests: [
        { id: "req-31", title: "Publicar artículo a doble página sobre la liberación de elfos", status: "en_proceso", date: "2026-10-08" }
      ]
    }
  ],
  timeEntries: [
    {
      id: "tim-1",
      clientId: "cli-2",
      projectId: "prj-1",
      description: "Auditoría de ingredientes de pociones y reactivos en mazmorras con Severus Snape",
      durationMinutes: 120,
      billable: true,
      rate: 50,
      date: "2026-10-08",
      startTime: "09:00",
      endTime: "11:00"
    },
    {
      id: "tim-2",
      clientId: "cli-1",
      projectId: "prj-3",
      description: "Supervisión de prototipo de Turrón de Hemorragia en Callejón Diagon",
      durationMinutes: 45,
      billable: true,
      rate: 55,
      date: "2026-10-07",
      startTime: "16:00",
      endTime: "16:45"
    },
    {
      id: "tim-3",
      clientId: null,
      projectId: null,
      description: "Catalogación de pergaminos antiguos en la Sección Prohibida de la Biblioteca",
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
      name: "Hermione Granger",
      role: "Lead Ops & Prefecta Principal Gryffindor",
      department: "Dirección Estratégica & Prefectura",
      email: "hermione.granger@hogwarts.ac.uk",
      shift: "Jornada Completa & Nocturna",
      attendance: "Presente",
      tasksAssigned: 4,
      avatarColor: "#9C523B"
    },
    {
      id: "mem-2",
      name: "Harry Potter",
      role: "Especialista en Defensa & Enlace Táctico",
      department: "Defensa Contra las Artes Oscuras",
      email: "harry.potter@hogwarts.ac.uk",
      shift: "Guardia Matutina (08:00 - 15:00)",
      attendance: "En Terreno",
      tasksAssigned: 3,
      avatarColor: "#3F6253"
    },
    {
      id: "mem-3",
      name: "Ron Weasley",
      role: "Coordinador de Logística & Quidditch",
      department: "Operaciones & Enlace Sortilegios Weasley",
      email: "ron.weasley@hogwarts.ac.uk",
      shift: "Media Jornada (14:00 - 19:00)",
      attendance: "Presente",
      tasksAssigned: 2,
      avatarColor: "#B27D32"
    },
    {
      id: "mem-4",
      name: "Luna Lovegood",
      role: "Investigadora de Enigmas & Pensamiento Lateral",
      department: "Investigación & Criaturas Mágicas",
      email: "luna.lovegood@hogwarts.ac.uk",
      shift: "Horario Flexible",
      attendance: "Presente",
      tasksAssigned: 2,
      avatarColor: "#5B4B70"
    }
  ],
  contacts: [
    {
      id: "con-1",
      name: "Profesor Albus Dumbledore",
      email: "dumbledore@hogwarts.ac.uk",
      phone: "+44 131 496 0001",
      company: "Colegio Hogwarts de Magia y Hechicería",
      role: "Director Supremo de Hogwarts",
      type: "aliado",
      lastInteraction: "2026-10-08 (Consejo Extraordinario)",
      nextFollowUp: "2026-10-15 (Revisión de Hechizos Protectores)",
      notes: "Le gusta que las reuniones comiencen con sorbete de limón."
    },
    {
      id: "con-2",
      name: "Profesor Severus Snape",
      email: "severus.snape@hogwarts.ac.uk",
      phone: "+44 131 496 0002",
      company: "Colegio Hogwarts (Mazmorras)",
      role: "Jefe de Slytherin & Maestro de Pociones",
      type: "profesor",
      lastInteraction: "2026-10-08 (Auditoría Multijugos)",
      nextFollowUp: "2026-10-10 (Inspección de Calderos)",
      notes: "Exige puntualidad matemática y cero desperdicio de bezoares."
    },
    {
      id: "con-3",
      name: "Fred & George Weasley",
      email: "twins@wizardwheezes.co.uk",
      phone: "+44 20 7946 0993",
      company: "Sortilegios Weasley",
      role: "Directores Creativos & Fundadores",
      type: "cliente",
      lastInteraction: "2026-10-07 (Revisión de Ventas)",
      nextFollowUp: "2026-10-09 (Plan de Sucursal Hogsmeade)",
      notes: "Socios estratégicos. Comunicar cualquier alerta de costo con humor pero firmeza."
    },
    {
      id: "con-4",
      name: "Madame Rosmerta",
      email: "rosmerta@threebroomsticks.pub",
      phone: "+44 131 496 0888",
      company: "Las Tres Escobas (Hogsmeade)",
      role: "Propietaria & Anfitriona",
      type: "proveedor",
      lastInteraction: "2026-10-05 (Reserva de Mesa VIP)",
      nextFollowUp: "2026-10-20 (Recepción de Prefectos)",
      notes: "Excelente proveedora de cerveza de mantequilla e hidromiel especiada."
    },
    {
      id: "con-5",
      name: "Garrick Ollivander",
      email: "ollivander@wandsmaker.co.uk",
      phone: "+44 20 7946 0144",
      company: "Ollivanders: Fabricantes de Varitas desde 382 a.C.",
      role: "Maestro Varitólogo",
      type: "proveedor",
      lastInteraction: "2026-09-22 (Revisión de Núcleos de Fénix)",
      nextFollowUp: "2026-11-01 (Mantenimiento de Varita)",
      notes: "Consultor para análisis de flujos de magia y propiedades de madera de vid."
    }
  ],
  finance: {
    monthlyBudget: 8500, // Galeones
    transactions: [
      { id: "trx-1", type: "ingreso", description: "Anticipo 50% Expansión Sortilegios Weasley a Hogsmeade", amount: 3750, category: "Consultoría Estratégica", date: "2026-10-02", client: "Sortilegios Weasley", status: "cobrado" },
      { id: "trx-2", type: "ingreso", description: "Retainer Mensual Gestión Operativa Hogwarts (McGonagall)", amount: 2500, category: "Servicios Prefectura", date: "2026-10-05", client: "Colegio Hogwarts", status: "cobrado" },
      { id: "trx-3", type: "gasto", description: "Compra de Caldero de Oro N° 2 y 25 pergaminos de vitela", amount: 340, category: "Materiales & Pociones", date: "2026-10-03", client: "Operaciones", status: "pagado" },
      { id: "trx-4", type: "gasto", description: "Suscripción anual Revista 'El Trasgo de las Finanzas'", amount: 72, category: "Suscripciones Mágicas", date: "2026-10-06", client: "Operaciones", status: "pagado" },
      { id: "trx-5", type: "ingreso", description: "Honorarios Asesoría salvoconducto Giratiempo Ministerio", amount: 1200, category: "Gestión Ministerial", date: "2026-10-08", client: "Ministerio de Magia", status: "pendiente" },
      { id: "trx-6", type: "gasto", description: "Honorarios de Logística e Inspección Ron Weasley", amount: 850, category: "Equipo Mágico", date: "2026-10-05", client: "Equipo", status: "pagado" }
    ],
    subscriptions: [
      { id: "sub-1", name: "Bóveda Blindada Gringotts Nivel 7", amount: 45, cycle: "mensual", nextRenewal: "2026-11-03", category: "Seguridad & Finanzas", active: true },
      { id: "sub-2", name: "Servicio Express Lechuzas Mensajeras Rápidas", amount: 25, cycle: "mensual", nextRenewal: "2026-10-22", category: "Comunicaciones", active: true },
      { id: "sub-3", name: "Acceso Hemeroteca Archivo Secreto Alejandría", amount: 35, cycle: "mensual", nextRenewal: "2026-10-18", category: "Investigación", active: true },
      { id: "sub-4", name: "Red Flu Corporativa Privada (Hogwarts - Londres)", amount: 20, cycle: "mensual", nextRenewal: "2026-10-25", category: "Transporte Mágico", active: true }
    ],
    subscriptionHistory: [
      {
        id: "sub-hist-1",
        subscriptionId: "sub-1",
        subscriptionName: "Bóveda Blindada Gringotts Nivel 7",
        date: "2026-10-01",
        action: "Ajuste de Tarifa",
        oldPrice: 40,
        newPrice: 45,
        oldCycle: "mensual",
        newCycle: "mensual",
        note: "Actualización de cuota de mantenimiento de protecciones anti-ladrones certificadas por duendes de Gringotts."
      },
      {
        id: "sub-hist-2",
        subscriptionId: "sub-2",
        subscriptionName: "Servicio Express Lechuzas Mensajeras Rápidas",
        date: "2026-09-18",
        action: "Alta de Suscripción",
        oldPrice: 0,
        newPrice: 25,
        oldCycle: "-",
        newCycle: "mensual",
        note: "Contratación de lechuza real de alta velocidad para comunicaciones urgentes con el Ministerio de Magia."
      }
    ],
    budgetCategories: [
      { category: "Materiales & Pociones", allocated: 1200, spent: 980 },
      { category: "Equipo Mágico & Nómina", allocated: 3500, spent: 2600 },
      { category: "Pergaminos & Burocracia", allocated: 800, spent: 340 },
      { category: "Logística, Lechuzas & Red Flu", allocated: 600, spent: 280 }
    ]
  },
  notes: [
    {
      id: "not-1",
      title: "Minuta: Reunión Estratégica del Ejército de Dumbledore en la Sala de los Menesteres",
      type: "minuta",
      category: "Reuniones",
      updatedAt: "2026-10-05",
      pinned: true,
      tags: ["Dumbledore", "Defensa", "Encantamientos"],
      content: `### Acuerdos de la Sesión:
1. Coordinar sesiones semanales de Encantamiento Patronus incorpóreo para todos los miembros.
2. Harry liderará las prácticas de Desarme (Expelliarmus) y Aturdimiento (Stupefy).
3. Hermione preparará Galeones falsos encantados con Hechizo Proteico para comunicar horarios discretamente.

### Tareas Asignadas y Próximos Pasos:
* [x] Hermione graba la fecha de la próxima reunión en los bordes de los galeones.
* [ ] Ron inspecciona el pasadizo detrás del retrato de Arianna Dumbledore.
* [ ] Siguiente práctica: Martes a las 20:00 al sonar la campana de la torre.`
    },
    {
      id: "not-2",
      title: "Plantilla: Formulación y Control de Pociones Complejas de Alta Precisión",
      type: "plantilla",
      category: "Plantillas",
      updatedAt: "2026-10-01",
      pinned: true,
      tags: ["Pociones", "Snape", "Protocolo"],
      content: `### Protocolo de Elaboración Alquímica:
* **Nombre de la Poción:** [Completar]
* **Clasificación de Dificultad:** [T.I.M.O. / É.X.T.A.S.I.S. / Maestre]
* **Tiempo Total de Ebullición:** [Horas / Días / Fases Lunares]
* **Color y Textura Esperada:** [ej: Nácar brillante con vapor en espirales]

### Control de Insumos Críticos:
* [ ] Verificación de pureza en balanza de latón.
* [ ] Temperatura del caldero ajustada con fuego azul hermético.
* [ ] Enfriamiento gradual y embotellado en frascos de cristal sellados.`
    },
    {
      id: "not-3",
      title: "Ideas Rápidas de Hermione: Giratiempo, Biblioteca y Crookshanks",
      type: "rapida",
      category: "Estrategia",
      updatedAt: "2026-10-08",
      pinned: false,
      tags: ["Ideas", "Giratiempo", "Crookshanks"],
      content: `- Reservar las primeras horas del amanecer (06:00 - 08:30) para estudio intensivo en la Torre de Gryffindor.
- Verificar que Crookshanks tenga siempre su cuenco con agua fresca y aperitivos antes de salir a la ronda nocturna.
- Pedir a Madam Pince el permiso especial para consultar 'Moste Potente Potions' en la Sección Prohibida.`
    }
  ],
  personal: {
    habits: [
      { id: "hab-1", name: "Lectura de 'Historia de la Magia' (30 min)", icon: "📖", streak: 19, days: { "2026-10-04": true, "2026-10-05": true, "2026-10-06": true, "2026-10-07": true, "2026-10-08": true } },
      { id: "hab-2", name: "Práctica de Encantamiento Patronus (Nutria)", icon: "✨", streak: 12, days: { "2026-10-05": true, "2026-10-06": true, "2026-10-07": true, "2026-10-08": true } },
      { id: "hab-3", name: "Paseo por el Lago Negro (evitar calamar)", icon: "🌊", streak: 8, days: { "2026-10-06": true, "2026-10-07": true, "2026-10-08": false } },
      { id: "hab-4", name: "Cepillar y cuidar a Crookshanks", icon: "🐱", streak: 21, days: { "2026-10-04": true, "2026-10-05": true, "2026-10-06": true, "2026-10-07": true, "2026-10-08": true } },
      { id: "hab-5", name: "Cero pergaminos después de las 22:30", icon: "🌙", streak: 6, days: { "2026-10-06": true, "2026-10-07": true, "2026-10-08": false } }
    ],
    routines: [
      { id: "rou-1", title: "Ritual Matutino en la Torre de Gryffindor", period: "manana", time: "06:30", completed: true, items: ["Vaso de agua de manantial y té con Madam Pomfrey", "Revisión del horario de 12 clases simultáneas", "Calibración preventiva del Giratiempo", "Caricias matutinas a Crookshanks"] },
      { id: "rou-2", title: "Estudio Silencioso en la Biblioteca", period: "tarde", time: "17:00", completed: false, items: ["Entrega de pergaminos caligrafiados a Profesora McGonagall", "Comprobar avances en la campaña P.E.D.D.O.", "Limpiar plumas de fénix y ordenar tinteros"] },
      { id: "rou-3", title: "Toque de Queda & Ronda de Prefectos", period: "noche", time: "21:45", completed: false, items: ["Patrullaje del tercer piso y pasillo de la biblioteca con Ron", "Verificar que ningún alumno esté fuera de la sala común", "Revisar encantamiento de la Señora Gorda antes de dormir"] }
    ],
    goals: [
      { id: "gol-1", title: "Obtener 12 T.I.M.O.s con calificación de Extraordinario", category: "Académico", progress: 92, targetDate: "Junio 2027" },
      { id: "gol-2", title: "Aprobación de la Carta de Derechos para Elfos Domésticos (P.E.D.D.O.)", category: "Causas Sociales", progress: 65, targetDate: "Diciembre 2026" },
      { id: "gol-3", title: "Dominar Hechizos Protectores Avanzados sin Varita", category: "Magia Avanzada", progress: 80, targetDate: "Noviembre 2026" },
      { id: "gol-4", title: "Construir Archivo Secreto en la Sala de los Menesteres", category: "Investigación", progress: 45, targetDate: "Marzo 2027" }
    ],
    shoppingList: [
      { id: "shp-1", item: "Caldero de latón N° 2 para pociones avanzadas", category: "Mazmorras", bought: false },
      { id: "shp-2", item: "Frasco de lágrimas de fénix purificadas", category: "Alquimia", bought: true },
      { id: "shp-3", item: "Plumas de águila con punta de diamante", category: "Papelería Mágica", bought: true },
      { id: "shp-4", item: "Snacks mágicos crujientes de atún para Crookshanks", category: "Mascota", bought: false }
    ]
  },
  // REGLAS AVANZADAS CON CONTROL TOTAL DE HORARIOS, PREDICCIONES DE TIEMPO Y COSTOS
  automations: [
    {
      id: "aut-1",
      name: "Predicción de Retraso Crítico en Elaboración de Pociones",
      category: "tiempos",
      riskLevel: "critico",
      scheduleType: "cada_hora",
      scheduleLabel: "🔄 Cada Hora Continuamente",
      timeLeadHours: 6,
      timeRiskCondition: "subtasks_pending",
      costThresholdPct: 85,
      costScope: "both",
      trigger: "Faltan < 6h para entrega y quedan ingredientes/subtareas pendientes",
      action: "Marcar tarea en rojo, emitir alerta sonora y calcular horas de holgura",
      notificationTone: "alerta",
      enabled: true,
      lastRun: "Hoy a las 09:30"
    },
    {
      id: "aut-2",
      name: "Control Preventivo de Sobrecosto en Sortilegios Weasley",
      category: "costos",
      riskLevel: "critico",
      scheduleType: "tiempo_real",
      scheduleLabel: "⚡ Tiempo Real al Modificar",
      timeLeadHours: 24,
      timeRiskCondition: "deadline",
      costThresholdPct: 85,
      costScope: "both",
      trigger: "Gasto de proyecto o consumo de horas del cliente supera el 85%",
      action: "Calcular desvío proyectado en Galeones y registrar advertencia preventiva",
      notificationTone: "chime",
      enabled: true,
      lastRun: "Hace 15m"
    },
    {
      id: "aut-3",
      name: "Detección de Conflicto Horario y Salto de Giratiempo",
      category: "eventos",
      riskLevel: "advertencia",
      scheduleType: "tiempo_real",
      scheduleLabel: "⚡ Tiempo Real al Agendar",
      timeLeadHours: 2,
      timeRiskCondition: "always",
      costThresholdPct: 80,
      costScope: "both",
      trigger: "Solapamiento de dos compromisos simultáneos sin salvoconducto",
      action: "Mostrar ventana de alerta de conflicto temporal y exigir confirmación",
      notificationTone: "alerta",
      enabled: true,
      lastRun: "En vivo"
    },
    {
      id: "aut-4",
      name: "Alerta Predictiva de Agotamiento de Bóveda Gringotts",
      category: "costos",
      riskLevel: "advertencia",
      scheduleType: "semanal_lunes",
      scheduleLabel: "📅 Semanal (Lunes 09:00 AM)",
      timeLeadHours: 48,
      timeRiskCondition: "deadline",
      costThresholdPct: 90,
      costScope: "projects",
      trigger: "Presupuesto mensual ejecutado excede el 90% antes de fin de mes",
      action: "Congelar compras extraordinarias y emitir pergamino de auditoría",
      notificationTone: "chime",
      enabled: true,
      lastRun: "Lunes pasado"
    },
    {
      id: "aut-5",
      name: "Recordatorio Mágico de Ronda Nocturna de Prefectos",
      category: "general",
      riskLevel: "info",
      scheduleType: "diario_18",
      scheduleLabel: "🌇 Diario Vespertino (18:00 PM)",
      timeLeadHours: 4,
      timeRiskCondition: "always",
      costThresholdPct: 70,
      costScope: "both",
      trigger: "Diariamente al caer la tarde en el Gran Comedor",
      action: "Notificación de alistamiento de linterna, varita y mapa de Hogwarts",
      notificationTone: "click",
      enabled: true,
      lastRun: "Ayer 18:00"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Predicción de Retraso de Poción",
      message: "La preparación de Poción Multijugos vence hoy a las 11:00 y tiene 2 subtareas pendientes (holgura restante: 1.5h).",
      time: "Hace 10m",
      type: "alerta",
      read: false
    },
    {
      id: "notif-2",
      title: "Alerta Presupuestaria Sortilegios Weasley",
      message: "Sortilegios Weasley ha consumido 6,400 G de 7,500 G (85.3%). Desvío proyectado: +320 Galeones.",
      time: "Hace 45m",
      type: "sistema",
      read: false
    },
    {
      id: "notif-3",
      title: "Giratiempo Sincronizado",
      message: "Clases simultáneas de Aritmancia y Runas Antiguas calibradas sin paradojas temporales.",
      time: "Ayer",
      type: "recordatorio",
      read: true
    }
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
        const parsed = JSON.parse(stored);
        // Verificar que contenga los datos temáticos actualizados
        if (parsed && parsed.profile && parsed.profile.name === "Hermione Granger") {
          if (!parsed.finance) parsed.finance = {};
          if (!parsed.finance.subscriptionHistory) {
            parsed.finance.subscriptionHistory = INITIAL_DATA.finance.subscriptionHistory || [];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error leyendo localStorage, cargando datos iniciales de Hogwarts", e);
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

  toggleTaskComplete(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task) {
      const isDone = task.status === 'completada';
      if (isDone) {
        const hasCompletedSubtasks = (task.subtasks || []).some(s => s.completed);
        task.status = hasCompletedSubtasks ? 'en_proceso' : 'pendiente';
      } else {
        task.status = 'completada';
      }
      // Las subtareas individuales son independientes y no se alteran
      this.saveData();
      return task;
    }
    return null;
  }

  toggleSubtask(taskId, subtaskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      const sub = task.subtasks.find(s => s.id === subtaskId);
      if (sub) {
        sub.completed = !sub.completed;
        
        const total = task.subtasks.length;
        const completedCount = task.subtasks.filter(s => s.completed).length;

        if (total > 0) {
          if (completedCount === total) {
            task.status = 'completada';
          } else if (completedCount >= 1) {
            task.status = 'en_proceso';
          } else {
            task.status = 'pendiente';
          }
        }

        this.saveData();
        return sub;
      }
    }
    return null;
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

  toggleEventComplete(id) {
    const ev = (this.data.events || []).find(e => e.id === id);
    if (ev) {
      ev.completed = !ev.completed;
      this.saveData();
      return ev;
    }
    return null;
  }

  checkScheduleConflict(date, startTime, endTime, excludeEventId = null) {
    return this.data.events.filter(e => {
      if (e.id === excludeEventId) return false;
      if (e.date !== date) return false;
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

  // Operaciones de Hitos / Entregables de Proyectos
  addDeliverable(projectId, deliverable) {
    const proj = (this.data.projects || []).find(p => p.id === projectId);
    if (!proj) return null;
    if (!proj.deliverables) proj.deliverables = [];
    if (!deliverable.id) deliverable.id = 'del-' + Date.now();
    if (deliverable.completed === undefined) deliverable.completed = false;
    proj.deliverables.push(deliverable);
    
    // Recalcular progreso automático
    const total = proj.deliverables.length;
    const done = proj.deliverables.filter(d => d.completed).length;
    if (total > 0) {
      proj.progress = Math.round((done / total) * 100);
    }
    this.saveData();
    return deliverable;
  }

  updateDeliverable(projectId, deliverableId, updates) {
    const proj = (this.data.projects || []).find(p => p.id === projectId);
    if (!proj || !proj.deliverables) return null;
    const idx = proj.deliverables.findIndex(d => d.id === deliverableId);
    if (idx !== -1) {
      proj.deliverables[idx] = { ...proj.deliverables[idx], ...updates };
      const total = proj.deliverables.length;
      const done = proj.deliverables.filter(d => d.completed).length;
      if (total > 0) {
        proj.progress = Math.round((done / total) * 100);
      }
      this.saveData();
      return proj.deliverables[idx];
    }
    return null;
  }

  deleteDeliverable(projectId, deliverableId) {
    const proj = (this.data.projects || []).find(p => p.id === projectId);
    if (!proj || !proj.deliverables) return null;
    proj.deliverables = proj.deliverables.filter(d => d.id !== deliverableId);
    const total = proj.deliverables.length;
    const done = proj.deliverables.filter(d => d.completed).length;
    proj.progress = total > 0 ? Math.round((done / total) * 100) : 0;
    this.saveData();
    return true;
  }

  toggleDeliverable(projectId, deliverableId) {
    const proj = (this.data.projects || []).find(p => p.id === projectId);
    if (!proj || !proj.deliverables) return null;
    const del = proj.deliverables.find(d => d.id === deliverableId);
    if (del) {
      del.completed = !del.completed;
      const total = proj.deliverables.length;
      const done = proj.deliverables.filter(d => d.completed).length;
      if (total > 0) {
        proj.progress = Math.round((done / total) * 100);
      }
      this.saveData();
      return del;
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
    if (entry.clientId) {
      const client = this.data.clients.find(c => c.id === entry.clientId);
      if (client) {
        client.hoursUsed = (client.hoursUsed || 0) + (entry.durationMinutes / 60);
      }
    }
    this.saveData();
    return entry;
  }

  addClientRequest(clientId, request) {
    if (!request.id) request.id = 'req-' + Date.now();
    if (!request.date) request.date = new Date().toISOString().split('T')[0];
    if (!request.status) request.status = 'pendiente';
    const client = (this.data.clients || []).find(c => c.id === clientId);
    if (client) {
      if (!client.requests) client.requests = [];
      client.requests.unshift(request);
      this.saveData();
      return request;
    }
    return null;
  }

  addCollaborator(collab) {
    if (!collab.id) collab.id = 'mem-' + Date.now();
    if (!collab.tasksAssigned) collab.tasksAssigned = 0;
    if (!collab.attendance) collab.attendance = 'Presente';
    if (!collab.avatarColor) collab.avatarColor = '#9C523B';
    if (!this.data.team) this.data.team = [];
    this.data.team.push(collab);
    this.saveData();
    return collab;
  }

  // Operaciones de Directorio de Contactos
  addContact(contact) {
    if (!contact.id) contact.id = 'con-' + Date.now();
    if (!this.data.contacts) this.data.contacts = [];
    this.data.contacts.unshift(contact);
    this.saveData();
    return contact;
  }

  updateContact(id, updates) {
    if (!this.data.contacts) this.data.contacts = [];
    const idx = this.data.contacts.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.contacts[idx] = { ...this.data.contacts[idx], ...updates };
      this.saveData();
      return this.data.contacts[idx];
    }
    return null;
  }

  deleteContact(id) {
    if (!this.data.contacts) this.data.contacts = [];
    this.data.contacts = this.data.contacts.filter(c => c.id !== id);
    this.saveData();
  }

  assignContactToTeam({ contactId, department, role, shift, attendance, avatarColor }) {
    if (!this.data.team) this.data.team = [];
    const contact = (this.data.contacts || []).find(c => c.id === contactId);
    if (!contact) return null;

    const existingIdx = this.data.team.findIndex(m => m.contactId === contactId || m.name.toLowerCase() === contact.name.toLowerCase());
    
    if (existingIdx !== -1) {
      this.data.team[existingIdx] = {
        ...this.data.team[existingIdx],
        department: department || this.data.team[existingIdx].department,
        role: role || contact.role || this.data.team[existingIdx].role,
        shift: shift || this.data.team[existingIdx].shift,
        attendance: attendance || this.data.team[existingIdx].attendance,
        avatarColor: avatarColor || this.data.team[existingIdx].avatarColor,
        contactId: contact.id
      };
      this.saveData();
      return this.data.team[existingIdx];
    } else {
      const newMember = {
        id: 'mem-' + Date.now(),
        contactId: contact.id,
        name: contact.name,
        role: role || contact.role || 'Colaborador Especialista',
        department: department || 'Dirección Estratégica & Prefectura',
        email: contact.email || '',
        phone: contact.phone || '',
        shift: shift || 'Jornada Completa (08:00 - 16:00)',
        attendance: attendance || 'Presente',
        avatarColor: avatarColor || '#9C523B',
        tasksAssigned: 0
      };
      this.data.team.push(newMember);
      this.saveData();
      return newMember;
    }
  }

  // Operaciones de Finanzas
  addTransaction(trx) {
    if (!trx.id) trx.id = 'trx-' + Date.now();
    this.data.finance.transactions.unshift(trx);
    this.saveData();
    return trx;
  }

  // Operaciones de Suscripciones y Registro de Auditoría
  addSubscription(sub, note = "") {
    if (!sub.id) sub.id = 'sub-' + Date.now();
    if (sub.active === undefined) sub.active = true;
    if (!this.data.finance.subscriptions) this.data.finance.subscriptions = [];
    if (!this.data.finance.subscriptionHistory) this.data.finance.subscriptionHistory = [];
    
    this.data.finance.subscriptions.push(sub);
    this.data.finance.subscriptionHistory.unshift({
      id: 'sub-hist-' + Date.now(),
      subscriptionId: sub.id,
      subscriptionName: sub.name,
      date: new Date().toISOString().split('T')[0],
      action: "Alta de Suscripción",
      oldPrice: 0,
      newPrice: Number(sub.amount),
      oldCycle: "-",
      newCycle: sub.cycle || "mensual",
      note: note.trim() || "Nueva suscripción agregada al control financiero."
    });
    this.saveData();
    return sub;
  }

  updateSubscription(id, updates, note = "") {
    if (!this.data.finance.subscriptions) this.data.finance.subscriptions = [];
    if (!this.data.finance.subscriptionHistory) this.data.finance.subscriptionHistory = [];
    const idx = this.data.finance.subscriptions.findIndex(s => s.id === id);
    if (idx !== -1) {
      const oldSub = this.data.finance.subscriptions[idx];
      const oldPrice = oldSub.amount;
      const oldCycle = oldSub.cycle;
      this.data.finance.subscriptions[idx] = { ...oldSub, ...updates };
      const newSub = this.data.finance.subscriptions[idx];

      let actionDesc = "Actualización de Parámetros";
      if (updates.amount !== undefined && Number(updates.amount) !== Number(oldPrice)) {
        actionDesc = `Cambio de Precio (${oldPrice} G ➔ ${updates.amount} G)`;
      } else if (updates.cycle !== undefined && updates.cycle !== oldCycle) {
        actionDesc = `Cambio de Plan (${oldCycle} ➔ ${updates.cycle})`;
      } else if (updates.active !== undefined) {
        actionDesc = updates.active ? "Reactivación de Plan" : "Pausa / Baja Temporal";
      }

      this.data.finance.subscriptionHistory.unshift({
        id: 'sub-hist-' + Date.now(),
        subscriptionId: id,
        subscriptionName: newSub.name,
        date: new Date().toISOString().split('T')[0],
        action: actionDesc,
        oldPrice: Number(oldPrice),
        newPrice: Number(newSub.amount),
        oldCycle: oldCycle,
        newCycle: newSub.cycle,
        note: note.trim() || `Modificación de plan realizada el ${new Date().toLocaleDateString()}.`
      });
      this.saveData();
      return newSub;
    }
    return null;
  }

  deleteSubscription(id, note = "") {
    if (!this.data.finance.subscriptions) return;
    if (!this.data.finance.subscriptionHistory) this.data.finance.subscriptionHistory = [];
    const sub = this.data.finance.subscriptions.find(s => s.id === id);
    if (sub) {
      this.data.finance.subscriptionHistory.unshift({
        id: 'sub-hist-' + Date.now(),
        subscriptionId: id,
        subscriptionName: sub.name,
        date: new Date().toISOString().split('T')[0],
        action: "Cancelación / Baja Definitiva",
        oldPrice: Number(sub.amount),
        newPrice: 0,
        oldCycle: sub.cycle,
        newCycle: "cancelada",
        note: note.trim() || "Baja voluntaria del servicio suscrito."
      });
      this.data.finance.subscriptions = this.data.finance.subscriptions.filter(s => s.id !== id);
      this.saveData();
    }
  }

  addSubscriptionNote(subscriptionId, noteText) {
    if (!this.data.finance.subscriptionHistory) this.data.finance.subscriptionHistory = [];
    const sub = (this.data.finance.subscriptions || []).find(s => s.id === subscriptionId);
    this.data.finance.subscriptionHistory.unshift({
      id: 'sub-hist-' + Date.now(),
      subscriptionId: subscriptionId || 'general',
      subscriptionName: sub ? sub.name : 'Anotación Financiera',
      date: new Date().toISOString().split('T')[0],
      action: "Nota Informativa",
      oldPrice: sub ? sub.amount : 0,
      newPrice: sub ? sub.amount : 0,
      oldCycle: sub ? sub.cycle : '-',
      newCycle: sub ? sub.cycle : '-',
      note: noteText.trim()
    });
    this.saveData();
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

  // Operaciones Personales
  toggleHabit(habitId, dateStr) {
    const habit = this.data.personal.habits.find(h => h.id === habitId);
    if (habit) {
      if (!habit.days) habit.days = {};
      habit.days[dateStr] = !habit.days[dateStr];
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

  addPersonalHabit(habit) {
    if (!habit.id) habit.id = 'hab-' + Date.now();
    if (!habit.days) habit.days = {};
    if (habit.streak === undefined) habit.streak = 0;
    if (!this.data.personal.habits) this.data.personal.habits = [];
    this.data.personal.habits.push(habit);
    this.saveData();
    return habit;
  }

  deletePersonalHabit(id) {
    if (!this.data.personal.habits) return;
    this.data.personal.habits = this.data.personal.habits.filter(h => h.id !== id);
    this.saveData();
  }

  addPersonalGoal(goal) {
    if (!goal.id) goal.id = 'gol-' + Date.now();
    if (goal.progress === undefined) goal.progress = 0;
    if (!this.data.personal.goals) this.data.personal.goals = [];
    this.data.personal.goals.push(goal);
    this.saveData();
    return goal;
  }

  updatePersonalGoal(id, updates) {
    if (!this.data.personal.goals) return null;
    const g = this.data.personal.goals.find(goal => goal.id === id);
    if (g) {
      Object.assign(g, updates);
      this.saveData();
      return g;
    }
    return null;
  }

  deletePersonalGoal(id) {
    if (!this.data.personal.goals) return;
    this.data.personal.goals = this.data.personal.goals.filter(g => g.id !== id);
    this.saveData();
  }

  // OPERACIONES Y MOTOR PREDICTIVO DE AUTOMATIZACIONES
  addAutomationRule(rule) {
    if (!rule.id) rule.id = 'aut-' + Date.now();
    if (!rule.lastRun) rule.lastRun = 'Recién creada';
    if (!this.data.automations) this.data.automations = [];
    this.data.automations.unshift(rule);
    this.saveData();
    return rule;
  }

  updateAutomationRule(id, updates) {
    const idx = (this.data.automations || []).findIndex(r => r.id === id);
    if (idx !== -1) {
      this.data.automations[idx] = { ...this.data.automations[idx], ...updates };
      this.saveData();
      return this.data.automations[idx];
    }
    return null;
  }

  deleteAutomationRule(id) {
    this.data.automations = (this.data.automations || []).filter(r => r.id !== id);
    this.saveData();
  }

  toggleAutomationRule(id) {
    const rule = (this.data.automations || []).find(r => r.id === id);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.saveData();
      return rule;
    }
    return null;
  }

  // MOTOR DE DIAGNÓSTICO Y PREDICCIÓN EN TIEMPO REAL (TIEMPOS & COSTOS)
  runPredictionsDiagnostic() {
    const tasks = this.data.tasks || [];
    const projects = this.data.projects || [];
    const clients = this.data.clients || [];
    const automations = this.data.automations || [];

    const timeRisks = [];
    const costRisks = [];
    const now = new Date();

    // 1. Diagnóstico Predictivo de Tiempos & Holguras
    tasks.forEach(task => {
      if (task.status === 'completada' || task.status === 'cancelada') return;

      const subtasks = task.subtasks || [];
      const completedSub = subtasks.filter(s => s.completed).length;
      const subtaskPct = subtasks.length > 0 ? Math.round((completedSub / subtasks.length) * 100) : 0;

      // Calcular holgura horaria estimada
      let hoursRemaining = 8; // fallback
      if (task.dueDate) {
        const dueDateTime = new Date(`${task.dueDate}T${task.endTime || '18:00'}`);
        const diffMs = dueDateTime.getTime() - now.getTime();
        hoursRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60) * 10) / 10);
      }

      // Evaluar contra reglas activas de tiempos
      const activeTimeRules = automations.filter(r => r.enabled && (r.category === 'tiempos' || r.category === 'general'));
      const minThreshold = activeTimeRules.length > 0 ? Math.min(...activeTimeRules.map(r => r.timeLeadHours || 6)) : 6;

      let riskLevel = 'optimo';
      let reason = 'Dentro del cronograma previsto';

      if (hoursRemaining <= minThreshold) {
        if (subtasks.length > 0 && subtaskPct < 70) {
          riskLevel = 'critico';
          reason = `Holgura crítica (${hoursRemaining}h restantes) con solo ${subtaskPct}% de subtareas completadas.`;
        } else {
          riskLevel = 'alerta';
          reason = `Vencimiento próximo en menos de ${hoursRemaining}h.`;
        }
      }

      timeRisks.push({
        taskId: task.id,
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate,
        endTime: task.endTime,
        hoursRemaining,
        subtaskPct,
        riskLevel,
        reason
      });
    });

    // 2. Diagnóstico Predictivo de Costos y Presupuestos (Galeones)
    projects.forEach(project => {
      const budget = project.budget || 1;
      const spent = project.spent || 0;
      const pct = Math.round((spent / budget) * 100);
      const remainingGalleons = budget - spent;

      // Estimar desviación futura basada en entregables pendientes
      const deliverables = project.deliverables || [];
      const pendingDeliverables = deliverables.filter(d => !d.completed).length;
      const projectedOverrun = (pct >= 85 && pendingDeliverables > 0) ? Math.round(spent * 0.12) : 0;

      let riskLevel = 'optimo';
      if (pct >= 90) riskLevel = 'critico';
      else if (pct >= 80) riskLevel = 'alerta';

      costRisks.push({
        type: 'proyecto',
        id: project.id,
        title: project.title,
        budget,
        spent,
        pct,
        remainingGalleons,
        projectedOverrun,
        riskLevel,
        clientName: project.clientId ? (clients.find(c => c.id === project.clientId)?.company || 'Cliente') : 'Interno'
      });
    });

    // Diagnóstico en paquetes de horas de clientes
    clients.forEach(client => {
      const contracted = client.hoursContracted || 1;
      const used = client.hoursUsed || 0;
      const pct = Math.round((used / contracted) * 100);
      const remainingHours = Math.max(0, Math.round((contracted - used) * 10) / 10);

      let riskLevel = 'optimo';
      if (pct >= 90) riskLevel = 'critico';
      else if (pct >= 80) riskLevel = 'alerta';

      costRisks.push({
        type: 'cliente_horas',
        id: client.id,
        title: `${client.company} (${client.name})`,
        budget: contracted,
        spent: used,
        pct,
        remainingGalleons: remainingHours,
        projectedOverrun: pct > 85 ? Math.round((used - contracted + 5) * (client.ratePerHour || 45)) : 0,
        riskLevel,
        clientName: client.company
      });
    });

    // Actualizar última ejecución en reglas activas
    automations.forEach(r => {
      if (r.enabled) {
        r.lastRun = 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });

    this.saveData();

    return {
      timeRisks,
      costRisks,
      criticalTimeCount: timeRisks.filter(r => r.riskLevel === 'critico').length,
      criticalCostCount: costRisks.filter(r => r.riskLevel === 'critico').length,
      totalAuditedRules: automations.filter(r => r.enabled).length
    };
  }

  // Operaciones de Notificaciones
  markNotificationRead(id) {
    const n = (this.data.notifications || []).find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveData();
    }
  }

  toggleNotificationRead(id) {
    const n = (this.data.notifications || []).find(item => item.id === id);
    if (n) {
      n.read = !n.read;
      this.saveData();
      return n;
    }
    return null;
  }

  clearReadNotifications() {
    this.data.notifications = (this.data.notifications || []).filter(n => !n.read);
    this.saveData();
  }

  markAllNotificationsRead() {
    (this.data.notifications || []).forEach(n => { n.read = true; });
    this.saveData();
  }

  // Backup & Restauración
  exportBackup() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Agenda_Notes_Hogwarts_Backup_${new Date().toISOString().split('T')[0]}.json`;
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

// Instancia global accesible por toda la aplicación
window.plannerStore = new Store();
