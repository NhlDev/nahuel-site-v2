import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal, ChangeDetectionStrategy, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    if (event) {
      event.preventDefault();
    }
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection.set(anchor);
    }
  }

  get currentLocale(): 'es-AR' | 'en-US' {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/es-AR';
    const seg1 = (path.split('/')[1] || '').trim();
    return seg1 === 'en-US' ? 'en-US' : 'es-AR';
  }

  switchLocale(): void {
    if (typeof window === 'undefined') return;
    const { pathname, search, hash } = window.location;
    const segs = pathname.split('/').filter(Boolean);
    const to = this.currentLocale === 'es-AR' ? 'en-US' : 'es-AR';
    if (segs.length && (segs[0] === 'es-AR' || segs[0] === 'en-US')) {
      segs[0] = to;
    } else {
      segs.unshift(to);
    }
    const newPath = '/' + segs.join('/');
    window.location.assign(newPath + search + hash);
  }
}