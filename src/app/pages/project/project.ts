import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { products } from '../../constant/profile';
import {
  PROJECT_LABELS,
  PROJECT_SLUGS,
  PROJECTS_SEGMENT,
  ProjectSlug,
  projectDetails,
} from '../../constant/projects';
import { Assistant } from '../../services/assistant';
import { Seo, SITE_URL } from '../../services/seo';

/** Página de caso de un producto propio: qué hace, cómo está hecho y stack. */
@Component({
  selector: 'app-project',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './project.html',
  styleUrl: './project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPage {
  private seo = inject(Seo);
  protected assistant = inject(Assistant);
  readonly lang = this.seo.locale;
  readonly labels = PROJECT_LABELS[this.lang];
  readonly segment = PROJECTS_SEGMENT[this.lang];
  readonly project = projectDetails[this.lang][inject(ActivatedRoute).snapshot.data['slug'] as ProjectSlug];
  readonly icon = products[this.lang].find((p) => p.slug === this.project.slug)?.icon ?? 'apps';
  readonly others = PROJECT_SLUGS.filter((s) => s !== this.project.slug).map((s) => ({
    ...projectDetails[this.lang][s],
    tagline: products[this.lang].find((p) => p.slug === s)?.tagline ?? '',
  }));

  constructor() {
    // El widget puede haber cargado antes de entrar a esta página
    this.assistant.refresh();
    const p = this.project;
    const paths = {
      'es-AR': `${PROJECTS_SEGMENT['es-AR']}/${p.slug}`,
      'en-US': `${PROJECTS_SEGMENT['en-US']}/${p.slug}`,
    };
    const pageUrl = this.seo.url(this.lang, paths[this.lang]);

    this.seo.set({
      paths,
      title: p.seoTitle,
      description: p.seoDescription,
      ogType: 'article',
      jsonLd: [
        {
          '@type': 'SoftwareApplication',
          '@id': `${p.url}#app`,
          name: p.name,
          url: p.url,
          description: p.lead,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          creator: { '@id': `${SITE_URL}/#person` },
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: p.seoTitle,
          description: p.seoDescription,
          inLanguage: this.lang,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${p.url}#app` },
          author: { '@id': `${SITE_URL}/#person` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: this.labels.breadcrumbHome,
              item: this.seo.url(this.lang, ''),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: this.labels.breadcrumbProjects,
              item: this.seo.url(this.lang, '#about-me'),
            },
            { '@type': 'ListItem', position: 3, name: p.name, item: pageUrl },
          ],
        },
      ],
    });
  }
}
