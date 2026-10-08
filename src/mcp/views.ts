import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// MCP Apps (extensión io.modelcontextprotocol/ui): una tool declara su vista con `_meta.ui.resourceUri` y el host
// la pide con `resources/read`. Spec: https://github.com/modelcontextprotocol/ext-apps

export const UI_MIME_TYPE = 'text/html;profile=mcp-app';

export const VIEW_URIS = {
  projects: 'ui://nahuel/projects',
  timeline: 'ui://nahuel/timeline',
  stack: 'ui://nahuel/stack',
  contact: 'ui://nahuel/contact',
} as const;

export type ViewName = keyof typeof VIEW_URIS;

export const VIEWS: { name: ViewName; title: string; description: string }[] = [
  { name: 'projects', title: 'Productos', description: 'Tarjetas de productos filtrables por tecnología' },
  { name: 'timeline', title: 'Experiencia', description: 'Línea de tiempo de la trayectoria, filtrable por tecnología' },
  { name: 'stack', title: 'Stack', description: 'Tecnologías agrupadas por área' },
  { name: 'contact', title: 'Contacto', description: 'Canales de contacto' },
];

/** `_meta` de una tool para declarar su vista. */
export const viewMeta = (name: ViewName) => ({ ui: { resourceUri: VIEW_URIS[name] } });

/**
 * `ui-dist/` lo genera `npm run build:ui`. Se resuelve contra el directorio de trabajo (la raíz del proyecto
 * en desarrollo y /app en la imagen de Docker) y no contra el bundle, que Angular deja en dist/.
 */
const uiDist = () => process.env['MCP_UI_DIST'] ?? join(process.cwd(), 'ui-dist');

const cache = new Map<ViewName, string>();

/** El HTML de una vista. Es un diccionario cerrado: la URI que manda el cliente nunca arma una ruta de archivo. */
export function readView(name: ViewName): string {
  let html = cache.get(name);
  if (html === undefined) {
    // Si falta, el error es claro: se olvidó `npm run build:ui`.
    html = readFileSync(join(uiDist(), `${name}.html`), 'utf8');
    cache.set(name, html);
  }
  return html;
}
