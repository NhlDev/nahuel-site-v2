import { Routes } from '@angular/router';

import { PROJECT_SLUGS } from './constant/projects';
import { Landing } from './pages/landing/landing';

// Se traduce en el build de cada idioma: /es/proyectos/… y /en/projects/… (ver PROJECTS_SEGMENT)
const projectsSegment = $localize`:@@routeProjects:proyectos`;

// Rutas estáticas (sin parámetros) para que el prerender las descubra solas.
export const routes: Routes = [
  { path: '', component: Landing },
  ...PROJECT_SLUGS.map((slug) => ({
    path: `${projectsSegment}/${slug}`,
    loadComponent: () => import('./pages/project/project').then((m) => m.ProjectPage),
    data: { slug },
  })),
];
