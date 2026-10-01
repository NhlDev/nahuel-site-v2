import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

  coreSkills = [
    'LLMs', 'Gemini', 'Claude', 'RAG', 'n8n', 'Semantic Kernel', '.NET / C#', 'Angular', 'TypeScript'
  ];

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
