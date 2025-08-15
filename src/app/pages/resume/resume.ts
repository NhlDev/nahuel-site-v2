import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { WorkExperience, workExperiences } from '../../constant/work-experience';
@Component({
  selector: 'app-resume',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './resume.html',
  styleUrl: './resume.scss'
})
export class Resume {
  lang = inject(LOCALE_ID);

  public readonly workExperiences: WorkExperience[] = workExperiences[this.lang];

}
