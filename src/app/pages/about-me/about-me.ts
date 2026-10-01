import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-me',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMe {
  lang = inject(LOCALE_ID);

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

  quickFacts: Record<string, { icon: string; text: string }[]> = {
    'es-AR': [
      { icon: 'location_on', text: 'Buenos Aires, Argentina' },
      { icon: 'translate', text: 'Español nativo · Inglés B2' },
      // { icon: 'schedule', text: 'Disponibilidad: Part/Full‑time' },
      { icon: 'auto_awesome', text: 'Foco: IA aplicada, LLMs y automatización' },
    ],
    'en-US': [
      { icon: 'location_on', text: 'Buenos Aires, Argentina' },
      { icon: 'translate', text: 'Native Spanish · B2 English' },
      // { icon: 'schedule', text: 'Availability: Part/Full‑time' },
      { icon: 'auto_awesome', text: 'Focus: applied AI, LLMs and automation' },
    ]
  };

  /** Productos SaaS propios (fundador / desarrollador) */
  products: Record<string, { name: string; tagline: string; url: string; icon: string }[]> = {
    'es-AR': [
      {
        name: 'Chatbot Up',
        tagline: 'Asistentes con IA (RAG) entrenados con el contenido de cada negocio, para WhatsApp, Telegram, Instagram y la web.',
        url: 'https://chatbot.controlup.com.ar/',
        icon: 'smart_toy',
      },
      {
        name: 'Control Up',
        tagline: 'Gestión comercial para PyMEs: ventas, stock, clientes y reportes en un solo lugar.',
        url: 'https://controlup.com.ar/',
        icon: 'point_of_sale',
      },
    ],
    'en-US': [
      {
        name: 'Chatbot Up',
        tagline: 'AI assistants (RAG) trained on each business’s own content, for WhatsApp, Telegram, Instagram and the web.',
        url: 'https://chatbot.controlup.com.ar/',
        icon: 'smart_toy',
      },
      {
        name: 'Control Up',
        tagline: 'Business management for SMBs: sales, inventory, customers and reports in one place.',
        url: 'https://controlup.com.ar/',
        icon: 'point_of_sale',
      },
    ]
  };

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
