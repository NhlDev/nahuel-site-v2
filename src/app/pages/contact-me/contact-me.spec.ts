import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Mailer } from '../../services/mailer';
import { ContactMe } from './contact-me';

describe('ContactMe', () => {
  let component: ContactMe;
  let fixture: ComponentFixture<ContactMe>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIcon,
        MatInputModule,
        ReactiveFormsModule,
        ContactMe,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactMe);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    spyOn(snackBar, 'open').and.stub();

    fixture.detectChanges();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('has forms module', () => {
    expect(component.form).toBeTruthy();
  });

  it('has submit method', () => {
    expect(component.onSubmit).toBeTruthy();
  });

  it('has reset method', () => {
    expect(component.form.reset).toBeTruthy();
  });

  it('has error helper', () => {
    expect(component.hasError).toBeTruthy();
  });

  it('should have title element', () => {
    const el = fixture.nativeElement;
    const title = el.querySelector('.contact-title');
    expect(title).toBeTruthy();
  });

  it('should have form elements', () => {
    const el = fixture.nativeElement;
    const inputs = el.querySelectorAll('input[formControlName], textarea[formControlName]');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it('should have buttons', () => {
    const el = fixture.nativeElement;
    const btns = el.querySelectorAll('button[type="submit"]');
    expect(btns.length).toBeGreaterThanOrEqual(1);
  });
});
