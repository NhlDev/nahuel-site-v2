import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header } from './components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'nahu-dev-site-v2';
}
