import {
  Component,
  inject,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  LOCALE_ID,
  DOCUMENT,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, skip } from 'rxjs';
import { Footer, Header } from './components';
import { Assistant } from './services/assistant';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private assistant = inject(Assistant);

  // MutationObserver watches the DOM for @defer sections to appear,
  // then attaches IntersectionObserver to trigger entrance animations.
  private mutationObserver?: MutationObserver;
  private intersectionObserver?: IntersectionObserver;
  private observed = new Set<Element>();

  localeId = inject(LOCALE_ID);

  constructor() {
    // Al cambiar de página en el cliente, el foco pasa al contenido para que el lector de
    // pantalla lo anuncie (la primera navegación es la carga inicial y se ignora).
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.document.getElementById('main')?.focus({ preventScroll: true }));
  }

  /** El skip link no usa el href: con <base href="/es/">, "#main" llevaría al inicio desde una página interna. */
  skipToContent(event: Event): void {
    event.preventDefault();
    const main = this.document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }

  ngAfterViewInit(): void {
    this.loadChatbot();

    if (
      !isPlatformBrowser(this.platformId) ||
      typeof IntersectionObserver === 'undefined'
    )
      return;

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
      { threshold: 0.08 },
    );

    const selectors = ['app-about-me', 'app-resume', 'app-contact-me'];

    // Observe any sections already in the DOM
    this.attachToExisting(selectors);

    // MutationObserver watches for @defer sections being added later
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        this.attachToExisting(selectors);
      });
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  private attachToExisting(selectors: string[]): void {
    for (const sel of selectors) {
      // Al volver al inicio desde una página interna las secciones se vuelven a crear
      const el = document.querySelector(sel);
      if (el && !this.observed.has(el)) {
        this.observed.add(el);
        this.intersectionObserver!.observe(el);
      }
    }
  }

  private loadChatbot(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.document.getElementById('controlup-chatbot')) return;

    // Load Chatbot Control Up script
    const script = this.document.createElement('script');
    script.id = 'controlup-chatbot';
    script.src = 'https://app.chatbotup.com.ar/integration-widget/chatbot.up.js';
    script.setAttribute('data-api-key', 'pk_live_26b30110fc3045da');
    script.setAttribute('data-mode', 'live');
    script.setAttribute('data-title', 'Asistente de Nahuel.app');
    script.setAttribute('data-theme-color', '#404957');
    script.setAttribute('data-locale', this.localeId);
    script.setAttribute('data-theme', 'dark');
    script.async = true;
    // Los botones "Preguntale al asistente" aparecen recién cuando el widget terminó de cargar
    script.addEventListener('load', () => this.assistant.refresh());

    this.document.body.appendChild(script);
  }
}
