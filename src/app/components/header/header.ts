import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule],
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

  scrollTo(anchor: string): void {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  get currentLocale(): 'es-AR' | 'en-US' {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/es-AR';
    const seg1 = (path.split('/')[1] || '').trim();
    return seg1 === 'en-US' ? 'en-US' : 'es-AR';
  }

  switchLocale(): void {
    if (typeof window === 'undefined') return;
    const { pathname, search, hash } = window.location;
    const segs = pathname.split('/').filter(Boolean);
    const to = this.currentLocale === 'es-AR' ? 'en-US' : 'es-AR';
    if (segs.length && (segs[0] === 'es-AR' || segs[0] === 'en-US')) {
      segs[0] = to;
    } else {
      segs.unshift(to);
    }
    const newPath = '/' + segs.join('/');
    window.location.assign(newPath + search + hash);
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