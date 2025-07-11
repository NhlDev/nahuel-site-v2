import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  isMobileMenuOpen = false;
  isDarkTheme = false;
  isBrowser = false;
  isServer = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);

    if (this.isBrowser) {
      this.isDarkTheme = window.localStorage.getItem('theme') === 'dark';
      this.applyTheme();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Prevenir scroll del body cuando el menú está abierto
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (this.isBrowser) {
      const body = document.body;
      const html = document.documentElement;

      if (this.isDarkTheme) {
        body.classList.remove('mat-light-theme');
        body.classList.add('mat-dark-theme');
        html.classList.remove('mat-light-theme');
        html.classList.add('mat-dark-theme');
      } else {
        body.classList.remove('mat-dark-theme');
        body.classList.add('mat-light-theme');
        html.classList.remove('mat-dark-theme');
        html.classList.add('mat-light-theme');
      }
    }
  }
}