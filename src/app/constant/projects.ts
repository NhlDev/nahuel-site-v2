/**
 * Páginas de caso por producto (/es/proyectos/<slug>, /en/projects/<slug>).
 * Todo lo que se afirma acá sale de los repos o de las landings públicas de cada producto:
 * antes de sumar una función, verificar que exista y esté probada.
 */
import { Lang } from './profile';

/** Prefijo de URL de cada idioma (`subPath` en angular.json): /es/… y /en/…. */
export const URL_PREFIX: Record<Lang, string> = { 'es-AR': 'es', 'en-US': 'en' };

export type ProjectSlug = 'chatbot-up' | 'comprobado' | 'control-up';

/** Primer segmento de la ruta de proyectos en cada idioma. Debe coincidir con `@@routeProjects` en los .xlf. */
export const PROJECTS_SEGMENT: Record<Lang, string> = {
  'es-AR': 'proyectos',
  'en-US': 'projects',
};

export const PROJECT_SLUGS: ProjectSlug[] = ['chatbot-up', 'comprobado', 'control-up'];

/** Ícono y captura de cada producto (public/img/<slug>/, relativo al idioma: /es/img/…). La captura es de 1200×630: sirve también como imagen Open Graph. */
export const PROJECT_MEDIA: Record<ProjectSlug, { icon: string; og: string }> = {
  'chatbot-up': { icon: 'img/chatbot-up/icon.svg', og: 'img/chatbot-up/og.png' },
  comprobado: { icon: 'img/comprobado/icon.png', og: 'img/comprobado/og.png' },
  'control-up': { icon: 'img/control-up/icon.png', og: 'img/control-up/og.png' },
};

export interface ProjectFeature {
  title: string;
  text: string;
}

export interface ProjectDetail {
  slug: ProjectSlug;
  name: string;
  /** Nombre anterior, si lo hubo (sirve para que quien busque el nombre viejo llegue acá) */
  formerName?: string;
  url: string;
  /** <title> de la página */
  seoTitle: string;
  /** meta description (≤ 160 caracteres) */
  seoDescription: string;
  /** Bajada bajo el h1 */
  lead: string;
  features: ProjectFeature[];
  /** Preguntas que se le pueden hacer al asistente del sitio sobre este producto (botones en la página). Tienen que poder responderse con docs/chatbot-knowledge-base.md. */
  questions: string[];
  /** Cómo está construido (decisiones técnicas) */
  build: string[];
  stack: string[];
}

export const PROJECT_LABELS: Record<Lang, {
  breadcrumbHome: string;
  breadcrumbProjects: string;
  eyebrow: string;
  features: string;
  askTitle: string;
  askText: string;
  build: string;
  stack: string;
  visit: string;
  opensNewTab: string;
  others: string;
  contactTitle: string;
  contactText: string;
  contactCta: string;
  channels: string;
  email: string;
  whatsapp: string;
  instagram: string;
  formerly: string;
  screenshot: string;
}> = {
  'es-AR': {
    breadcrumbHome: 'Inicio',
    breadcrumbProjects: 'Proyectos',
    eyebrow: 'Producto propio',
    features: 'Qué hace',
    askTitle: 'Preguntale al asistente',
    askText: 'Es el asistente de este sitio, hecho con Chatbot Up. Tocá una pregunta y te responde en el chat.',
    build: 'Cómo está hecho',
    stack: 'Stack',
    visit: 'Visitar',
    opensNewTab: '(se abre en una pestaña nueva)',
    others: 'Otros proyectos',
    contactTitle: '¿Querés algo así para tu negocio?',
    contactText: 'Armo asistentes con IA, integraciones con LLMs y automatizaciones a medida.',
    contactCta: 'Hablemos',
    channels: 'Contacto del producto',
    email: 'Correo',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    formerly: 'Antes: ',
    screenshot: 'Captura de',
  },
  'en-US': {
    breadcrumbHome: 'Home',
    breadcrumbProjects: 'Projects',
    eyebrow: 'Own product',
    features: 'What it does',
    askTitle: 'Ask the assistant',
    askText: 'It’s this site’s assistant, built with Chatbot Up. Tap a question and it answers in the chat.',
    build: 'How it’s built',
    stack: 'Stack',
    visit: 'Visit',
    opensNewTab: '(opens in a new tab)',
    others: 'Other projects',
    contactTitle: 'Want something like this for your business?',
    contactText: 'I build AI assistants, LLM integrations and custom automations.',
    contactCta: 'Let’s talk',
    channels: 'Product contact',
    email: 'Email',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    formerly: 'Formerly: ',
    screenshot: 'Screenshot of',
  },
};

