import { app as createApp, el, lang, mount, root } from './common';

interface Job {
  company: string; position: string; start: string; end: string | null; current: boolean;
  location: string; technologies: string[]; responsibilities: string[];
}
interface Data { experience: Job[] }

const TEXT = {
  es: { title: 'Experiencia', now: 'Actualidad', all: 'Todas', more: 'Ver detalle', less: 'Ocultar', loading: '…', empty: 'Sin resultados.' },
  en: { title: 'Experience', now: 'Present', all: 'All', more: 'Show details', less: 'Hide', loading: '…', empty: 'No results.' },
} as const;

const app = createApp('nahuel-timeline');
const state = { data: null as Data | null, tech: null as string | null, open: new Set<string>() };
const t = (k: keyof (typeof TEXT)['es']) => TEXT[lang(app)][k];

const monthIndex = (ym: string): number => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
const fmt = (ym: string): string =>
  new Intl.DateTimeFormat(lang(app) === 'en' ? 'en-US' : 'es-AR', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1, 1)));

function duration(job: Job, now: number): string {
  const months = Math.max(1, (job.end ? monthIndex(job.end) : now) - monthIndex(job.start) + 1);
  const y = Math.floor(months / 12), m = months % 12;
  const en = lang(app) === 'en';
  return [y ? `${y} ${en ? 'yr' : y > 1 ? 'años' : 'año'}` : '', m ? `${m} ${en ? 'mo' : m > 1 ? 'meses' : 'mes'}` : ''].filter(Boolean).join(' ');
}

function render(): void {
  const host = root();
  host.textContent = '';
  if (!state.data) return void host.append(el('p', { class: 'muted', text: t('loading') }));

  const jobs = state.data.experience;
  const d = new Date();
  const now = d.getFullYear() * 12 + d.getMonth();
  const min = Math.min(...jobs.map((j) => monthIndex(j.start)));
  const span = Math.max(1, now - min);

  host.append(el('h1', { text: t('title') }));
  const techs = [...new Set(jobs.flatMap((j) => j.technologies))].sort((a, b) => a.localeCompare(b));
  const chips = el('div', { class: 'chips', role: 'group' });
  for (const tech of [null, ...techs]) {
    const b = el('button', { type: 'button', 'aria-pressed': String(state.tech === tech), text: tech ?? t('all') });
    b.addEventListener('click', () => { state.tech = tech; render(); });
    chips.append(b);
  }
  host.append(chips);

  const visible = jobs.filter((j) => !state.tech || j.technologies.includes(state.tech));
  if (visible.length === 0) host.append(el('p', { class: 'muted', text: t('empty') }));

  const list = el('div', { class: 'list' });
  for (const job of visible) {
    const id = `${job.company}|${job.start}`;
    const open = state.open.has(id);
    const left = ((monthIndex(job.start) - min) / span) * 100;
    const right = ((job.end ? monthIndex(job.end) : now) - min) / span * 100;
    const bar = el('div', { class: 'track', 'aria-hidden': 'true' }, [
      el('i', { style: `left:${left.toFixed(1)}%;width:${Math.max(1.5, right - left).toFixed(1)}%` }),
    ]);

    const toggle = el('button', { type: 'button', 'aria-expanded': String(open), text: open ? t('less') : t('more') });
    toggle.addEventListener('click', () => { open ? state.open.delete(id) : state.open.add(id); render(); });

    const card = el('article', { class: 'card' }, [
      el('header', {}, [
        el('h2', { text: `${job.company} · ${job.position}` }),
        el('span', { class: 'muted', text: `${fmt(job.start)} – ${job.end ? fmt(job.end) : t('now')} · ${duration(job, now)}` }),
      ]),
      el('p', { class: 'muted', text: job.location }),
      bar,
      el('div', { class: 'tags' }, job.technologies.map((x) => el('span', { class: 'chip sm', text: x }))),
      el('div', { class: 'bar' }, [toggle]),
    ]);
    if (open) card.append(el('ul', {}, job.responsibilities.map((r) => el('li', { text: r }))));
    list.append(card);
  }
  host.append(list);
}

mount(
  app,
  (d): d is Data => !!d && Array.isArray((d as Data).experience),
  (d) => { state.data = d; state.tech = null; },
  render,
);
