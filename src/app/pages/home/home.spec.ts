import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, Home]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero title with greeting and accent', () => {
    const el: HTMLElement = fixture.nativeElement;
    const title = el.querySelector('#hero-title.hero__title')!;
    const spans = title.querySelectorAll('span');

    expect(title).toBeTruthy();
    expect(spans.length).toBe(2);
    expect(spans[0].textContent?.trim()).toBe('Hola, soy Nahuel Alderete');
    expect(spans[1].classList.contains('accent')).toBeTrue();
  });

  it('should render the role description outside the heading', () => {
    const el: HTMLElement = fixture.nativeElement;
    const role = el.querySelector('.hero > p.role');
    expect(role).toBeTruthy();
    expect(el.querySelector('#hero-title .role')).toBeNull();
  });

  it('should render a chip for each core skill', () => {
    const el: HTMLElement = fixture.nativeElement;
    const chips = el.querySelectorAll('.stack-chips .chip');
    expect(chips.length).toBe(component.coreSkills.length);
  });

  it('should render quick stats as a description list with 3 items', () => {
    const el: HTMLElement = fixture.nativeElement;
    const stats = el.querySelectorAll('dl.quick-stats .stat');
    expect(stats.length).toBe(3);
    stats.forEach(stat => {
      expect(stat.querySelector('dt')).toBeTruthy();
      expect(stat.querySelector('dd.stat__num')).toBeTruthy();
    });
  });
});
