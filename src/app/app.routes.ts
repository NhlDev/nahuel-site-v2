import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'resume',
        loadComponent: () => import('./pages/resume/resume').then(m => m.Resume)
    },
    {
        path: 'about-me',
        loadComponent: () => import('./pages/about-me/about-me').then(m => m.AboutMe)
    },
    {
        path: 'contact-me',
        loadComponent: () => import('./pages/contact-me/contact-me').then(m => m.ContactMe)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
