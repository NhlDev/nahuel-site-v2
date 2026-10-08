import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Lang, products, quickFacts } from '../../constant/profile';

@Component({
  selector: 'app-about-me',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMe {
  lang = inject(LOCALE_ID) as Lang;

  technologies = [
    { name: 'Gemini', file: 'gemini.svg' },
    { name: 'Claude', file: 'claude.svg' },
    { name: 'n8n', file: 'n8n.svg' },
    { name: 'Angular', file: 'angular.svg' },
    { name: 'TypeScript', file: 'typescript.svg' },
    { name: 'JavaScript', file: 'javascript.svg' },
    { name: 'Node.js', file: 'nodejs.svg' },
    { name: '.NET', file: 'dotnet.svg' },
  ];

  quickFacts = quickFacts;

  /** Productos SaaS propios (fundador / desarrollador) */
  products = products;

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
