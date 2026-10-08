// Pieza común de las vistas MCP Apps (extensión io.modelcontextprotocol/ui). Cada vista se compila a UN solo HTML
// (scripts/build-ui.mjs): corre en un iframe con CSP `default-src 'none'`, sin nada externo.
import { App, applyDocumentTheme, applyHostStyleVariables } from '@modelcontextprotocol/ext-apps/app-with-deps';

export type UiLang = 'es' | 'en';

export const app = (name: string) => new App({ name, version: '1.0.0' });

/** Idioma del contenido (`lang` del dato de la tool): manda sobre el del host para que texto y datos coincidan. */
let contentLang: UiLang | null = null;

export function lang(a: App): UiLang {
  if (contentLang) return contentLang;
  return String(a.getHostContext()?.locale ?? 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, string> = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

/** Abre un enlace con el host (el iframe no puede navegar por su cuenta). Solo https y mailto. */
export function openLink(a: App, url: string): void {
  if (!/^(https:|mailto:)/i.test(url)) return;
  void a.openLink({ url }).catch(() => undefined);
}

/**
 * Engancha una vista al host. Los handlers van ANTES de connect(): el host manda tool-input y tool-result apenas
 * termina el handshake. `accept` valida el dato estructurado y devuelve true si es de esta vista.
 */
export function mount<T>(a: App, accept: (data: unknown) => data is T, onData: (data: T) => void, render: () => void): void {
  const applyHost = () => {
    const context = a.getHostContext();
    if (!context) return;
    if (context.theme) applyDocumentTheme(context.theme);
    if (context.styles?.variables) applyHostStyleVariables(context.styles.variables);
  };

  a.ontoolresult = (params) => {
    if (accept(params.structuredContent)) {
      const dataLang = (params.structuredContent as { lang?: unknown }).lang;
      if (typeof dataLang === 'string') contentLang = dataLang.toLowerCase().startsWith('en') ? 'en' : 'es';
      onData(params.structuredContent);
      render();
    }
  };
  a.onhostcontextchanged = () => {
    applyHost();
    render();
  };

  render();
  void a.connect().then(() => {
    applyHost();
    render();
  });
}

export const root = (): HTMLElement => document.getElementById('app')!;
