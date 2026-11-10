import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { Lang } from '../app/constant/profile';
import {
  getContactOptions,
  getExperience,
  getProfile,
  getSkills,
  listProjects,
} from '../app/constant/public-data';
import { UI_MIME_TYPE, VIEWS, VIEW_URIS, readView, viewMeta } from './views';

const langSchema = z
  .enum(['es-AR', 'en-US'])
  .default('es-AR')
  .describe('Idioma del contenido y de la vista: "es-AR" si el usuario escribe en español, "en-US" si escribe en inglés');

const readOnly = { readOnlyHint: true, idempotentHint: true, openWorldHint: false } as const;

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
    async ({ lang }) => reply(getProfile(lang as Lang)),
  );

  server.registerTool(
    'list_projects',
    {
      _meta: viewMeta('projects'),
      title: 'Productos y proyectos',
      description:
        'Productos propios de Nahuel (Chatbot Up, Control Up y ArcaSuite): qué hace cada uno, tecnologías y enlace. Usala cuando pregunten por sus proyectos, productos o qué construyó. Muestra tarjetas filtrables en el chat, así que no repitas la lista en texto. Con `tech` filtra por tecnología (ej. "RAG", ".NET").',
      inputSchema: {
        tech: z.string().max(60).optional().describe('Tecnología a filtrar, p. ej. "RAG" o ".NET"'),
        lang: langSchema,
      },
      annotations: readOnly,
    },
    async ({ tech, lang }) => reply(listProjects(lang as Lang, tech)),
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
    async ({ tech, lang }) => reply(getExperience(lang as Lang, tech)),
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
    async ({ lang }) => reply(getSkills(lang as Lang)),
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
    async ({ lang }) => reply(getContactOptions(lang as Lang)),
  );

  return server;
}
