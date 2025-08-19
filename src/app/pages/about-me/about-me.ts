import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about-me',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss'
})
export class AboutMe implements AfterViewInit, OnDestroy {
  lang = inject(LOCALE_ID);
  
  technologies = [
    { name: 'Angular', file: 'angular.svg', label: 'Logo Angular' },
    { name: 'JavaScript', file: 'javascript.svg', label: 'Logo JavaScript' },
    { name: 'TypeScript', file: 'typescript.svg', label: 'Logo TypeScript' },
    { name: 'Node.js', file: 'nodejs.svg', label: 'Logo Node.js' },
    { name: '.NET', file: 'dotnet.svg', label: 'Logo .NET' },
  ];

  highlights: Record<string, { value: string; label: string }[]> = {
    'es-AR': [
      { value: '10+ años', label: 'Experiencia' },
      { value: '5+ sectores', label: 'Industria' },
    ],
    'en-US': [
      { value: '10+ years', label: 'Experience' },
      { value: '5+ sectors', label: 'Industry' },
    ]
  };

  quickFacts: Record<string, { icon: string; text: string }[]> = {
    'es-AR': [
      { icon: '📍', text: 'Buenos Aires, Argentina' },
      { icon: '🗣️', text: 'Español nativo · Inglés B2' },
      { icon: '🕒', text: 'Disponibilidad: Part/Full‑time' },
      { icon: '🧩', text: 'Foco: Angular, TypeScript/JavaScript, .NET' },
    ],
    'en-US': [
      { icon: '📍', text: 'Buenos Aires, Argentina' },
      { icon: '🗣️', text: 'Native Spanish · B2 English' },
      { icon: '🕒', text: 'Availability: Part/Full‑time' },
      { icon: '🧩', text: 'Focus: Angular, TypeScript/JavaScript, .NET' },
    ]
  };

  @ViewChild('techIconsContainer', { read: ElementRef }) techIconsContainer?: ElementRef<HTMLUListElement>;
  
  techIconsVisible = false;

  private observer?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    const isBrowser = isPlatformBrowser(this.platformId);

    // SSR o navegador sin IntersectionObserver: fallback visible para evitar mismatch
    if (!isBrowser || typeof IntersectionObserver === 'undefined') {
      this.techIconsVisible = true;
      return;
    }

    const el = this.techIconsContainer?.nativeElement;
    if (!el) {
      this.techIconsVisible = true;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.techIconsVisible = true;
            this.observer?.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );

    this.observer.observe(el);

    // Fallback defensivo: si algo falla, asegurarse que se muestren
    setTimeout(() => {
      if (!this.techIconsVisible) {
        this.techIconsVisible = true;
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  scrollToSection(section: string) {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
