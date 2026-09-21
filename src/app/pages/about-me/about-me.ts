import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, inject, LOCALE_ID, signal, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-me',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
      { icon: 'location_on', text: 'Buenos Aires, Argentina' },
      { icon: 'translate', text: 'Español nativo · Inglés B2' },
      // { icon: 'schedule', text: 'Disponibilidad: Part/Full‑time' },
      { icon: 'code', text: 'Foco: Angular, TypeScript/JavaScript, .NET' },
    ],
    'en-US': [
      { icon: 'location_on', text: 'Buenos Aires, Argentina' },
      { icon: 'translate', text: 'Native Spanish · B2 English' },
      // { icon: 'schedule', text: 'Availability: Part/Full‑time' },
      { icon: 'code', text: 'Focus: Angular, TypeScript/JavaScript, .NET' },
    ]
  };

  /** Productos SaaS propios (fundador / desarrollador) */
  products: Record<string, { name: string; tagline: string; url: string; icon: string; color: string }[]> = {
    'es-AR': [
      {
        name: 'Control Up',
        tagline: 'Gestión comercial para PyMEs: ventas, stock, clientes y reportes en un solo lugar.',
        url: 'https://controlup.com.ar/',
        icon: 'point_of_sale',
        color: '#38bdf8',
      },
      {
        name: 'Chatbot Up',
        tagline: 'Chatbots con IA entrenados con tu propio contenido, listos para tu web y tus canales.',
        url: 'https://chatbot.controlup.com.ar/',
        icon: 'smart_toy',
        color: '#818cf8',
      },
    ],
    'en-US': [
      {
        name: 'Control Up',
        tagline: 'Business management for SMBs: sales, inventory, customers and reports in one place.',
        url: 'https://controlup.com.ar/',
        icon: 'point_of_sale',
        color: '#38bdf8',
      },
      {
        name: 'Chatbot Up',
        tagline: 'AI chatbots trained on your own content, ready for your website and channels.',
        url: 'https://chatbot.controlup.com.ar/',
        icon: 'smart_toy',
        color: '#818cf8',
      },
    ]
  };

  @ViewChild('techIconsContainer', { read: ElementRef }) techIconsContainer?: ElementRef<HTMLUListElement>;

  techIconsVisible = signal(false);

  private observer?: IntersectionObserver;
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    const isBrowser = isPlatformBrowser(this.platformId);

    // SSR o navegador sin IntersectionObserver: fallback visible para evitar mismatch
    if (!isBrowser || typeof IntersectionObserver === 'undefined') {
      this.techIconsVisible.set(true);
      return;
    }

    const el = this.techIconsContainer?.nativeElement;
    if (!el) {
      this.techIconsVisible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.techIconsVisible.set(true);
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
      if (!this.techIconsVisible()) {
        this.techIconsVisible.set(true);
      }
    }, 2000);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  scrollToSection(section: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollTo(section: string, event?: Event) {
    this.scrollToSection(section, event);
  }
}
