import { TestBed } from '@angular/core/testing';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { appConfig } from './app.config';

describe('app.config', () => {
  it('should provide ApplicationConfig', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
  });

  it('should have providers array', () => {
    expect(Array.isArray(appConfig.providers)).toBe(true);
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should have at least one provider', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });
});
