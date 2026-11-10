import { getContactOptions, getExperience, listProjects, siteUrl } from './public-data';
import { PROJECT_SLUGS } from './projects';

describe('public-data', () => {
  it('builds site URLs with the /es and /en prefixes', () => {
    expect(siteUrl('es-AR')).toBe('https://nahuel.app/es/');
    expect(getContactOptions('en-US').form).toBe('https://nahuel.app/en/#contact-me');
  });

  it('links every project to its case study page in the right language', () => {
    const es = listProjects('es-AR').projects.map((p) => p.caseStudy).sort();
    expect(es).toEqual(PROJECT_SLUGS.map((s) => `https://nahuel.app/es/proyectos/${s}`).sort());

    const en = listProjects('en-US').projects.map((p) => p.caseStudy).sort();
    expect(en).toEqual(PROJECT_SLUGS.map((s) => `https://nahuel.app/en/projects/${s}`).sort());
  });

  it('filters projects and experience by technology, case-insensitively', () => {
    expect(listProjects('es-AR', 'mcp').projects.map((p) => p.name)).toContain('ArcaSuite');
    expect(listProjects('es-AR', 'cobol').count).toBe(0);
    expect(getExperience('es-AR', 'angular').count).toBeGreaterThan(0);
  });

  it('lists experience newest first', () => {
    const starts = getExperience('es-AR').experience.map((e) => e.start!);
    expect([...starts].sort().reverse()).toEqual(starts);
  });
});