export const projectDetails: Record<Lang, Record<ProjectSlug, ProjectDetail>> = {
  'es-AR': {
    'chatbot-up': {
      slug: 'chatbot-up',
      name: 'Chatbot Up',
      url: 'https://chatbotup.com.ar/',
      seoTitle: 'Chatbot Up: chatbot con IA para WhatsApp con RAG | Nahuel Alderete',
      seoDescription:
        'Cómo construí Chatbot Up: un chatbot con IA para pymes que responde con el material del negocio (RAG) en WhatsApp, Instagram, Telegram, la web y por voz.',
      lead:
        'Chatbot Up es un asistente con IA para pymes argentinas, entrenado con la información real de cada negocio —precios, horarios, stock, políticas— que atiende en WhatsApp, Instagram, Telegram, la web y por teléfono.',
      questions: [
        '¿Qué es Chatbot Up y para qué negocios sirve?',
        '¿Con qué tecnologías está hecho Chatbot Up?',
        '¿Cómo se usa Chatbot Up en este sitio?',
      ],
      features: [
        {
          title: 'Responde con el material del negocio',
          text: 'Usa RAG sobre los PDFs, la lista de precios, las políticas o el sitio web entero del negocio. Si algo no está en el material, lo dice en vez de inventarlo.',
        },
        {
          title: 'Hace cosas, no solo responde',
          text: 'Agenda turnos en Google Calendar, guarda interesados en Google Sheets, genera links de pago de Mercado Pago y consulta la API del propio negocio. Lo que modifica algo pide confirmación.',
        },
        {
          title: 'Deriva a una persona',
          text: 'Ante un reclamo, un pedido raro o cuando el cliente lo pide, pasa la conversación a alguien del equipo y avisa por mail o por el canal elegido.',
        },
        {
          title: 'También por voz',
          text: 'Entiende los audios de WhatsApp y Telegram, contesta con voz y en la web se puede hablar con el asistente en vivo, como en una llamada.',
        },
        {
          title: 'Recorridos guiados',
          text: 'Un editor visual para armar flujos como pedir un turno, dejar datos o cotizar, con condiciones y llamadas a sistemas externos.',
        },
        {
          title: 'Vistas interactivas en el chat',
          text: 'Además de texto, muestra tarjetas y formularios dentro de la conversación; en WhatsApp o Telegram manda un link a la misma vista.',
        },
      ],
      build: [
        'Backend en .NET 10 y ASP.NET Core, con Microsoft.Extensions.AI para no atarse a un proveedor y Gemini como modelo.',
        'Búsqueda semántica sobre el material de cada cuenta con pgvector, y datos de cada cuenta aislados del resto.',
        'Herramientas y vistas conectadas por MCP: el asistente de este sitio consulta el servidor MCP de nahuel.app para mostrar mis proyectos, mi experiencia y mi stack.',
        'Panel de administración en Angular y widget web en TypeScript que se instala pegando una línea de código.',
        'Consumo con topes por cuenta y aviso por mail antes de llegar al límite.',
      ],
      stack: ['.NET', 'ASP.NET Core', 'Microsoft.Extensions.AI', 'Gemini', 'RAG', 'pgvector', 'MCP', 'Angular', 'TypeScript'],
    },
    comprobado: {
      slug: 'comprobado',
      name: 'Comprobado',
      formerName: 'ArcaSuite',
      url: 'https://comprobado.com.ar/',
      seoTitle: 'Comprobado (ex ArcaSuite): facturación ARCA con API y MCP | Nahuel Alderete',
      seoDescription:
        'Cómo construí Comprobado (antes ArcaSuite): facturación electrónica de ARCA (ex AFIP) con consola web, API REST, servidor MCP para agentes de IA y ayudas de IA.',
      lead:
        'Comprobado (antes ArcaSuite) es un servicio de facturación electrónica de ARCA (ex AFIP) para contribuyentes argentinos: una consola web que guía la configuración y la emisión, una API REST para integrar sistemas y un servidor MCP para que agentes de IA emitan y consulten comprobantes.',
      questions: [
        '¿Qué es Comprobado?',
        '¿Cómo usa IA Comprobado?',
        '¿Para qué sirve el servidor MCP de Comprobado?',
      ],
      features: [
        {
          title: 'Emisión guiada',
          text: 'Facturas, notas de crédito y débito A, B y C con CAE, facturas E de exportación y Factura de Crédito Electrónica MiPyME. Se puede practicar en el simulador y en homologación antes de pasar a producción.',
        },
        {
          title: 'Lee facturas con IA',
          text: 'Se sube una foto o un PDF de la factura de un proveedor y la IA lee CUIT, tipo, punto de venta, número, CAE, fecha, importes y alícuotas. La persona revisa antes de guardar.',
        },
        {
          title: 'Importa cualquier CSV',
          text: 'Al importar un CSV propio, la IA sugiere qué columna corresponde a cada dato cuando el nombre no alcanza para reconocerla.',
        },
        {
          title: 'Errores en castellano',
          text: 'Cada rechazo de ARCA llega con una explicación clara además del error original, y una emisión que ARCA no confirma se reconcilia consultando a ARCA: nunca emite dos veces el mismo comprobante.',
        },
        {
          title: 'API REST y servidor MCP',
          text: 'La API es el producto principal, con descripción OpenAPI. Un agente de IA puede emitir y consultar comprobantes, buscar un CUIT en el padrón de ARCA, explicar un error o resumir las ventas del mes, con las cifras calculadas en el servidor.',
        },
        {
          title: 'Para equipos y estudios contables',
          text: 'Roles y perfiles de permisos, varios CUIT en una cuenta, acceso para estudios contables, facturación masiva por CSV, abonos recurrentes e IVA del mes con libros.',
        },
      ],
      build: [
        'Clientes SOAP propios para WSAA, WSFEv1 y WSFEX, escritos contra los WSDL oficiales de ARCA.',
        'Núcleo fiscal separado —tipos de comprobante, cálculo de IVA y validaciones previas a ARCA— pensado para reutilizarse como librería .NET.',
        'Multitenant sobre PostgreSQL con EF Core, datos sensibles cifrados en columna y auditoría.',
        'IA desacoplada del proveedor con Microsoft.Extensions.AI (hoy Gemini). La IA sugiere y arma borradores; los importes los calcula el servidor y siempre confirma una persona.',
        'Consola web en Angular 22.',
      ],
      stack: ['.NET', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Microsoft.Extensions.AI', 'Gemini', 'MCP', 'Angular'],
    },
    'control-up': {
      slug: 'control-up',
      name: 'Control Up',
      url: 'https://controlup.com.ar/',
      seoTitle: 'Control Up: gestión de ventas y stock para pymes | Nahuel Alderete',
      seoDescription:
        'Cómo construí Control Up: gestión comercial para pymes y comercios con punto de venta, inventario, sucursales, reportes y app para Android.',
      lead:
        'Control Up es un sistema de gestión comercial para pymes y comercios argentinos: punto de venta, inventario, clientes y reportes en un solo lugar, con app para Android.',
      questions: [
        '¿Qué es Control Up?',
        '¿Qué stack usa Control Up?',
        '¿Qué productos propios tiene Nahuel?',
      ],
      features: [
        {
          title: 'Punto de venta',
          text: 'Ventas rápidas con varios métodos de pago y comprobante al instante.',
        },
        {
          title: 'Inventario en tiempo real',
          text: 'Catálogo con stock actualizado y alertas de bajo inventario.',
        },
        {
          title: 'Varias sucursales',
          text: 'Todas las sucursales desde un panel central, comparando su rendimiento.',
        },
        {
          title: 'Equipos de venta',
          text: 'Roles, permisos y metas por vendedor, con seguimiento de su desempeño.',
        },
        {
          title: 'Reportes',
          text: 'Estadísticas de ventas por producto, empleado y sucursal.',
        },
        {
          title: 'App para Android',
          text: 'Registrar ventas y gastos y revisar movimientos desde el celular.',
        },
      ],
      build: [
        'API REST en .NET 8.',
        'Frontend en Angular, empaquetado como app de Android con Capacitor.',
      ],
      stack: ['.NET', 'Angular', 'TypeScript', 'Capacitor', 'Android'],
    },
  },
  'en-US': {
    'chatbot-up': {
      slug: 'chatbot-up',
      name: 'Chatbot Up',
      url: 'https://chatbotup.com.ar/',
      seoTitle: 'Chatbot Up: AI chatbot for WhatsApp with RAG | Nahuel Alderete',
      seoDescription:
        'How I built Chatbot Up: an AI chatbot for small businesses that answers from the business’s own content (RAG) on WhatsApp, Instagram, Telegram, web and voice.',
      lead:
        'Chatbot Up is an AI assistant for small businesses in Argentina, trained on each business’s real information —prices, hours, stock, policies— that serves customers on WhatsApp, Instagram, Telegram, the web and over the phone.',
      questions: [
        'What is Chatbot Up and what kind of business is it for?',
        'What technologies is Chatbot Up built with?',
        'How is Chatbot Up used on this site?',
      ],
      features: [
        {
          title: 'Answers from the business’s content',
          text: 'Uses RAG over the business’s PDFs, price lists, policies or its whole website. If something isn’t in the material, it says so instead of making it up.',
        },
        {
          title: 'Takes actions, not just answers',
          text: 'Books appointments in Google Calendar, saves leads to Google Sheets, creates Mercado Pago payment links and queries the business’s own API. Anything that changes data asks for confirmation.',
        },
        {
          title: 'Hands off to a person',
          text: 'On a complaint, an unusual request or when the customer asks, it passes the conversation to someone on the team and notifies them by email or the chosen channel.',
        },
        {
          title: 'Voice too',
          text: 'Understands WhatsApp and Telegram voice notes, replies with voice, and on the website visitors can talk to the assistant live, like a call.',
        },
        {
          title: 'Guided flows',
          text: 'A visual editor to build flows such as booking an appointment, leaving contact details or getting a quote, with conditions and calls to external systems.',
        },
        {
          title: 'Interactive views in the chat',
          text: 'Besides text, it shows cards and forms inside the conversation; on WhatsApp or Telegram it sends a link to the same view.',
        },
      ],
      build: [
        '.NET 10 and ASP.NET Core backend, using Microsoft.Extensions.AI to stay provider-agnostic, with Gemini as the model.',
        'Semantic search over each account’s content with pgvector, with each account’s data isolated from the rest.',
        'Tools and views connected through MCP: this site’s assistant queries nahuel.app’s MCP server to show my projects, experience and stack.',
        'Admin panel in Angular and a TypeScript web widget installed with a single line of code.',
        'Per-account usage limits with an email alert before reaching the cap.',
      ],
      stack: ['.NET', 'ASP.NET Core', 'Microsoft.Extensions.AI', 'Gemini', 'RAG', 'pgvector', 'MCP', 'Angular', 'TypeScript'],
    },
    comprobado: {
      slug: 'comprobado',
      name: 'Comprobado',
      formerName: 'ArcaSuite',
      url: 'https://comprobado.com.ar/',
      seoTitle: 'Comprobado (ex ArcaSuite): ARCA e-invoicing, API and MCP | Nahuel Alderete',
      seoDescription:
        'How I built Comprobado (formerly ArcaSuite): ARCA (ex AFIP) e-invoicing for Argentina with a web console, REST API, an MCP server for AI agents and AI helpers.',
      lead:
        'Comprobado (formerly ArcaSuite) is an ARCA (formerly AFIP) e-invoicing service for Argentine taxpayers: a web console that guides setup and issuing, a REST API to integrate systems and an MCP server so AI agents can issue and query invoices.',
      questions: [
        'What is Comprobado?',
        'How does Comprobado use AI?',
        'What is Comprobado’s MCP server for?',
      ],
      features: [
        {
          title: 'Guided issuing',
          text: 'Type A, B and C invoices, credit and debit notes with CAE, type E export invoices and MiPyME Electronic Credit Invoices. You can practice in the simulator and the testing environment before going to production.',
        },
        {
          title: 'Reads invoices with AI',
          text: 'Upload a photo or PDF of a supplier’s invoice and the AI reads the tax ID, type, point of sale, number, CAE, date, amounts and VAT rates. A person reviews it before saving.',
        },
        {
          title: 'Imports any CSV',
          text: 'When importing your own CSV, the AI suggests which column holds each field when the header name isn’t enough to recognize it.',
        },
        {
          title: 'Errors in plain language',
          text: 'Every ARCA rejection comes with a clear explanation alongside the original error, and an issue ARCA doesn’t confirm is reconciled by asking ARCA: it never issues the same invoice twice.',
        },
        {
          title: 'REST API and MCP server',
          text: 'The API is the main product, with an OpenAPI description. An AI agent can issue and query invoices, look up a tax ID in ARCA’s registry, explain an error or summarize the month’s sales, with figures computed on the server.',
        },
        {
          title: 'For teams and accounting firms',
          text: 'Roles and permission profiles, several tax IDs in one account, access for accounting firms, batch invoicing from CSV, recurring billing and monthly VAT with ledgers.',
        },
      ],
      build: [
        'Custom SOAP clients for WSAA, WSFEv1 and WSFEX, written against ARCA’s official WSDLs.',
        'A separate tax core —invoice types, VAT calculation and pre-validation before ARCA— designed to be reused as a .NET library.',
        'Multitenant on PostgreSQL with EF Core, sensitive data encrypted at column level and an audit log.',
        'Provider-agnostic AI with Microsoft.Extensions.AI (Gemini today). The AI suggests and drafts; amounts are computed by the server and a person always confirms.',
        'Web console in Angular 22.',
      ],
      stack: ['.NET', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Microsoft.Extensions.AI', 'Gemini', 'MCP', 'Angular'],
    },
    'control-up': {
      slug: 'control-up',
      name: 'Control Up',
      url: 'https://controlup.com.ar/',
      seoTitle: 'Control Up: business management system for SMBs | Nahuel Alderete',
      seoDescription:
        'How I built Control Up: business management for small businesses and retailers with point of sale, inventory, branches, reports and an Android app.',
      lead:
        'Control Up is a business management system for small businesses and retailers in Argentina: point of sale, inventory, customers and reports in one place, with an Android app.',
      questions: [
        'What is Control Up?',
        'What stack does Control Up use?',
        'What products has Nahuel built?',
      ],
      features: [
        {
          title: 'Point of sale',
          text: 'Fast sales with multiple payment methods and an instant receipt.',
        },
        {
          title: 'Real-time inventory',
          text: 'A catalog with up-to-date stock and low-inventory alerts.',
        },
        {
          title: 'Multiple branches',
          text: 'Every branch from a central dashboard, comparing their performance.',
        },
        {
          title: 'Sales teams',
          text: 'Roles, permissions and goals per salesperson, with performance tracking.',
        },
        {
          title: 'Reports',
          text: 'Sales statistics by product, employee and branch.',
        },
        {
          title: 'Android app',
          text: 'Record sales and expenses and review transactions from your phone.',
        },
      ],
      build: [
        'REST API in .NET 8.',
        'Angular frontend, packaged as an Android app with Capacitor.',
      ],
      stack: ['.NET', 'Angular', 'TypeScript', 'Capacitor', 'Android'],
    },
  },
};
