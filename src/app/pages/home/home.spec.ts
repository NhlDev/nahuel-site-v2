import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero title with greeting, accent and role', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('#hero-title.hero__title')!;
    const spans = title.querySelectorAll('span');

    expect(title).toBeTruthy();
    expect(spans.length).toBe(3);
    expect(spans[0].textContent?.trim()).toBe('Hola, soy');
    expect(spans[1].classList.contains('accent')).toBeTrue();
    expect(spans[2].classList.contains('role')).toBeTrue();
  });

  it('should render a chip for each core skill', () => {
    const el: HTMLElement = fixture.nativeElement;
    const chips = el.querySelectorAll('.stack-chips .chip');
    expect(chips.length).toBe(component.coreSkills.length);
  });

  it('should render quick stats section with 3 items', () => {
    const el: HTMLElement = fixture.nativeElement;
    const stats = el.querySelectorAll('.quick-stats .stat');
    expect(stats.length).toBe(3);
  });

  it('should render hero visual with floating Angular logo', () => {
    const el: HTMLElement = fixture.nativeElement;
    const img = el.querySelector('.hero__visual img.floating-logo') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('techs/angular.svg');
  });

  it('should start typing text after initial delay and update the DOM', fakeAsync(() => {
    // Crear fixture dentro de fakeAsync para capturar timers
    const fix = TestBed.createComponent(Home);
    const cmp = fix.componentInstance;
    fix.detectChanges();

    // Avanza más que la pausa inicial para empezar a tipear
    tick(1000);
    fix.detectChanges();

    const el: HTMLElement = fix.nativeElement;
    const typed = el.querySelector('.typed')!;
    expect(cmp.typedText().length).toBeGreaterThan(0);
    expect(typed.textContent?.length || 0).toBeGreaterThan(0);
  }));

  it('should stop typing after ngOnDestroy is called', fakeAsync(() => {
    const fix = TestBed.createComponent(Home);
    const cmp = fix.componentInstance;
    fix.detectChanges();

    // Destruir antes de que empiece a escribir
    cmp.ngOnDestroy();
    // Avanzar bastante tiempo, no debería cambiar
    tick(5000);

    expect(cmp.typedText()).toBe('');
  }));
});
