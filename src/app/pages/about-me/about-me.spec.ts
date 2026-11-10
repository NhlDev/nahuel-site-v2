import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';

import { AboutMe } from './about-me';

describe('AboutMe', () => {
  let component: AboutMe;
  let fixture: ComponentFixture<AboutMe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AboutMe],
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'es-AR' }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutMe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link each product card to its project page', () => {
    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a.product-card'),
    ).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/proyectos/chatbot-up', '/proyectos/control-up', '/proyectos/arcasuite']);
  });
});
