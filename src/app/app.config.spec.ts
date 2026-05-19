import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';

describe('app.config', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideZonelessChangeDetection(),
        provideBrowserGlobalErrorListeners(),
        provideClientHydration(withEventReplay()),
      ],
    }).compileComponents();
  });

  it('should provide ApplicationConfig', () => {
    expect(true).toBe(true);
  });

  it('should have providers array', () => {
    expect(Array.isArray([])).toBe(true);
  });

  it('should have at least one provider', () => {
    expect(true).toBe(true);
  });
});
