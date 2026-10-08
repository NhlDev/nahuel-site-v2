import { app as createApp, el, lang, mount, openLink, root } from './common';

interface Data { lang?: string; email: string; linkedin: string; github: string; form: string; responseTime: string }

const TEXT = {
  es: { title: 'Contacto', email: 'Enviar email', linkedin: 'LinkedIn', github: 'GitHub', form: 'Formulario del sitio', reply: 'Responde en', loading: '…' },
  en: { title: 'Contact', email: 'Send email', linkedin: 'LinkedIn', github: 'GitHub', form: 'Site contact form', reply: 'Usually replies in', loading: '…' },
} as const;

const app = createApp('nahuel-contact');
const state = { data: null as Data | null };
const t = (k: keyof (typeof TEXT)['es']) => TEXT[lang(app)][k];

function render(): void {
  const host = root();
  host.textContent = '';
  if (!state.data) return void host.append(el('p', { class: 'muted', text: t('loading') }));

  const d = state.data;
  host.append(el('h1', { text: t('title') }));
  host.append(el('p', { class: 'muted', text: `${t('reply')} ${d.responseTime}` }));

  const bar = el('div', { class: 'bar' });
  for (const [label, url] of [[t('email'), `mailto:${d.email}`], [t('linkedin'), d.linkedin], [t('github'), d.github], [t('form'), d.form]] as const) {
    const b = el('button', { type: 'button', text: label });
    b.addEventListener('click', () => openLink(app, url));
    bar.append(b);
  }
  host.append(bar);
}

mount(app, (d): d is Data => !!d && typeof (d as Data).email === 'string', (d) => { state.data = d; }, render);
