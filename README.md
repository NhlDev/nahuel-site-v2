# nahuel.app

Sitio personal y portfolio de **Nahuel Alderete**, AI Engineer y desarrollador Full-Stack.
Está en producción en **https://nahuel.app** (español `/es-AR/` e inglés `/en-US/`).

Más que una landing, es un proyecto para mostrar criterio técnico: Angular 22 con renderizado
en el servidor, i18n compilada por idioma, SEO pensado también para buscadores de IA,
accesibilidad y un despliegue contenerizado en Google Cloud.

## Qué incluye

- **Una sola página** con cuatro secciones: Inicio, Sobre mí, Experiencia (diagrama de Gantt y
  timeline) y Contacto.
- **Bilingüe** (es-AR / en-US), con un build y un conjunto de URLs por idioma.
- **Formulario de contacto** con reCAPTCHA v3, límite de peticiones y envío por SMTP.
- **Servidor MCP** (`/api/mcp`, solo lectura) que expone el perfil, la experiencia, el stack y los
  proyectos al asistente; comparte los datos con el sitio (`src/app/constant/profile.ts`).
- **Asistente conversacional** embebido, basado en [Chatbot Up](https://chatbotup.com.ar/),
  un producto propio.
- **Sistema de diseño propio**: tokens de color, tipografía, radios y capas (`z-index`)
  definidos como variables CSS; sin librerías de UI más allá de Angular Material.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 22 (componentes standalone, signals, `OnPush`, change detection *zoneless*) |
| UI | Angular Material / CDK 22 con tema propio, SCSS, IBM Plex (Sans y Mono) |
| Render | SSR con `@angular/ssr` + prerender, hidratación incremental (`@defer ... hydrate on viewport`) |
| Servidor | Node.js 24, Express 5, Helmet (CSP), compression, express-rate-limit, Nodemailer |
| i18n | `@angular/localize`, catálogos XLIFF (`src/locale/`), un build por idioma |
| Lenguaje | TypeScript 6.0 en modo `strict` (`strictTemplates` incluido) |
| Tests | Karma + Jasmine (44 tests) |
| Contenedores | Docker (multi-stage, `node:24-alpine`) |
| Nube | Google Cloud Build, Artifact Registry, Cloud Run y Firebase Hosting |

## Arquitectura

```
Navegador ──► Firebase Hosting (nahuel.app) ──► Cloud Run (nahu-site) ──► Express + Angular SSR
              dominio propio y HTTPS            southamerica-east1        ├─ HTML prerenderizado por idioma
                                                                          ├─ POST /api/contact
                                                                          └─ POST /api/ai/send-email
```

- **Un solo contenedor** sirve los archivos estáticos, el HTML renderizado en el servidor y la API.
- **Prefijo por idioma**: `/` redirige (302) a `/es-AR/` o `/en-US/` según `Accept-Language`.
  Las rutas inexistentes responden `404`.
- **Archivos de raíz** (`robots.txt`, `sitemap.xml`, `llms.txt`, íconos y `og-image.png`) se
  sirven desde `/` aunque el build los genere dentro de cada carpeta de idioma.

### Decisiones técnicas

- **SEO y buscadores de IA.** El HTML que recibe un crawler ya trae todo el contenido, con canonical,
  `hreflang`, Open Graph y JSON-LD (`Person` y `WebSite`) generados por idioma. Para lograrlo:
  - Las secciones diferidas con `@defer` usan hidratación incremental; así se renderizan en el
    servidor y siguen cargándose de forma perezosa en el cliente.
  - `allowedHosts` está configurado de forma explícita. Si un `Host` no está permitido, Angular cae
    a renderizado en el cliente y entrega un documento vacío.
  - Hay `sitemap.xml` con `hreflang`, `robots.txt` y un [`llms.txt`](public/llms.txt).
- **Accesibilidad.** HTML semántico, enlace "saltar al contenido", foco visible, `aria-current` en la
  navegación, menú móvil con `inert` y cierre con Escape, y respeto de `prefers-reduced-motion`.
- **Rendimiento.** Presupuestos de bundle en `angular.json` (aviso a 800 kB, error a 1,2 MB),
  carga diferida de secciones, fuentes con `display=swap` y cero animaciones decorativas en bucle.
- **Seguridad.** CSP con Helmet, validación del token de reCAPTCHA en el servidor, límite de
  5 peticiones por minuto en `/api/contact` y secretos solo por variables de entorno.

## Estructura

```
src/
├─ app/
│  ├─ components/     header y footer
│  ├─ pages/          home, about-me, resume, contact-me (una carpeta por sección)
│  ├─ constant/       datos de experiencia y claves públicas
│  ├─ services/       cliente del formulario de contacto
│  ├─ app.ts          SEO por idioma, JSON-LD y carga del asistente
│  └─ app.config.ts   hidratación incremental, zoneless, HttpClient
├─ locale/            catálogos XLIFF (es-AR base, en-US traducido)
├─ styles.scss        tokens de diseño y tema de Material
├─ _mixins.scss       mixins compartidos
└─ server.ts          Express: API, seguridad, redirección por idioma y SSR
public/               robots.txt, sitemap.xml, llms.txt, íconos, og-image y logos de tecnologías
docs/                 base de conocimiento del asistente y fuente de la og-image
firebase-deploy/      firebase.json (rewrite hacia Cloud Run)
cloudbuild.yaml       build y publicación de la imagen en Artifact Registry
Dockerfile            imagen de producción
```

## Desarrollo local

Requiere **Node.js 24** (Angular 22 exige `^22.22.3` o `^24.15.0`) y npm.

```bash
npm ci
npm start                 # ng serve en http://localhost:4200 (solo es-AR)
npm run build:ui          # compila las vistas del servidor MCP (mcp-ui/ → ui-dist/); hace falta antes de build/ssr
npm run build             # build de producción: es-AR y en-US en dist/
npm run watch             # build de desarrollo en modo watch (solo es-AR)
npm run ssr               # levanta el servidor SSR (http://localhost:4000) sobre dist/
npm run test:headless     # tests una sola vez, sin modo watch
```

Los tests usan Karma con Chrome. Si no lo encuentra, definí `CHROME_BIN` con la ruta del navegador.

Para actualizar las traducciones después de cambiar textos con `i18n`:

```bash
npx ng extract-i18n --output-path src/locale   # regenera src/locale/messages.xlf
```

Luego se completan los `<target>` de `src/locale/messages.en-US.xlf`. El build avisa con un
warning por cada traducción faltante.

### Variables de entorno (servidor)

| Variable | Uso |
|---|---|
| `PORT` | Puerto del servidor (por defecto `4000`; Cloud Run lo inyecta) |
| `ALLOWED_HOSTS` | Hosts permitidos para SSR, separados por coma. Tiene un valor por defecto para `nahuel.app`, `*.web.app`, `*.run.app` y `localhost` |
| `RECAPTCHA_SECRET` | Clave secreta de reCAPTCHA v3 para validar el formulario |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Servidor SMTP del que salen los mensajes |
| `CHATBOT_API_TOKEN` | Token que protege `POST /api/ai/send-email`, usado por el asistente |
| `MCP_API_TOKEN` | Bearer token del servidor MCP (`POST /api/mcp`); sin él el endpoint responde 503 |

La clave pública de reCAPTCHA vive en `src/app/constant/index.ts`. Ningún secreto está en el repositorio.

## Despliegue

El despliegue es **contenerizado y sin servidores propios**:

1. **Build de la imagen en Google Cloud Build** (`cloudbuild.yaml`). Construye la imagen del
   `Dockerfile` y la publica en **Artifact Registry** (`southamerica-east1`, repositorio
   `cloud-run-source-deploy`), etiquetada con el `COMMIT_SHA`. Esa imagen es el artefacto que
   consume Cloud Run.
2. **Cloud Run** ejecuta el servicio `nahu-site` en `southamerica-east1` a partir de esa imagen. Escala
   a demanda y se configura con las variables de entorno de la sección anterior (`PORT` lo inyecta Cloud Run).
3. **Firebase Hosting** solo asocia el dominio **nahuel.app** a la instancia: `firebase.json` envía todo
   (`**`) al servicio de Cloud Run. Aporta dominio propio y certificado HTTPS gestionado.

El `Dockerfile` es multi-stage: una etapa instala dependencias y ejecuta
`npm run build:ui && npm run build:localize:prod` (las vistas MCP viajan en `ui-dist/`), y la etapa final instala solo las dependencias de producción,
copia `dist/` y arranca `node dist/nahu-dev-site-v2/server/server.mjs`.

Comandos de referencia (los nombres de proyecto y servicio dependen de la cuenta de Google Cloud):

```bash
# 1. Construir y publicar la imagen (en un trigger de Cloud Build, COMMIT_SHA lo completa Google)
gcloud builds submit --config cloudbuild.yaml --substitutions=COMMIT_SHA=$(git rev-parse HEAD)

# 2. Desplegar esa imagen en Cloud Run
gcloud run deploy nahu-site \
  --image southamerica-east1-docker.pkg.dev/<PROYECTO>/cloud-run-source-deploy/nahu-dev-site-v2:<COMMIT_SHA> \
  --region southamerica-east1

# 3. Publicar la regla de Firebase Hosting (solo cambia si se modifica firebase.json)
cd firebase-deploy && firebase deploy --only hosting
```

`cloudbuild.yaml` cubre el paso 1; el despliegue en Cloud Run no forma parte del archivo.

## Contacto

**Nahuel Alderete** · nahuel.ald@gmail.com ·
[LinkedIn](https://www.linkedin.com/in/nahuel-alderete) · [GitHub](https://github.com/NhlDev)
