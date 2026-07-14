import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { WorkExperience, workExperiences } from '../../constant/work-experience';
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

  public readonly workExperiences: WorkExperience[] = workExperiences[this.lang];

}
