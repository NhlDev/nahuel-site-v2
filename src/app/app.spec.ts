import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header and footer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-header')).not.toBeNull();
    expect(el.querySelector('app-footer')).not.toBeNull();
  });

  it('should render main sections', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const main = el.querySelector('main');
    expect(main).not.toBeNull();
    expect(main?.querySelector('#home')).not.toBeNull();
    expect(main?.querySelector('#about-me')).not.toBeNull();
    expect(main?.querySelector('#resume')).not.toBeNull();
    expect(main?.querySelector('#contact-me')).not.toBeNull();
  });
});
