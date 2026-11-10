import {
  EnvironmentProviders,
  LOCALE_ID,
  inject,
  provideExperimentalWebMcpTools,
  WebMcpToolDescriptor,
} from '@angular/core';

import { Lang } from './constant/profile';
import {
  getContactOptions,
  getExperience,
  getProfile,
  getSkills,
  listProjects,
} from './constant/public-data';

/**
 * WebMCP (https://github.com/webmachinelearning/webmcp): la página registra herramientas que un agente
 * del navegador puede llamar sin raspar el DOM. Son las mismas que expone el servidor MCP
 * (`/api/mcp/public`) y salen de los mismos datos (`constant/public-data.ts`).
 *
 * Angular se ocupa de detectar la API (`document.modelContext` o `navigator.modelContext`, que está
 * cambiando de nombre), de no hacer nada en el servidor ni en navegadores que no la traen y de
 * desregistrar las herramientas al destruir el injector. Hoy solo Chrome la soporta (origin trial).
 * La API de Angular es experimental: si cambia en una versión nueva, este archivo es el único a tocar.
 */

const LANG_PROP = {
  type: 'string',
  enum: ['es-AR', 'en-US'],
  description: 'Idioma del contenido. Por defecto, el de la página.',
} as const;

const TECH_PROP = {
  type: 'string',
  maxLength: 60,
  description: 'Tecnología a filtrar, p. ej. "Angular" o "RAG".',
} as const;

const readOnly = { readOnlyHint: true };

type Input = { lang?: string; tech?: string };

/** El idioma de la página, salvo que el agente pida otro. Se llama dentro de `execute`, que corre con inyección. */
function langOf(input: Input): Lang {
  if (input.lang === 'en-US' || input.lang === 'es-AR') return input.lang;
  return inject(LOCALE_ID) === 'en-US' ? 'en-US' : 'es-AR';
}

const asText = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
});

export const WEB_MCP_TOOLS: WebMcpToolDescriptor[] = [
  {
    name: 'get_profile',
    title: 'Perfil de Nahuel Alderete',
    description:
      'Perfil de Nahuel Alderete: rol, ubicación, zona horaria, idiomas y foco profesional. Usala cuando pregunten quién es o a qué se dedica.',
    inputSchema: { type: 'object', properties: { lang: LANG_PROP } },
    annotations: readOnly,
    execute: async (input: Input) => asText(getProfile(langOf(input))),
  },
  {
    name: 'list_projects',
    title: 'Productos y proyectos',
    description:
      'Productos propios de Nahuel (Chatbot Up, Control Up y ArcaSuite): qué hace cada uno, tecnologías, enlace y página del caso. Con `tech` filtra por tecnología.',
    inputSchema: { type: 'object', properties: { tech: TECH_PROP, lang: LANG_PROP } },
    annotations: readOnly,
    execute: async (input: Input) => asText(listProjects(langOf(input), input.tech?.slice(0, 60))),
  },
  {
    name: 'get_experience',
    title: 'Experiencia laboral',
    description:
      'Trayectoria laboral de Nahuel, de la más reciente a la más antigua: empresa, puesto, período, tecnologías y responsabilidades. Con `tech` filtra por tecnología.',
    inputSchema: { type: 'object', properties: { tech: TECH_PROP, lang: LANG_PROP } },
    annotations: readOnly,
    execute: async (input: Input) => asText(getExperience(langOf(input), input.tech?.slice(0, 60))),
  },
  {
    name: 'get_skills',
    title: 'Stack y habilidades',
    description: 'Stack de Nahuel agrupado por área (IA y automatización, backend, frontend).',
    inputSchema: { type: 'object', properties: { lang: LANG_PROP } },
    annotations: readOnly,
    execute: async (input: Input) => asText(getSkills(langOf(input))),
  },
  {
    name: 'get_contact_options',
    title: 'Formas de contacto',
    description:
      'Canales públicos para contactar a Nahuel (email, LinkedIn, GitHub, formulario del sitio) y su tiempo de respuesta. Solo informa: no envía mensajes.',
    inputSchema: { type: 'object', properties: { lang: LANG_PROP } },
    annotations: readOnly,
    execute: async (input: Input) => asText(getContactOptions(langOf(input))),
  },
];

export const provideWebMcp = (): EnvironmentProviders => provideExperimentalWebMcpTools(WEB_MCP_TOOLS);
