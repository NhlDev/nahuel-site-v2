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

/** Servidor MCP (Streamable HTTP, stateless) con el contenido público del sitio. Se monta en /api/mcp. */
export function createMcpRouter(): Router {
  const router = Router();

  router.use(
    rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false }),
    requireToken,
  );

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

  return router;
}
