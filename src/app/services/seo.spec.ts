import { TestBed } from '@angular/core/testing';
import { DOCUMENT, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';

import { Seo } from './seo';

describe('Seo', () => {
  let seo: Seo;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: LOCALE_ID, useValue: 'es-AR' }],
    });
    seo = TestBed.inject(Seo);
    doc = TestBed.inject(DOCUMENT);
  });

  const href = (selector: string) => doc.head.querySelector(selector)?.getAttribute('href');

  it('uses the language-redirecting root as x-default on the home page', () => {
    seo.set({ paths: { 'es-AR': '', 'en-US': '' }, title: 't', description: 'd' });

    expect(href('link[rel="canonical"]')).toBe('https://nahuel.app/es/');
    expect(href('link[rel="alternate"][hreflang="es"]')).toBe('https://nahuel.app/es/');
    expect(href('link[rel="alternate"][hreflang="en"]')).toBe('https://nahuel.app/en/');
    expect(href('link[rel="alternate"][hreflang="x-default"]')).toBe('https://nahuel.app/');
    expect(doc.head.querySelectorAll('link[rel="alternate"][hreflang="es-AR"]').length).toBe(0);
  });

  it('points inner pages to their translated paths and falls back to Spanish for x-default', () => {
    seo.set({
      paths: { 'es-AR': 'proyectos/arcasuite', 'en-US': 'projects/arcasuite' },
      title: 't',
      description: 'd',
    });

    expect(href('link[rel="canonical"]')).toBe('https://nahuel.app/es/proyectos/arcasuite');
    expect(href('link[rel="alternate"][hreflang="en"]')).toBe('https://nahuel.app/en/projects/arcasuite');
    expect(href('link[rel="alternate"][hreflang="x-default"]')).toBe('https://nahuel.app/es/proyectos/arcasuite');
    expect(seo.alternatePath()).toBe('/en/projects/arcasuite');
  });

  it('keeps a single JSON-LD graph with Person, WebSite and the extra nodes', () => {
    seo.set({ paths: { 'es-AR': '', 'en-US': '' }, title: 't', description: 'd' });
    seo.set({
      paths: { 'es-AR': '', 'en-US': '' },
      title: 't',
      description: 'd',
      jsonLd: [{ '@type': 'BreadcrumbList' }],
    });

    const scripts = doc.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
    const types = JSON.parse(scripts[0].textContent!)['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toEqual(['Person', 'WebSite', 'BreadcrumbList']);
  });
});
