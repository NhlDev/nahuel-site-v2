/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import localeEsAR from '@angular/common/locales/es-AR';
import localeEnUS from '@angular/common/locales/en';

registerLocaleData(localeEsAR);
registerLocaleData(localeEnUS);

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
