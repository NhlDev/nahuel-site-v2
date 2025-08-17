/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import 'zone.js';
import { registerLocaleData } from '@angular/common';
import localeEsAR from '@angular/common/locales/es-AR';
import localeEnUS from '@angular/common/locales/en';

registerLocaleData(localeEsAR);
registerLocaleData(localeEnUS);

bootstrapApplication(App, {
  providers: [
  ]
}).catch(err => console.error(err));
