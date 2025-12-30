import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Footer, Header } from './components';
import { Home } from './pages/home/home';
import { AboutMe } from './pages/about-me/about-me';
import { Resume } from './pages/resume/resume';
import { ContactMe } from './pages/contact-me/contact-me';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Home, AboutMe, Resume, ContactMe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  protected title = 'nahu-dev-site-v2';

  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit(): void {
    this.titleService.setTitle('Nahuel | Full Stack Developer');
    this.metaService.addTags([
      { name: 'description', content: 'Desarrollador Full Stack experto en Angular, .NET y Arquitectura de Software. +10 años creando soluciones web y móviles escalables.' },
      { name: 'keywords', content: 'Nahuel, Full Stack Developer, Angular, .NET, React Native, Software Architecture, Web Development' },
      { name: 'author', content: 'Nahuel' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }
}
