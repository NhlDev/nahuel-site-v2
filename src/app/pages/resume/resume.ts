import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { WorkExperience, workExperiences } from '../../constant/work-experience';

export interface WorkExperienceView extends WorkExperience {
  duration: string;
  stintLabel: string | null;
}

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
export class Resume {
  lang = inject(LOCALE_ID);

  public readonly workExperiences: WorkExperienceView[] = this.buildViewModel(workExperiences[this.lang]);

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

    return experiences.map(exp => {
      const stints = byCompany.get(exp.company)!;
      const stintIndex = stints.indexOf(exp);
      const stintLabel = stints.length > 1 ? (stintLabels[stintIndex] ?? null) : null;

      return {
        ...exp,
        duration: this.formatDuration(exp.startDate, exp.endDate),
        stintLabel,
      };
    });
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
