import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection()
      ]
    }).compileComponents();
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should be defined', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });

  it('should implement OnInit', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app instanceof Object).toBeTruthy();
  });
});
