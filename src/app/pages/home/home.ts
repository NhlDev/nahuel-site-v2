import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {

  // Texto tipiado reactivo
  typedText = signal('');

  coreSkills = [
    'Angular', 'TypeScript', 'RxJS', 'Ionic', 'Web APIs', '.NET', 'Node.js'
  ];

  // Mejora de copy (más orientado a valor)
  private readonly LINES = [
    'Creo experiencias web rápidas, accesibles y escalables con Angular.',
    'Especialista en arquitectura front‑end, performance y DX.',
    'Integraciones, diseño de componentes, tooling y calidad de código.',
  ];

  // Config de velocidades (ms)
  private readonly TYPE_MS = 24;
  private readonly DELETE_MS = 12;
  private readonly PAUSE_END_MS = 5000;
  private readonly PAUSE_START_MS = 500;

  private stop = false;

  ngOnInit(): void {
    this.startTypingLoop();
  }

  ngOnDestroy(): void {
    this.stop = true;
  }

  private async startTypingLoop() {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    while (!this.stop) {
      for (const line of this.LINES) {
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

}
