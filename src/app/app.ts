import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  LOCALE_ID,
  DOCUMENT,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Footer, Header } from './components';
import { Home } from './pages/home/home';
import { AboutMe } from './pages/about-me/about-me';
import { Resume } from './pages/resume/resume';
import { ContactMe } from './pages/contact-me/contact-me';

const SITE_URL = 'https://nahuel.dev';

interface LocaleSeo {
  title: string;
  description: string;
  ogTitle: string;
  ogLocale: string;
  jobTitle: string;
}

const SEO_CONTENT: Record<'es-AR' | 'en-US', LocaleSeo> = {
  'es-AR': {
    title: 'Nahuel Alderete | Senior Full-Stack Engineer & Software Architect',
    description:
      'Desarrollador Senior Full-Stack con 10+ años de experiencia en Angular, .NET, Ionic y Arquitectura de Software. Construyo aplicaciones web y móviles de alto rendimiento, escalables y orientadas a resultados para empresas y startups.',
    ogTitle: 'Nahuel Alderete — Senior Full-Stack Engineer & Software Architect',
    ogLocale: 'es_AR',
    jobTitle: 'Senior Full-Stack Engineer & Software Architect (Angular / .NET / AI)',
  },
  'en-US': {
    title: 'Nahuel Alderete | Senior Full-Stack Engineer & Software Architect',
    description:
      'Senior Full-Stack Engineer with 10+ years of experience in Angular, .NET, Ionic, and Software Architecture. Building high-performance, accessible, and scalable web and mobile solutions for companies and startups.',
    ogTitle: 'Nahuel Alderete — Senior Full-Stack Engineer & Software Architect',
    ogLocale: 'en_US',
    jobTitle: 'Senior Full-Stack Engineer & Software Architect (Angular / .NET / AI)',
  },
};

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Home, AboutMe, Resume, ContactMe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  public readonly isTest =
    typeof window !== 'undefined' && !!(window as any).__karma__;

  protected title = 'nahu-dev-site-v2';

  private titleService = inject(Title);
  private metaService = inject(Meta);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  // MutationObserver watches the DOM for @defer sections to appear,
  // then attaches IntersectionObserver to trigger entrance animations.
  private mutationObserver?: MutationObserver;
  private intersectionObserver?: IntersectionObserver;
  private observed = new Set<Element>();

  localeId = inject(LOCALE_ID);

  ngOnInit(): void {
    const locale: 'es-AR' | 'en-US' =
      this.localeId === 'en-US' ? 'en-US' : 'es-AR';
    const otherLocale: 'es-AR' | 'en-US' =
      locale === 'es-AR' ? 'en-US' : 'es-AR';
    const seo = SEO_CONTENT[locale];
    const canonicalUrl = `${SITE_URL}/${locale}/`;
    const ogImageUrl = `${SITE_URL}/og-image.png`;

    this.titleService.setTitle(seo.title);
    this.metaService.updateTag({
      name: 'description',
      content: seo.description,
    });
    this.metaService.updateTag({ name: 'author', content: 'Nahuel Alderete' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    this.metaService.updateTag({
      property: 'og:site_name',
      content: 'Nahuel Alderete Portfolio',
    });
    this.metaService.updateTag({ property: 'og:title', content: seo.ogTitle });
    this.metaService.updateTag({
      property: 'og:description',
      content: seo.description,
    });
    this.metaService.updateTag({ property: 'og:type', content: 'profile' });
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'og:image', content: ogImageUrl });
    this.metaService.updateTag({
      property: 'og:locale',
      content: seo.ogLocale,
    });
    this.metaService.updateTag({
      property: 'og:locale:alternate',
      content: SEO_CONTENT[otherLocale].ogLocale,
    });

    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.metaService.updateTag({ name: 'twitter:title', content: seo.ogTitle });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: seo.description,
    });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImageUrl });

    this.upsertLink('canonical', canonicalUrl);
    this.upsertLink('alternate', `${SITE_URL}/es-AR/`, 'es-AR');
    this.upsertLink('alternate', `${SITE_URL}/en-US/`, 'en-US');
    this.upsertLink('alternate', `${SITE_URL}/es-AR/`, 'x-default');

    this.upsertJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: 'Nahuel Alderete',
          url: canonicalUrl,
          sameAs: [
            'https://github.com/NhlDev',
            'https://www.linkedin.com/in/nahuel-alderete',
          ],
          jobTitle: seo.jobTitle,
          image: `${SITE_URL}/logo.svg`,
          description: seo.description,
          knowsAbout: [
            'Angular',
            'TypeScript',
            'JavaScript',
            '.NET',
            'C#',
            'Ionic Framework',
            'React Native',
            'Node.js',
            'Software Architecture',
            'Artificial Intelligence',
            'Machine Learning Prototypes',
            'Web Performance Optimization',
            'Accessibility (WCAG)',
          ],
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Senior Full-Stack Engineer',
            occupationalCategory: '15-1252.00',
            skills: 'Angular, TypeScript, .NET, C#, Node.js, Ionic, Cloud Architecture',
          },
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'Nahuel Alderete — Senior Full-Stack Engineer',
          publisher: {
            '@id': `${SITE_URL}/#person`,
          },
          inLanguage: [locale, otherLocale],
        },
      ],
    });
  }

  private upsertLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private upsertJsonLd(data: Record<string, unknown>): void {
    const id = 'person-jsonld';
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
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
    script.src = 'https://app.chatbot.controlup.com.ar/integration-widget/chatbot.up.js';
    script.setAttribute('data-api-key', 'pk_live_26b30110fc3045da');
    script.setAttribute('data-mode', 'live');
    script.setAttribute('data-title', 'Asistente de Nahuel.app');
    script.setAttribute('data-theme-color', '#404957');
    script.setAttribute('data-locale', this.localeId);
    script.setAttribute('data-theme', 'dark');
    script.async = true;
    
    this.document.body.appendChild(script);
  }
}
