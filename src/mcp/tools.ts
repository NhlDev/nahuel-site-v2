import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { contact, Lang, products, quickFacts, role, skills } from '../app/constant/profile';
import { WorkExperience, workExperiences } from '../app/constant/work-experience';
import { UI_MIME_TYPE, VIEWS, VIEW_URIS, readView, viewMeta } from './views';

const langSchema = z
  .enum(['es-AR', 'en-US'])
  .default('es-AR')
  .describe('Idioma del contenido y de la vista: "es-AR" si el usuario escribe en español, "en-US" si escribe en inglés');

const readOnly = { readOnlyHint: true, idempotentHint: true, openWorldHint: false } as const;

/** Mes en formato AAAA-MM; el sitio solo maneja mes y año. */
function toMonth(date: Date | null): string | null {
  if (!date) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function matchesTech(technologies: string[], tech?: string): boolean {
  if (!tech) return true;
  const needle = tech.trim().toLowerCase();
  return technologies.some((t) => t.toLowerCase().includes(needle));
}

function serializeExperience(e: WorkExperience) {
  return {
    company: e.company,
    position: e.position,
    start: toMonth(e.startDate),
    end: toMonth(e.endDate),
    current: e.endDate === null,
    location: e.location,
    technologies: e.technologiesUsed,
    responsibilities: e.responsibilities,
  };
}

/** Respuesta con el dato como texto (lo que ve el modelo) y estructurado (lo que consume una vista). */
function reply<T extends Record<string, unknown>>(data: T) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

/**
 * Un McpServer por request (modo stateless): el sitio corre en Cloud Run con varias instancias
 * y no hay sesión que mantener. El contenido es público y las tools son todas de solo lectura.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: 'nahuel-app', version: '1.0.0' },
    {
      // Lo lee el modelo al conectarse: reglas comunes a todas las tools, para no repetirlas en cada descripción.
      instructions:
        'Información pública de Nahuel Alderete (AI Engineer y desarrollador Full-Stack), la misma que muestra nahuel.app. ' +
        'Todas las herramientas son de solo lectura. Pasá siempre `lang`: "es-AR" si el usuario escribe en español y "en-US" si escribe en inglés. ' +
        'Usalas en lugar de responder de memoria, y no inventes datos que no devuelvan (tarifas, fechas, proyectos). ' +
        'Si algo no está, decilo y sugerí el contacto directo (get_contact_options).',
    },
  );

  for (const view of VIEWS) {
    server.registerResource(
      `view-${view.name}`,
      VIEW_URIS[view.name],
      { title: view.title, description: view.description, mimeType: UI_MIME_TYPE },
      async (uri) => ({
        // Las vistas no cargan nada de afuera: sin dominios en la CSP (el host impone default-src 'none').
        contents: [{ uri: uri.href, mimeType: UI_MIME_TYPE, text: readView(view.name), _meta: { ui: { prefersBorder: false } } }],
      }),
    );
  }

  server.registerTool(
    'get_profile',
    {
      title: 'Perfil de Nahuel Alderete',
      description:
        'Perfil de Nahuel Alderete: rol, ubicación, zona horaria, idiomas y foco profesional. Usala cuando pregunten quién es, a qué se dedica o dónde está. Para trayectoria, productos, stack o contacto hay herramientas específicas.',
      inputSchema: { lang: langSchema },
      annotations: readOnly,
    },
    async ({ lang }) =>
      reply({
        lang,
        name: contact.name,
        role: role[lang as Lang],
        location: contact.location,
        timezone: contact.timezone,
        facts: quickFacts[lang as Lang].map((f) => f.text),
        site: contact.site,
      }),
  );

  server.registerTool(
    'list_projects',
    {
      _meta: viewMeta('projects'),
      title: 'Productos y proyectos',
      description:
        'Productos propios de Nahuel (Chatbot Up y Control Up): qué hace cada uno, tecnologías y enlace. Usala cuando pregunten por sus proyectos, productos o qué construyó. Muestra tarjetas filtrables en el chat, así que no repitas la lista en texto. Con `tech` filtra por tecnología (ej. "RAG", ".NET").',
      inputSchema: {
        tech: z.string().max(60).optional().describe('Tecnología a filtrar, p. ej. "RAG" o ".NET"'),
        lang: langSchema,
      },
      annotations: readOnly,
    },
    async ({ tech, lang }) => {
      const list = products[lang as Lang].filter((p) => matchesTech(p.technologies, tech));
      return reply({
        lang,
        count: list.length,
        projects: list.map(({ name, tagline, url, technologies }) => ({ name, tagline, url, technologies })),
      });
    },
  );

  server.registerTool(
    'get_experience',
    {
      _meta: viewMeta('timeline'),
      title: 'Experiencia laboral',
      description:
        'Trayectoria laboral de Nahuel, de la más reciente a la más antigua: empresa, puesto, período, tecnologías y responsabilidades. Usala cuando pregunten por su experiencia, dónde trabajó o cuánto hace que usa una tecnología. Muestra una línea de tiempo en el chat, así que resumí en una frase. Con `tech` filtra por tecnología (ej. "Angular").',
      inputSchema: {
        tech: z.string().max(60).optional().describe('Tecnología a filtrar, p. ej. "Angular"'),
        lang: langSchema,
      },
      annotations: readOnly,
    },
    async ({ tech, lang }) => {
      const source = workExperiences[lang] ?? workExperiences['es-AR'];
      const list = source
        .filter((e) => matchesTech(e.technologiesUsed, tech))
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
      return reply({ lang, count: list.length, experience: list.map(serializeExperience) });
    },
  );

  server.registerTool(
    'get_skills',
    {
      _meta: viewMeta('stack'),
      title: 'Stack y habilidades',
      description: 'Stack de Nahuel agrupado por área (IA y automatización, backend, frontend). Usala cuando pregunten qué tecnologías, lenguajes o herramientas maneja. Muestra el detalle en el chat.',
      inputSchema: { lang: langSchema },
      annotations: readOnly,
    },
    async ({ lang }) => reply({ lang, groups: skills[lang as Lang] }),
  );

  server.registerTool(
    'get_contact_options',
    {
      _meta: viewMeta('contact'),
      title: 'Formas de contacto',
      description:
        'Canales públicos para contactar a Nahuel (email, LinkedIn, GitHub, formulario del sitio) y su tiempo de respuesta habitual. Usala cuando quieran contratarlo, escribirle o ver sus perfiles. Muestra botones en el chat. Solo informa: no envía mensajes.',
      inputSchema: { lang: langSchema },
      annotations: readOnly,
    },
    async ({ lang }) =>
      reply({
        lang,
        email: contact.email,
        linkedin: contact.linkedin,
        github: contact.github,
        form: `${contact.site}/${lang}/#contact-me`,
        responseTime: contact.responseTime,
      }),
  );

  return server;
}
