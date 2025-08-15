export interface WorkExperience {
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    responsibilities: string[];
    technologiesUsed: string[];
    location: string;
    icon?: string;
    companyColor?: string;
}

export const workExperiences: { [lang: string]: WorkExperience[] } = {
    'es': [
        {
            company: "Freelance",
            position: "Desarrollador Front-End",
            startDate: new Date(2021, 3, 1), // Abril 2021
            endDate: null,
            responsibilities: [
                "Desarrollé aplicaciones web y mobile multiplataforma orientadas al sector salud",
                "Participé en el diseño e implementación de soluciones para instituciones médicas",
                "Implementé gestión de turnos, historias clínicas y seguimiento de pacientes",
                "Creé componentes reutilizables y navegación fluida",
                "Integré servicios backend mediante APIs REST",
                "Prioricé usabilidad y accesibilidad para perfiles de usuario clínicos",
                "Contribuí a la digitalización de procesos internos en centros de salud"
            ],
            technologiesUsed: ["Angular 18", "Ionic 8", "TypeScript", "APIs REST"],
            location: "Remote",
            icon: "freelance.jpg",
            companyColor: '#fe930f'
        },
        {
            company: "Scoutt Inc.",
            position: "Desarrollador Front-End Angular",
            startDate: new Date(2024, 11, 1), // Diciembre 2024
            endDate: new Date(2025, 7, 1),
            responsibilities: [
                "Participé en el desarrollo de una plataforma SaaS en Angular 19 para una startup en etapa inicial",
                "Construí un MVP que ayuda a compañías a formar equipos de ingeniería, utilizando IA para seleccionar candidatos",
                "Implementé interfaces modernas y componentes reutilizables",
                "Desarrollé lógica de integración con APIs",
                "Prioricé velocidad de entrega, escalabilidad y experiencia de usuario"
            ],
            technologiesUsed: ["Angular 19", "TypeScript", "APIs", "IA"],
            location: "Remote",
            icon: "scoutt_co.jpg",
            companyColor: "#36f"
        },
        {
            company: "Infocorp Group",
            position: "Desarrollador Senior",
            startDate: new Date(2021, 5, 1), // Junio 2021
            endDate: new Date(2024, 11, 31), // Diciembre 2024
            responsibilities: [
                "Brindé soporte técnico y realicé diagnóstico de errores en plataforma de marketing digital",
                "Trabajé con instituciones financieras de gran escala",
                "Desarrollé integraciones nativas personalizadas para frameworks híbridos",
                "Mejoré la interoperabilidad con servicios del dispositivo",
                "Optimicé el rendimiento en funciones críticas",
                "Garanticé estabilidad, escalabilidad y experiencia de usuario en entornos exigentes"
            ],
            technologiesUsed: ["Ionic", "React Native", "JavaScript", "TypeScript"],
            location: "Argentina",
            icon: "icorp.png",
            companyColor: "#2196f3"
        },
        {
            company: "Flux IT",
            position: "Desarrollador Front-End",
            startDate: new Date(2020, 8, 1), // Septiembre 2020
            endDate: new Date(2021, 5, 30), // Junio 2021
            responsibilities: [
                "Desarrollé aplicaciones móviles híbridas multiplataforma",
                "Participé en la creación de librerías internas",
                "Desarrollé funcionalidades reutilizables y componentes visuales personalizados",
                "Facilité la estandarización del diseño y aceleré el desarrollo de nuevas apps",
                "Apliqué buenas prácticas de arquitectura modular",
                "Implementé control de versiones y documentación técnica"
            ],
            technologiesUsed: ["Ionic 5", "Angular", "TypeScript", "JavaScript"],
            location: "Argentina",
            icon: "flux_it.png",
            companyColor: "#326ae7"
        },
        {
            company: "Kapsch Trafficom Argentina (a través de ITWarp)",
            position: "Desarrollador .NET",
            startDate: new Date(2020, 0, 1), // Enero 2020
            endDate: new Date(2020, 5, 30), // Junio 2020
            responsibilities: [
                "Realicé diagnóstico y resolución de bugs en proyectos basados en la plataforma de Kapsch",
                "Trabajé sobre el core back-end y código customizado de cada implementación",
                "Analicé y corregí errores en entornos productivos y de prueba",
                "Aseguré la estabilidad de soluciones críticas para distintos clientes",
                "Realicé análisis de logs y depuración avanzada",
                "Mantuve comunicación directa con equipos funcionales y técnicos"
            ],
            technologiesUsed: ["C#", ".NET", "Debugging", "Log Analysis"],
            location: "Argentina",
            icon: "kapsch.jpg",
            companyColor: "#eaca3e"
        },
        {
            company: "Huenei IT Services",
            position: "Desarrollador de Software",
            startDate: new Date(2016, 7, 1), // Agosto 2016
            endDate: new Date(2020, 0, 31), // Enero 2020
            responsibilities: [
                "Desarrollé diversas soluciones web y mobile utilizando Ionic 3/4, Angular y .NET Web API",
                "Trabajé en app híbrida para gestión de turnos virtuales",
                "Desarrollé sitio de e-commerce con Angular y Web API",
                "Integré Todo Pago y ElasticSearch para mejorar búsquedas y experiencia del usuario",
                "Desarrollé múltiples Web APIs para aplicaciones móviles internas de Aeropuertos Argentina 2000",
                "Creé plataformas de gestión documental y sitio web del Aeropuerto Internacional de Armenia",
                "Apliqué diseño responsive y enfoque mobile-first"
            ],
            technologiesUsed: ["Ionic 3/4", "Angular", ".NET Web API", "jQuery", "Bootstrap", "ElasticSearch", "Todo Pago"],
            location: "Argentina",
            icon: "huenei.webp",
            companyColor: "#f08830"
        },
        {
            company: "Itrio S.A.",
            position: "Desarrollador .NET",
            startDate: new Date(2014, 0, 1), // Enero 2014
            endDate: new Date(2016, 6, 31), // Julio 2016
            responsibilities: [
                "Presté servicios tercerizados en empresas del sector financiero (Banco Hipotecario y Prisma Medios de Pago)",
                "Realicé mantenimiento de Intranet institucional y sitios web (desktop y mobile) en Banco Hipotecario",
                "Desarrollé página completa de solicitud de tarjetas con jQuery y Bootstrap 3",
                "Creé triggers para logueo de accesos y componente en Java para registrar consultas",
                "Me desempeñé como administrador de bases de datos SQL Server en Prisma",
                "Ejecuté y validé scripts, gestioné accesos de usuarios y resolví errores en DTS y Jobs",
                "Realicé tareas de backup y restore",
                "Desarrollé sistema interno de gestión de ITRIO con ASP.NET WebForms y Entity Framework 6"
            ],
            technologiesUsed: ["ASP.NET WebForms", "ASP.NET MVC4", "jQuery", "Bootstrap 3", "SQL Server", "Entity Framework 6", "Java"],
            location: "Argentina",
            icon: "itrio_sa_logo.jpg",
            companyColor: "#76c042"
        }
    ],
    en: []
}