import { TestBed } from '@angular/core/testing';
import { LOCALE_ID, provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ProjectPage } from './project';
import { PROJECT_SLUGS, PROJECTS_SEGMENT, projectDetails } from '../../constant/projects';
import { products } from '../../constant/profile';

describe('ProjectPage', () => {
  function render(slug: string) {
    TestBed.configureTestingModule({
      imports: [ProjectPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'es-AR' },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { slug } } } },
      ],
    });
    const fixture = TestBed.createComponent(ProjectPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the project with its h1, features and external link', () => {
    const el = render('arcasuite');

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('ArcaSuite');
    expect(el.querySelectorAll('.feature').length).toBe(projectDetails['es-AR'].arcasuite.features.length);
    expect(el.querySelector('a[target="_blank"]')?.getAttribute('href')).toBe('https://arca-suite.controlup.com.ar/');
    expect(TestBed.inject(Title).getTitle()).toBe(projectDetails['es-AR'].arcasuite.seoTitle);
  });

  it('links to the other projects only', () => {
    const el = render('chatbot-up');
    const hrefs = Array.from(el.querySelectorAll('a.other-card')).map((a) => a.getAttribute('href'));

    expect(hrefs).toEqual(['/proyectos/arcasuite', '/proyectos/control-up']);
  });
});

describe('project content', () => {
  it('has a page for every product in both languages, with descriptions that fit in a snippet', () => {
    for (const lang of ['es-AR', 'en-US'] as const) {
      expect(products[lang].map((p) => p.slug).sort()).toEqual([...PROJECT_SLUGS].sort());
      for (const slug of PROJECT_SLUGS) {
        const p = projectDetails[lang][slug];
        expect(p.slug).toBe(slug);
        expect(p.url).toBe(products[lang].find((x) => x.slug === slug)!.url);
        expect(p.seoDescription.length).toBeLessThanOrEqual(160);
        expect(p.seoTitle.length).toBeLessThanOrEqual(75);
      }
    }
  });

  it('uses the same route segment as the source-locale route', () => {
    expect($localize`:@@routeProjects:proyectos`).toBe(PROJECTS_SEGMENT['es-AR']);
  });
});

describe('ProjectPage: preguntale al asistente', () => {
  type Win = { ChatbotUp?: { ask?: (q: string) => Promise<string> } };

  function render(slug: string) {
    TestBed.configureTestingModule({
      imports: [ProjectPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'es-AR' },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { slug } } } },
      ],
    });
    const fixture = TestBed.createComponent(ProjectPage);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => delete (window as unknown as Win).ChatbotUp);

  it('no muestra los botones si el widget no expone ask (versión vieja o sin cargar)', () => {
    (window as unknown as Win).ChatbotUp = {};
    const el = render('arcasuite').nativeElement as HTMLElement;

    expect(el.querySelector('.ask')).toBeNull();
  });

  it('muestra una pregunta por botón y al tocarla se la hace al asistente', () => {
    const ask = jasmine.createSpy('ask').and.resolveTo('ok');
    (window as unknown as Win).ChatbotUp = { ask };
    const el = render('arcasuite').nativeElement as HTMLElement;

    const buttons = el.querySelectorAll<HTMLButtonElement>('.ask button');
    expect(buttons.length).toBe(projectDetails['es-AR'].arcasuite.questions.length);

    buttons[0].click();
    expect(ask).toHaveBeenCalledOnceWith(projectDetails['es-AR'].arcasuite.questions[0]);
  });

  it('cada proyecto tiene preguntas en los dos idiomas, y que las nombran', () => {
    for (const lang of ['es-AR', 'en-US'] as const) {
      for (const slug of PROJECT_SLUGS) {
        const p = projectDetails[lang][slug];
        expect(p.questions.length).toBeGreaterThanOrEqual(3);
        expect(p.questions.every((q) => q.trim().length > 0 && q.length <= 120)).toBeTrue();
      }
    }
  });
});
