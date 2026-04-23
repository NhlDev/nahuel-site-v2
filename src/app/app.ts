import { Component, inject, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Footer, Header } from './components';
import { Home } from './pages/home/home';
import { AboutMe } from './pages/about-me/about-me';
import { Resume } from './pages/resume/resume';
import { ContactMe } from './pages/contact-me/contact-me';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Home, AboutMe, Resume, ContactMe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected title = 'nahu-dev-site-v2';

  private titleService = inject(Title);
  private metaService = inject(Meta);
  private platformId = inject(PLATFORM_ID);

  // MutationObserver watches the DOM for @defer sections to appear,
  // then attaches IntersectionObserver to trigger entrance animations.
  private mutationObserver?: MutationObserver;
  private intersectionObserver?: IntersectionObserver;
  private observed = new Set<Element>();

  ngOnInit(): void {
    this.titleService.setTitle('Nahuel | Full Stack Developer');
    this.metaService.updateTag({ name: 'description', content: 'Desarrollador Full Stack con 10+ años de experiencia en Angular, .NET y Arquitectura de Software. Creando soluciones web y móviles escalables, rápidas y accesibles.' });
    this.metaService.updateTag({ name: 'author', content: 'Nahuel Alderete' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') return;

    // IntersectionObserver: adds .section-visible to trigger CSS animation
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            this.intersectionObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 }
    );

    const selectors = ['app-about-me', 'app-resume', 'app-contact-me'];

    // Observe any sections already in the DOM
    this.attachToExisting(selectors);

    // MutationObserver watches for @defer sections being added later
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.attachToExisting(selectors);
      });
      this.mutationObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  private attachToExisting(selectors: string[]): void {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && !this.observed.has(el)) {
        this.observed.add(el);
        this.intersectionObserver!.observe(el);
      }
    }
  }
}
