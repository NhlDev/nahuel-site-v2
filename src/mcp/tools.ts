import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { contact, Lang, products, quickFacts, role, skills } from '../app/constant/profile';
import { WorkExperience, workExperiences } from '../app/constant/work-experience';
import { UI_MIME_TYPE, VIEWS, VIEW_URIS, readView, viewMeta } from './views';

const langSchema = z
  .enum(['es-AR', 'en-US'])
  .default('es-AR')
  .describe('Idioma del contenido: es-AR (default) o en-US');

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
  const server = new McpServer({ name: 'nahuel-app', version: '1.0.0' });

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
        'Rol, ubicación, idiomas y foco profesional de Nahuel Alderete. Usalo para presentaciones y preguntas generales sobre quién es.',
      inputSchema: { lang: langSchema },
      annotations: readOnly,
    },
    async ({ lang }) =>
      reply({
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
        'Productos propios de Nahuel (Chatbot Up, Control Up), con descripción, tecnologías y enlace. Se puede filtrar por tecnología.',
      inputSchema: {
        tech: z.string().max(60).optional().describe('Tecnología a filtrar, p. ej. "RAG" o ".NET"'),
        lang: langSchema,
      },
      annotations: readOnly,
    },
    async ({ tech, lang }) => {
      const list = products[lang as Lang].filter((p) => matchesTech(p.technologies, tech));
      return reply({
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
        'Trayectoria profesional de Nahuel, de la más reciente a la más antigua: empresa, puesto, período, tecnologías y responsabilidades. Se puede filtrar por tecnología.',
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
      return reply({ count: list.length, experience: list.map(serializeExperience) });
    },
  );

  server.registerTool(
    'get_skills',
    {
      _meta: viewMeta('stack'),
      title: 'Stack y habilidades',
      description: 'Tecnologías y herramientas que usa Nahuel, agrupadas por área (IA, backend, frontend).',
      inputSchema: { lang: langSchema },
      annotations: readOnly,
    },
    async ({ lang }) => reply({ groups: skills[lang as Lang] }),
  );

  server.registerTool(
    'get_contact_options',
    {
      _meta: viewMeta('contact'),
      title: 'Formas de contacto',
      description:
        'Canales públicos para contactar a Nahuel (email, LinkedIn, GitHub, formulario) y su tiempo de respuesta habitual. No envía mensajes.',
      inputSchema: {},
      annotations: readOnly,
    },
    async () =>
      reply({
        email: contact.email,
        linkedin: contact.linkedin,
        github: contact.github,
        form: `${contact.site}/es-AR/#contact-me`,
        responseTime: contact.responseTime,
      }),
  );

  return server;
}
