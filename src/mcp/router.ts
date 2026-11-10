import { timingSafeEqual } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Router, type Request, type Response, type NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

import { createMcpServer } from './tools';

function tokenMatches(received: string, expected: string): boolean {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function requireToken(req: Request, res: Response, next: NextFunction) {
  const expected = process.env['MCP_API_TOKEN'];
  // Sin token configurado el endpoint queda cerrado: nunca abierto por omisión.
  if (!expected) return res.status(503).json({ message: 'MCP not configured' });

  const header = req.headers.authorization ?? '';
  const received = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!tokenMatches(received, expected)) return res.status(401).json({ message: 'Unauthorized' });
  return next();
}

/** Rutas del protocolo (Streamable HTTP, stateless). Las comparten el endpoint con token y el público. */
function mountMcp(router: Router): void {
  router.post('/', async (req, res) => {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
      }
    }
  });

  // Stateless: no hay stream de servidor ni sesión que cerrar.
  const notAllowed = (_req: Request, res: Response) =>
    res.status(405).set('Allow', 'POST').json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed' },
      id: null,
    });
  router.get('/', notAllowed);
  router.delete('/', notAllowed);
}

/** Servidor MCP con el contenido público del sitio, autenticado con MCP_API_TOKEN (lo consume Chatbot Up). Se monta en /api/mcp. */
export function createMcpRouter(): Router {
  const router = Router();
  router.use(
    rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false }),
    requireToken,
  );
  mountMcp(router);
  return router;
}

/**
 * El mismo servidor sin token, para que cualquier cliente MCP (Claude, ChatGPT, un IDE) consulte el perfil.
 * Es seguro abrirlo porque todo lo que devuelve ya es público en el sitio y las tools son de solo lectura
 * (no hay escritura, ni envío de mensajes, ni acceso a secretos). Se mitiga el abuso con un límite más bajo
 * por IP (el body ya tiene el tope global de 1 MB). Se monta en /api/mcp/public, antes del endpoint con token.
 */
export function createPublicMcpRouter(): Router {
  const router = Router();

  // Permite clientes MCP que corren en un navegador. Sin credenciales, así que `*` no expone nada de una sesión.
  router.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Protocol-Version',
      'Access-Control-Max-Age': '86400',
      // Helmet lo manda en same-origin y bloquearía la lectura desde otro origen aunque haya CORS
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  });

  router.use(rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false }));
  mountMcp(router);
  return router;
}
