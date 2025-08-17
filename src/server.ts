import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// JSON body parsing
app.use(express.json({ limit: '1mb' }));

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
    const to = process.env['MAIL_TO'] || process.env['SMTP_USER'];
    const host = process.env['SMTP_HOST'];
    const port = Number(process.env['SMTP_PORT'] || 587);
    const user = process.env['SMTP_USER'];
    const pass = process.env['SMTP_PASS'];
    if (!host || !user || !pass || !to) {
      return res.status(500).json({ message: 'SMTP not configured' });
    }

    const nodemailer = await import('nodemailer');
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
      from: `"nahu-dev site" <${user}>`,
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
