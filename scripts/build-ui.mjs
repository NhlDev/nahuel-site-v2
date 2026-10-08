// Compila las vistas de MCP Apps (mcp-ui/) a UN solo HTML por vista en ui-dist/: la vista corre en un iframe con CSP
// `default-src 'none'`, así que el JS va adentro del HTML, sin archivos externos que servir ni cargar.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const views = [
  { name: 'projects', title: 'Productos' },
  { name: 'timeline', title: 'Experiencia' },
  { name: 'stack', title: 'Stack' },
  { name: 'contact', title: 'Contacto' },
];
const template = fs.readFileSync(path.join(root, 'mcp-ui/template.html'), 'utf8');
if (!template.includes('/*BUNDLE*/')) throw new Error('mcp-ui/template.html no tiene el marcador /*BUNDLE*/');

for (const view of views) {
  const result = await build({
    entryPoints: [path.join(root, `mcp-ui/${view.name}.ts`)],
    bundle: true,
    format: 'iife',
    target: 'es2020',
    platform: 'browser',
    minify: true,
    write: false,
    legalComments: 'none',
  });

  // Un "</script" dentro del JS cerraría el <script> del HTML antes de tiempo.
  const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  // Función de reemplazo: con un string, "$&" y "$'" dentro del JS se interpretarían como patrones.
  const html = template.replace('__TITLE__', view.title).replace('/*BUNDLE*/', () => js);
  const out = path.join(root, 'ui-dist', `${view.name}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`ui-dist/${view.name}.html: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}
