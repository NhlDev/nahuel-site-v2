import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  LOCALE_ID,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { NgOptimizedImage, DatePipe, isPlatformBrowser } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { WorkExperience, workExperiences } from '../../constant/work-experience';

export interface WorkExperienceView extends WorkExperience {
  id: string;
  duration: string;
  stintLabel: string | null;
  startYear: number;
  /** Carril dentro de la vista general (los períodos solapados usan carriles distintos) */
  lane: number;
  /** Posición y ancho (en %) dentro de la vista general cronológica */
  startPct: number;
  widthPct: number;
}

/** Cantidad de responsabilidades visibles antes de "Ver más" */
export const VISIBLE_RESPONSIBILITIES = 3;

@Component({
  selector: 'app-resume',
  imports: [
    DatePipe,
    MatIconModule,
    NgOptimizedImage
  ],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Resume implements AfterViewInit, OnDestroy {
  lang = inject(LOCALE_ID);
  private platformId = inject(PLATFORM_ID);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly visibleCount = VISIBLE_RESPONSIBILITIES;

  public readonly workExperiences: WorkExperienceView[] = this.buildViewModel(
    workExperiences[this.lang] ?? workExperiences['es-AR']
  );

  /** Años de referencia para la vista general (ticks) */
  public readonly years: number[] = this.buildYears();
  public readonly laneCount = Math.max(...this.workExperiences.map(e => e.lane)) + 1;

  /** Item resaltado según la posición del scroll */
  activeId = signal<string | null>(this.workExperiences[0]?.id ?? null);

  /** Ids de las tarjetas expandidas */
  private expandedIds = signal<ReadonlySet<string>>(new Set());

  private activeObserver?: IntersectionObserver;
  private revealObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') return;

    const items = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.tl-item'));

    // Item activo: el que cruza la franja central del viewport
    this.activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeId.set((entry.target as HTMLElement).dataset['id'] ?? null);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    // Revelado por item al entrar al viewport (una sola vez)
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.revealObserver?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    const viewportH = window.innerHeight;
    for (const item of items) {
      // Lo que ya está en pantalla se muestra sin esperar al observer (sin parpadeo en SSR/hidratación)
      if (item.getBoundingClientRect().top < viewportH) {
        item.classList.add('in-view');
      } else {
        this.revealObserver.observe(item);
      }
      this.activeObserver.observe(item);
    }

    // Recién ahora se habilita el estado "oculto" de los items fuera de pantalla
    this.host.nativeElement.classList.add('tl-ready');
  }

  ngOnDestroy(): void {
    this.activeObserver?.disconnect();
    this.revealObserver?.disconnect();
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggleExpanded(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  hiddenCount(exp: WorkExperienceView): number {
    return Math.max(exp.responsibilities.length - this.visibleCount, 0);
  }

  /** Scroll hasta la tarjeta desde la vista general */
  jumpTo(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.host.nativeElement.querySelector<HTMLElement>(`.tl-item[data-id="${id}"]`);
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    this.activeId.set(id);
    el.querySelector<HTMLElement>('.tl-card')?.focus({ preventScroll: true });
  }

  private buildViewModel(experiences: WorkExperience[]): WorkExperienceView[] {
    const byCompany = new Map<string, WorkExperience[]>();
    for (const exp of experiences) {
      const stints = byCompany.get(exp.company) ?? [];
      stints.push(exp);
      byCompany.set(exp.company, stints);
    }
    for (const stints of byCompany.values()) {
      stints.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    const stintLabels = this.lang === 'es-AR'
      ? ['1er período en la empresa', '2do período en la empresa', '3er período en la empresa']
      : ['1st term at the company', '2nd term at the company', '3rd term at the company'];

    // Rango cronológico global (desde el 1º de enero del primer año hasta hoy)
    const now = new Date();
    const minYear = Math.min(...experiences.map(e => e.startDate.getFullYear()));
    const rangeStart = new Date(minYear, 0, 1).getTime();
    const rangeEnd = now.getTime();
    const range = rangeEnd - rangeStart;

    // Asignación de carriles: los períodos solapados no comparten carril
    const chronological = [...experiences].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const laneEnds: number[] = [];
    const laneOf = new Map<WorkExperience, number>();
    for (const exp of chronological) {
      const start = exp.startDate.getTime();
      const end = (exp.endDate ?? now).getTime();
      let lane = laneEnds.findIndex(laneEnd => laneEnd <= start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(end);
      } else {
        laneEnds[lane] = end;
      }
      laneOf.set(exp, lane);
    }

    return experiences.map((exp, index) => {
      const stints = byCompany.get(exp.company)!;
      const stintIndex = stints.indexOf(exp);
      const stintLabel = stints.length > 1 ? (stintLabels[stintIndex] ?? null) : null;

      const start = exp.startDate.getTime();
      const end = (exp.endDate ?? now).getTime();

      return {
        ...exp,
        id: `${this.slug(exp.company)}-${exp.startDate.getFullYear()}-${index}`,
        duration: this.formatDuration(exp.startDate, exp.endDate),
        stintLabel,
        startYear: exp.startDate.getFullYear(),
        lane: laneOf.get(exp) ?? 0,
        startPct: ((start - rangeStart) / range) * 100,
        widthPct: ((end - start) / range) * 100,
      };
    });
  }

  private buildYears(): number[] {
    const years = this.workExperiences.map(e => e.startYear);
    const min = Math.min(...years);
    const max = new Date().getFullYear();
    const out: number[] = [];
    for (let y = min; y <= max; y++) out.push(y);
    return out;
  }

  /** Posición (%) de un año dentro de la vista general */
  yearPct(year: number): number {
    const min = this.years[0];
    const rangeStart = new Date(min, 0, 1).getTime();
    const range = Date.now() - rangeStart;
    return ((new Date(year, 0, 1).getTime() - rangeStart) / range) * 100;
  }

  private slug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private formatDuration(start: Date, end: Date | null): string {
    const endDate = end ?? new Date();
    let months = (endDate.getFullYear() - start.getFullYear()) * 12 + (endDate.getMonth() - start.getMonth());
    if (endDate.getDate() < start.getDate()) months--;
    months = Math.max(months, 1);

    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const yearUnit = this.lang === 'es-AR' ? 'a' : 'y';

    const parts: string[] = [];
    if (years > 0) parts.push(`${years}${yearUnit}`);
    if (remMonths > 0 || years === 0) parts.push(`${remMonths}m`);
    return parts.join(' ');
  }
}
