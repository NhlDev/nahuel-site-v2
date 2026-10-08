import { app as createApp, el, lang, mount, openLink, root } from './common';

interface Project { name: string; tagline: string; url: string; technologies: string[] }
interface Data { projects: Project[] }

const TEXT = {
  es: { title: 'Productos de Nahuel', all: 'Todos', visit: 'Visitar', empty: 'No hay productos con esa tecnología.', loading: '…', seeAll: 'Ver todos', error: 'No se pudo cargar.' },
  en: { title: "Nahuel's products", all: 'All', visit: 'Visit', empty: 'No products with that technology.', loading: '…', seeAll: 'See all', error: "Couldn't load." },
} as const;

const app = createApp('nahuel-projects');
const state = { data: null as Data | null, tech: null as string | null, busy: false, error: false, expanded: true };
const t = (k: keyof (typeof TEXT)['es']) => TEXT[lang(app)][k];

function render(): void {
  const host = root();
  host.textContent = '';
  if (!state.data) return void host.append(el('p', { class: 'muted', text: t('loading') }));

  const all = state.data.projects;
  const techs = [...new Set(all.flatMap((p) => p.technologies))].sort((a, b) => a.localeCompare(b));
  host.append(el('h1', { text: t('title') }));

  const chips = el('div', { class: 'chips', role: 'group' });
  for (const tech of [null, ...techs]) {
    const b = el('button', { type: 'button', 'aria-pressed': String(state.tech === tech), text: tech ?? t('all') });
    b.addEventListener('click', () => { state.tech = tech; render(); });
    chips.append(b);
  }
  host.append(chips);

  const visible = all.filter((p) => !state.tech || p.technologies.includes(state.tech));
  if (visible.length === 0) host.append(el('p', { class: 'muted', text: t('empty') }));

  const list = el('div', { class: 'list' });
  for (const p of visible) {
    const visit = el('button', { type: 'button', text: t('visit') });
    visit.addEventListener('click', () => openLink(app, p.url));
    list.append(el('article', { class: 'card' }, [
      el('header', {}, [el('h2', { text: p.name }), visit]),
      el('p', { class: 'muted', text: p.tagline }),
      el('div', { class: 'tags' }, p.technologies.map((x) => el('span', { class: 'chip sm', text: x }))),
    ]));
  }
  host.append(list);

  // Si el modelo llamó a la tool con un filtro, la vista solo tiene esa parte: se pide el resto.
  if (!state.expanded) {
    const more = el('button', { type: 'button', text: state.busy ? t('loading') : t('seeAll') });
    more.disabled = state.busy;
    more.addEventListener('click', () => void loadAll());
    const bar = el('div', { class: 'bar' }, [more]);
    if (state.error) bar.append(el('span', { class: 'err', role: 'alert', text: t('error') }));
    host.append(bar);
  }
}

async function loadAll(): Promise<void> {
  state.busy = true; state.error = false; render();
  try {
    const result = await app.callServerTool({ name: 'list_projects', arguments: { lang: lang(app) === 'en' ? 'en-US' : 'es-AR' } });
    const data = result.structuredContent as Data | undefined;
    if (result.isError || !data || !Array.isArray(data.projects)) throw new Error('Respuesta inesperada.');
    state.data = data; state.tech = null; state.expanded = true;
  } catch {
    state.error = true;
  } finally {
    state.busy = false; render();
  }
}

// El botón "Ver todos" solo tiene sentido si el modelo llamó a la tool con un filtro.
app.ontoolinput = (params) => {
  state.expanded = !(params.arguments as { tech?: string } | undefined)?.tech;
};

mount(
  app,
  (d): d is Data => !!d && Array.isArray((d as Data).projects),
  (d) => { state.data = d; state.tech = null; },
  render,
);
