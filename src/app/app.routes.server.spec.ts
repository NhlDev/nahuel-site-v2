import { serverRoutes } from './app.routes.server';

describe('app.routes.server', () => {
  it('should define server routes', () => {
    expect(serverRoutes).toBeDefined();
    expect(Array.isArray(serverRoutes)).toBe(true);
  });

  it('should have a catch-all route', () => {
    expect(serverRoutes.length).toBeGreaterThan(0);
  });

  it('should contain all routes', () => {
    const hasWildcard = serverRoutes.some(route => route.path === '**');
    expect(hasWildcard).toBe(true);
  });

  it('should use prerender mode', () => {
    const route = serverRoutes[0];
    expect(route.renderMode).toBe(2);
  });
});
