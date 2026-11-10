import { DOCUMENT, Injectable, LOCALE_ID, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { contact, Lang } from '../constant/profile';
import { URL_PREFIX } from '../constant/projects';

export const SITE_URL = 'https://nahuel.app';
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const OG_LOCALE: Record<Lang, string> = { 'es-AR': 'es_AR', 'en-US': 'en_US' };
/** hreflang por idioma: el contenido no es regional, así que solo idioma (un inglés de UK o un español de España también matchean). */
const HREFLANG: Record<Lang, string> = { 'es-AR': 'es', 'en-US': 'en' };
const LANGS: Lang[] = ['es-AR', 'en-US'];

export const JOB_TITLE = 'AI Engineer & Full-Stack Developer';

export interface PageSeo {
  /** Ruta de la página en cada idioma, sin el prefijo de idioma ('' es el inicio). */
  paths: Record<Lang, string>;
  title: string;
  description: string;
  ogType?: 'profile' | 'website' | 'article';
  /** Nodos extra de schema.org que se suman al grafo (Person y WebSite van siempre). */
  jsonLd?: Record<string, unknown>[];
}

/** Meta tags, canonical, hreflang y JSON-LD de cada página. Corre en el prerender y en el navegador. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  readonly locale: Lang = inject(LOCALE_ID) === 'en-US' ? 'en-US' : 'es-AR';

  /** Ruta absoluta de la página actual en el otro idioma (la usa el selector de idioma). */
  readonly alternatePath = signal<string>(this.locale === 'es-AR' ? '/en/' : '/es/');

  url(lang: Lang, path: string): string {
    return `${SITE_URL}/${URL_PREFIX[lang]}/${path}`;
  }

  set(page: PageSeo): void {
    const other: Lang = this.locale === 'es-AR' ? 'en-US' : 'es-AR';
    const canonical = this.url(this.locale, page.paths[this.locale]);
    this.alternatePath.set(`/${URL_PREFIX[other]}/${page.paths[other]}`);

    this.title.setTitle(page.title);
    this.tag('name', 'description', page.description);
    this.tag('name', 'author', contact.name);
    this.tag('name', 'robots', 'index, follow');

    this.tag('property', 'og:site_name', 'Nahuel Alderete');
    this.tag('property', 'og:title', page.title);
    this.tag('property', 'og:description', page.description);
    this.tag('property', 'og:type', page.ogType ?? 'website');
    this.tag('property', 'og:url', canonical);
    this.tag('property', 'og:image', OG_IMAGE);
    this.tag('property', 'og:locale', OG_LOCALE[this.locale]);
    this.tag('property', 'og:locale:alternate', OG_LOCALE[other]);

    this.tag('name', 'twitter:card', 'summary_large_image');
    this.tag('name', 'twitter:title', page.title);
    this.tag('name', 'twitter:description', page.description);
    this.tag('name', 'twitter:image', OG_IMAGE);

    this.link('canonical', canonical);
    // Quita los hreflang de versiones anteriores (es-AR/en-US) que pudieran quedar en el HTML
    this.document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((l: Element) => l.remove());
    for (const lang of LANGS) {
      this.link('alternate', this.url(lang, page.paths[lang]), HREFLANG[lang]);
    }
    // El inicio sin prefijo (/) redirige según el idioma del navegador: es el x-default que recomienda Google.
    // Las páginas internas no tienen versión neutra, caen en español.
    const xDefault =
      page.paths['es-AR'] === '' ? `${SITE_URL}/` : this.url('es-AR', page.paths['es-AR']);
    this.link('alternate', xDefault, 'x-default');

    this.jsonLd({
      '@context': 'https://schema.org',
      '@graph': [this.person(page.description), this.website(), ...(page.jsonLd ?? [])],
    });
  }

  private person(description: string): Record<string, unknown> {
    return {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: contact.name,
      url: this.url(this.locale, ''),
      sameAs: [contact.github, contact.linkedin],
      jobTitle: JOB_TITLE,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR',
      },
      knowsLanguage: ['es', 'en'],
      image: `${SITE_URL}/icon-512.png`,
      description,
      knowsAbout: [
        'Artificial Intelligence',
        'Large Language Models',
        'Retrieval-Augmented Generation',
        'Model Context Protocol (MCP)',
        'AI Agents',
        'Google Gemini',
        'Claude',
        'n8n',
        'Spec-Driven Development',
        'OpenSpec',
        'Conversational AI',
        'Business Process Automation',
        'Electronic Invoicing (ARCA / AFIP)',
        'Angular',
        'TypeScript',
        '.NET',
        'C#',
        'Node.js',
        'Python',
        'Ionic Framework',
        'React Native',
        'Software Architecture',
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'AI Engineer',
        occupationalCategory: '15-1252.00',
        skills:
          'LLMs, RAG, MCP, AI agents, AI automation, .NET, C#, Angular, TypeScript, Node.js, Python',
      },
    };
  }

  private website(): Record<string, unknown> {
    return {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: `${contact.name} — ${JOB_TITLE}`,
      publisher: { '@id': `${SITE_URL}/#person` },
      inLanguage: LANGS,
    };
  }

  private tag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  private link(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private jsonLd(data: Record<string, unknown>): void {
    const id = 'person-jsonld';
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
