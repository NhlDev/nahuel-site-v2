import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import 'zone.js';

bootstrapApplication(App, {
  providers: [
    // ...existing providers sin provideRouter
  ]
}).catch(err => console.error(err));
