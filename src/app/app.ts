import { Component } from '@angular/core';
import { Footer, Header } from './components';
import { Home } from './pages/home/home';
import { AboutMe } from './pages/about-me/about-me';
import { Resume } from './pages/resume/resume';
import { ContactMe } from './pages/contact-me/contact-me';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Home, AboutMe, Resume, ContactMe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'nahu-dev-site-v2';
}
