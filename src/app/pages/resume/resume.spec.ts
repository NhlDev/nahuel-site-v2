import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';
import { CommonModule } from '@angular/common';

import { Resume } from './resume';
import { workExperiences } from '../../constant/work-experience';

describe('Resume', () => {
  let component: Resume;
  let fixture: ComponentFixture<Resume>;

  beforeAll(() => {
    registerLocaleData(localeEsAR);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, Resume],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: LOCALE_ID, useValue: 'es-AR' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Resume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header title and subtitle', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('.resume-header h2');
    const subtitle = el.querySelector('.resume-header .subtitle');

    expect(title?.textContent?.trim()).toBe('Mi Experiencia Profesional');
    expect(subtitle?.textContent?.trim()).toBe('Mi trayectoria profesional y logros');
  });

  it('should render all timeline items from workExperiences[es-AR]', () => {
    const expected = workExperiences['es-AR'];
    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('article.tl-item');

    expect(items.length).toBe(expected.length);
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render company, position, dates, badge and image for first item', () => {
    const expected = workExperiences['es-AR'][0];

    const el: HTMLElement = fixture.nativeElement;
    const firstItem = el.querySelector('article.tl-item') as HTMLElement;
    expect(firstItem).toBeTruthy();

    const position = firstItem.querySelector('.titles .position')!;
    const company = firstItem.querySelector('.titles .company')!;
    const date = firstItem.querySelector('.date')!;
    const badge = firstItem.querySelector('.tl-meta .badge')!;
    const matIcon = badge.querySelector('mat-icon');
    const img = firstItem.querySelector('.tl-dot__img') as HTMLImageElement;

    expect(position.textContent?.trim()?.length).toBeGreaterThan(0);
    expect(company.textContent?.trim()?.length).toBeGreaterThan(0);
    expect(date.textContent?.includes('–')).toBeTrue();
    expect(badge).toBeTruthy();
    expect(matIcon).not.toBeNull();
    expect(img?.getAttribute('src')).toBe(`companies/${expected.icon}`);
  });

  it('should render one overview segment per experience and mark the first as active', () => {
    const el: HTMLElement = fixture.nativeElement;
    const segments = el.querySelectorAll('.tl-overview .tl-seg');
    expect(segments.length).toBe(workExperiences['es-AR'].length);
    expect(el.querySelector('.tl-seg.is-active')).not.toBeNull();
  });

  it('should assign different lanes to overlapping experiences', () => {
    const freelance = component.workExperiences.find(e => e.company === 'Freelance')!;
    const overlapping = component.workExperiences.filter(e =>
      e !== freelance &&
      e.startDate.getTime() < Date.now() &&
      (e.endDate ?? new Date()).getTime() > freelance.startDate.getTime()
    );
    expect(overlapping.length).toBeGreaterThan(0);
    for (const exp of overlapping) {
      expect(exp.lane).not.toBe(freelance.lane);
    }
  });

  it('should toggle the expanded responsibilities of a card', () => {
    const el: HTMLElement = fixture.nativeElement;
    const exp = component.workExperiences.find(e => component.hiddenCount(e) > 0)!;
    expect(component.isExpanded(exp.id)).toBeFalse();

    component.toggleExpanded(exp.id);
    fixture.detectChanges();
    expect(component.isExpanded(exp.id)).toBeTrue();

    const more = el.querySelector(`#more-${CSS.escape(exp.id)}`)!;
    expect(more.classList.contains('is-open')).toBeTrue();
    expect(more.querySelector('ul')?.hasAttribute('inert')).toBeFalse();

    component.toggleExpanded(exp.id);
    fixture.detectChanges();
    expect(component.isExpanded(exp.id)).toBeFalse();
  });

  it('should render responsibilities and skills counts matching data for first item', () => {
    const expected = workExperiences['es-AR'][0];

    const el: HTMLElement = fixture.nativeElement;
    const firstItem = el.querySelector('article.tl-item') as HTMLElement;

    const responsibilities = firstItem.querySelectorAll('.responsibilities li');
    const chips = firstItem.querySelectorAll('.skills-chips .chip');

    expect(responsibilities.length).toBe(expected.responsibilities.length);
    expect(chips.length).toBe(expected.technologiesUsed.length);
  });
});
