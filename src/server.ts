import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

//import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// JSON body parsing
app.use(express.json({ limit: '1mb' }));

app.enable('trust proxy');

// Seguridad básica (CSP adaptado a fuentes/recaptcha)
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         "script-src": ["'self'", "'unsafe-inline'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
//         "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//         "font-src": ["'self'", "https://fonts.gstatic.com"],
//         "img-src": ["'self'", "data:"],
//         "connect-src": ["'self'"]
//       }
//     },
//     crossOriginEmbedderPolicy: false
//   })
// );

// Compresión
app.use(compression());

// Rate limit para /api/contact
const contactLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/contact', contactLimiter);

// Contact API protegido por reCAPTCHA v3 (antes de la redirección por locales)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, recaptchaToken, locale } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Verificar reCAPTCHA
    const secret = process.env['RECAPTCHA_SECRET'];
    if (!secret) return res.status(500).json({ message: 'Server misconfigured' });

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: recaptchaToken || '',
        remoteip: req.ip || '',
      }),
    });
    const data = await resp.json();
    if (!data.success || (typeof data.score === 'number' && data.score < 0.5)) {
      return res.status(403).json({ message: 'reCAPTCHA verification failed' });
    }

    // Envío de email
    const to = process.env['SMTP_USER'];
    const host = process.env['SMTP_HOST'];
    const port = Number(process.env['SMTP_PORT'] || 587);
    const user = process.env['SMTP_USER'];
    const pass = process.env['SMTP_PASS'];
    if (!host || !user || !pass || !to) {
      return res.status(500).json({ message: 'SMTP not configured' });
    }

    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `Contacto desde nahu-dev (${locale || 'es-AR'})`;
    const text = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;
    const html = `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Mensaje:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`;

    await transporter.sendMail({
      from: `"Sitio Web" <${user}>`,
      to,
      subject,
      text,
      html,
      replyTo: email,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal error' });
  }
});

// helper
function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- i18n config ---
const SUPPORTED_LOCALES = new Set(['es-AR', 'en-US']);
const DEFAULT_LOCALE = 'es-AR';

// Añadir cabecera Vary para caches/CDN
app.use((req, res, next) => {
  res.setHeader('Vary', 'Accept-Language');
  next();
});

// Redirigir raíz o rutas sin prefijo a la locale negociada (excluir API)
app.use((req, res, next) => {
  const seg1 = (req.path.split('/')[1] || '').trim();
  if (seg1 === 'api') return next();
  if (!SUPPORTED_LOCALES.has(seg1)) {
    const acceptLanguage = req.headers['accept-language'] as string | undefined;
    const locale = (() => {
      if (!acceptLanguage) return DEFAULT_LOCALE;
      const parts = acceptLanguage.split(',').map(s => s.trim().toLowerCase());
      for (const p of parts) {
        const [tag] = p.split(';');
        if (tag.startsWith('es')) return 'es-AR';
        if (tag.startsWith('en')) return 'en-US';
      }
      return DEFAULT_LOCALE;
    })();
    const target = `/${locale}${req.originalUrl}`;
    return res.redirect(302, target);
  }
  next();
});

// Static por locale
for (const locale of SUPPORTED_LOCALES) {
  app.use(
    `/${locale}`,
    express.static(join(import.meta.dirname, '../browser', locale), {
      maxAge: '1y',
      index: false,
      redirect: false,
    }),
  );
}

// Static raíz para assets compartidos (por si hay referencias absolutas)
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// SSR bajo cada prefijo de locale
for (const locale of SUPPORTED_LOCALES) {
  app.use(`/${locale}`, (req, res, next) => {
    angularApp
      .handle(req)
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next(),
      )
      .catch(next);
  });
}

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
