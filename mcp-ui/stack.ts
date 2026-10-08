import { app as createApp, el, lang, mount, root } from './common';

interface Group { group: string; items: string[] }
interface Data { groups: Group[] }

const TEXT = { es: { title: 'Stack', loading: '…' }, en: { title: 'Stack', loading: '…' } } as const;

const app = createApp('nahuel-stack');
const state = { data: null as Data | null };

function render(): void {
  const host = root();
  host.textContent = '';
  if (!state.data) return void host.append(el('p', { class: 'muted', text: TEXT[lang(app)].loading }));

  host.append(el('h1', { text: TEXT[lang(app)].title }));
  const list = el('div', { class: 'list' });
  for (const g of state.data.groups) {
    list.append(el('section', { class: 'card' }, [
      el('h2', { text: g.group }),
      el('div', { class: 'tags' }, g.items.map((x) => el('span', { class: 'chip', text: x }))),
    ]));
  }
  host.append(list);
}

mount(app, (d): d is Data => !!d && Array.isArray((d as Data).groups), (d) => { state.data = d; }, render);
