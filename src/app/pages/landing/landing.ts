import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Home } from '../home/home';
import { AboutMe } from '../about-me/about-me';
import { Resume } from '../resume/resume';
import { ContactMe } from '../contact-me/contact-me';
import { JOB_TITLE, Seo } from '../../services/seo';

const DESCRIPTION = {
  'es-AR':
    'AI Engineer y desarrollador Full-Stack (10+ años). Asistentes con IA, integraciones con LLMs (RAG, MCP) y automatizaciones para negocios con .NET y Angular.',
  'en-US':
    'AI Engineer and Full-Stack Developer (10+ years). AI assistants, LLM integrations (RAG, MCP) and business automations with .NET and Angular.',
} as const;

/** Página de inicio: las cuatro secciones del portfolio. */
@Component({
  selector: 'app-landing',
  imports: [Home, AboutMe, Resume, ContactMe],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  public readonly isTest =
    typeof window !== 'undefined' && !!(window as any).__karma__;

  constructor() {
    const seo = inject(Seo);
    seo.set({
      paths: { 'es-AR': '', 'en-US': '' },
      title: `Nahuel Alderete | ${JOB_TITLE}`,
      description: DESCRIPTION[seo.locale],
      ogType: 'profile',
    });
  }
}
