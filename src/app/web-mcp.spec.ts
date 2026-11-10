import { TestBed } from '@angular/core/testing';
import { ApplicationInitStatus, LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';

import { provideWebMcp, WEB_MCP_TOOLS } from './web-mcp';

type Registered = {
  name: string;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>, client?: unknown) => Promise<{ content: { text: string }[] }>;
};

describe('WebMCP', () => {
  let doc: Document;
  let tools: Registered[];

  /** Simula un navegador con WebMCP: define `document.modelContext` y recién después levanta el injector, que registra las tools. */
  function boot(locale = 'es-AR', withApi = true) {
    tools = [];
    if (withApi) {
      Object.defineProperty(doc, 'modelContext', {
        configurable: true,
        value: { registerTool: async (t: Registered) => void tools.push(t) },
      });
    }
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: LOCALE_ID, useValue: locale },
        provideWebMcp(),
      ],
    });
    TestBed.inject(ApplicationInitStatus); // crea el injector y corre el inicializador
  }

  beforeEach(() => {
    doc = document;
  });

  afterEach(() => {
    delete (doc as unknown as { modelContext?: unknown }).modelContext;
  });

  const call = async (name: string, input: Record<string, unknown> = {}) =>
    JSON.parse((await tools.find((t) => t.name === name)!.execute(input, {})).content[0].text);

  it('defines the five read-only tools, named like the MCP server ones', () => {
    expect(WEB_MCP_TOOLS.map((t) => t.name)).toEqual([
      'get_profile',
      'list_projects',
      'get_experience',
      'get_skills',
      'get_contact_options',
    ]);
    expect(WEB_MCP_TOOLS.every((t) => t.annotations?.readOnlyHint)).toBeTrue();
  });

  it('registers them on document.modelContext when the browser supports WebMCP', () => {
    boot();
    expect(tools.map((t) => t.name)).toEqual(WEB_MCP_TOOLS.map((t) => t.name));
  });

  it('does nothing when the browser has no WebMCP', () => {
    boot('es-AR', false);
    expect(tools.length).toBe(0);
  });

  it('answers in the page language by default and filters by tech', async () => {
    boot('en-US');
    const projects = await call('list_projects', { tech: 'mcp' });

    expect(projects.lang).toBe('en-US');
    expect(projects.projects.map((p: { name: string }) => p.name)).toContain('ArcaSuite');
    expect(projects.projects[0].caseStudy).toMatch(/^https:\/\/nahuel\.app\/en\/projects\//);
  });

  it('lets the agent ask for the other language', async () => {
    boot('en-US');
    expect((await call('get_profile', { lang: 'es-AR' })).lang).toBe('es-AR');
  });
});
