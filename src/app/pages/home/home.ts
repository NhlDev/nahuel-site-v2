import { Component, inject, LOCALE_ID, OnDestroy, OnInit, signal, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    NgOptimizedImage
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit, OnDestroy {

  // Texto tipiado reactivo
  typedText = signal('');

  // idioma de la app
  lang = inject(LOCALE_ID);
  private platformId = inject(PLATFORM_ID);

  coreSkills = [
    'Angular', 'TypeScript', 'RxJS', '.NET / C#', 'Ionic', 'Node.js', 'AI Prototyping'
  ];

  // Copy orientado al valor para clientes y empresas
  private readonly LINES: Record<string, string[]> = {
    'es-AR': [
      'Especialista en Angular, .NET y arquitecturas web de misión crítica.',
      'Desarrollo de SaaS y MVPs ágiles listos para escalar.',
      'Soluciones móviles híbridas con Ionic y React Native.',
      'Integraciones de IA aplicada para automatizaciones inteligentes.',
    ],
    'en-US': [
      'Specialist in Angular, .NET, and mission-critical web architectures.',
      'Fast SaaS and MVP development built to scale.',
      'Cross-platform mobile apps with Ionic and React Native.',
      'Applied AI integrations for intelligent workflows.',
    ]
  };

  // Frases del idioma actual (con fallback a es-AR)
  readonly lines: string[] = this.LINES[this.lang] ?? this.LINES['es-AR'];

  // La frase más larga reserva el espacio del contenedor para que el hero
  // no cambie de tamaño mientras se tipea (evita CLS).
  readonly longestLine: string = this.lines.reduce((a, b) => (b.length > a.length ? b : a), '');

  // Config de velocidades (ms)
  private readonly TYPE_MS = 24;
  private readonly DELETE_MS = 12;
  private readonly PAUSE_END_MS = 5000;
  private readonly PAUSE_START_MS = 500;

  private stop = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // SSR: render estático de la primera frase
      this.typedText.set(this.lines[0]);
      return;
    }

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.typedText.set(this.lines[0]);
      return;
    }

    this.startTypingLoop();
  }

  ngOnDestroy(): void {
    this.stop = true;
  }

  private async startTypingLoop() {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    while (!this.stop) {
      for (const line of this.lines) {
        if (this.stop) return;

        // Pausa inicial
        await sleep(this.PAUSE_START_MS);

        // Tipear
        for (let i = 0; i <= line.length; i++) {
          if (this.stop) return;
          this.typedText.set(line.slice(0, i));
          await sleep(this.TYPE_MS);
        }

        // Pausa al final de la línea
        await sleep(this.PAUSE_END_MS);

        // Borrar
        for (let i = line.length; i >= 0; i--) {
          if (this.stop) return;
          this.typedText.set(line.slice(0, i));
          await sleep(this.DELETE_MS);
        }
      }
    }
  }

  scrollTo(anchor: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToSection(sectionId: string, event?: Event): void {
    this.scrollTo(sectionId, event);
  }

}
