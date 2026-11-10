import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal, ChangeDetectionStrategy, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Seo } from '../../services/seo';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit, OnDestroy {
  isMobileMenuOpen = signal(false);
  activeSection = signal<string>('home');
  isBrowser = false;
  isServer = false;

  private sectionObserver?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private observedSections = new Set<Element>();
  private platformId = inject(PLATFORM_ID);
  private seo = inject(Seo);

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;

    // La sección activa es la que cruza la franja central del viewport.
    // Un threshold por porcentaje falla en secciones más altas que la pantalla
    // (nunca llegan al 30% visible), por eso se usa rootMargin.
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    // Observe any sections already rendered
    this.attachSectionObservers();

    // Watch for @defer sections appearing later
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.attachSectionObservers();
      });
      this.mutationObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  private attachSectionObservers(): void {
    const ids = ['home', 'about-me', 'resume', 'contact-me'];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && !this.observedSections.has(el)) {
        this.observedSections.add(el);
        this.sectionObserver!.observe(el);
      }
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);

    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMobileMenuOpen()) this.closeMobileMenu();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  scrollTo(anchor: string, event?: Event): void {
    const element = document.getElementById(anchor);
    // En una página interna la sección no existe: se deja seguir el href, que con
    // <base href="/es/"> lleva al inicio con el ancla (/es/#about-me).
    if (!element) return;
    event?.preventDefault();
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection.set(anchor);
  }

  get currentLocale(): 'es-AR' | 'en-US' {
    return this.seo.locale;
  }

  /** Va a la misma página en el otro idioma (las rutas internas cambian: proyectos ↔ projects). */
  switchLocale(): void {
    if (typeof window === 'undefined') return;
    const { search, hash } = window.location;
    window.location.assign(this.seo.alternatePath() + search + hash);
  }
}