import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';

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
      imports: [Resume],
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
    const title = el.querySelector('.resume-header h1');
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
