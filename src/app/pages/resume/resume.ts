import { Component } from '@angular/core';
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

  public readonly workExperiences: WorkExperience[] = workExperiences['es'];

}
