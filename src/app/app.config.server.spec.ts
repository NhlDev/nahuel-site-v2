import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';
import { config } from './app.config.server';

describe('app.config.server', () => {
  it('should merge with server config', () => {
    expect(config).toBeDefined();
    expect(config.providers).toBeDefined();
  });

  it('should include app config providers', () => {
    expect(config.providers.length).toBeGreaterThan(0);
  });

  it('should have providers', () => {
    expect(Array.isArray(config.providers)).toBe(true);
  });
});
