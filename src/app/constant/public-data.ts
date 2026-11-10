/**
 * Datos públicos que expone el sitio a agentes de IA, sin dependencias de Angular ni del SDK de MCP.
 * Los usan los dos canales y por eso no pueden diferir:
 *  - el servidor MCP (src/mcp/tools.ts, `/api/mcp` y `/api/mcp/public`)
 *  - WebMCP en el navegador (services/web-mcp.ts)
 */
import { contact, Lang, products, quickFacts, role, skills } from './profile';
import { PROJECTS_SEGMENT, URL_PREFIX } from './projects';
import { WorkExperience, workExperiences } from './work-experience';

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

/** URL absoluta de una página del sitio en un idioma ('' es el inicio). */
export const siteUrl = (lang: Lang, path = '') => `${contact.site}/${URL_PREFIX[lang]}/${path}`;

export function getProfile(lang: Lang) {
  return {
    lang,
    name: contact.name,
    role: role[lang],
    location: contact.location,
    timezone: contact.timezone,
    facts: quickFacts[lang].map((f) => f.text),
    site: contact.site,
  };
}

export function listProjects(lang: Lang, tech?: string) {
  const list = products[lang].filter((p) => matchesTech(p.technologies, tech));
  return {
    lang,
    count: list.length,
    projects: list.map(({ slug, name, tagline, url, technologies }) => ({
      name,
      tagline,
      url,
      // Página del caso en nahuel.app: qué hace, cómo está construido y stack
      caseStudy: siteUrl(lang, `${PROJECTS_SEGMENT[lang]}/${slug}`),
      technologies,
    })),
  };
}

export function getExperience(lang: Lang, tech?: string) {
  const source = workExperiences[lang] ?? workExperiences['es-AR'];
  const list = source
    .filter((e) => matchesTech(e.technologiesUsed, tech))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  return { lang, count: list.length, experience: list.map(serializeExperience) };
}

export function getSkills(lang: Lang) {
  return { lang, groups: skills[lang] };
}

export function getContactOptions(lang: Lang) {
  return {
    lang,
    email: contact.email,
    linkedin: contact.linkedin,
    github: contact.github,
    form: siteUrl(lang, '#contact-me'),
    responseTime: contact.responseTime,
  };
}
