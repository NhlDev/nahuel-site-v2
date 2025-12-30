import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection, LOCALE_ID } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ContactMe } from './contact-me';
import { Mailer } from '../../services/mailer';

describe('ContactMe', () => {
  let component: ContactMe;
  let fixture: ComponentFixture<ContactMe>;
  let mailerSpy: jasmine.SpyObj<Mailer>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    mailerSpy = jasmine.createSpyObj('Mailer', ['sendContact']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIcon,
        MatSnackBarModule,
        ContactMe,
      ],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: Mailer, useValue: mailerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactMe);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    spyOn(snackBar, 'open').and.stub();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render channels and meta facts', () => {
    const el: HTMLElement = fixture.nativeElement;

    const channels = el.querySelectorAll('.channels .channel');
    expect(channels.length).toBe(3);

    const email = channels[0] as HTMLAnchorElement;
    const linkedin = channels[1] as HTMLAnchorElement;
    const github = channels[2] as HTMLAnchorElement;

    expect(email.getAttribute('href')).toBe(`mailto:${component.ownerEmail}`);
    expect(linkedin.getAttribute('href')).toBe(component.linkedInUrl);
    expect(github.getAttribute('href')).toBe(component.githubUrl);

    const metaFactsItems = el.querySelectorAll('.meta-facts .mf');
    // metaFacts depende de locale inyectado
    const expectedCount = component.metaFacts[component.locale as string].length;
    expect(metaFactsItems.length).toBe(expectedCount);
  });

  it('should show validation errors after marking controls as touched', () => {
    component.form.markAllAsTouched();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const errors = el.querySelectorAll('mat-error');
    expect(errors.length).toBeGreaterThan(0);

    // Deberían aparecer los 3 errores de requerido inicialmente
    const errorTexts = Array.from(errors).map(e => e.textContent?.trim());
    expect(errorTexts?.some(t => t?.includes('El nombre es obligatorio') || t?.includes('Name is required'))).toBeTrue();
    expect(errorTexts?.some(t => t?.includes('El email es obligatorio') || t?.includes('Email is required'))).toBeTrue();
    expect(errorTexts?.some(t => t?.includes('El mensaje es obligatorio') || t?.includes('Message is required'))).toBeTrue();
  });

  it('onSubmit should not call Mailer when form is invalid and should mark controls as touched', async () => {
    expect(component.form.invalid).toBeTrue();

    await component.onSubmit();

    expect(mailerSpy.sendContact).not.toHaveBeenCalled();
    // Todos los controles quedan touched
    const allTouched = Object.values(component.form.controls).every(c => c.touched);
    expect(allTouched).toBeTrue();
  });

  it('onSubmit should send contact with recaptcha token and reset form on success', async () => {
    // Mock grecaptcha (evita carga de script)
    (window as any).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: () => Promise.resolve('token-123'),
    };

    component.form.setValue({
      name: 'John Tester',
      email: 'john@example.com',
      message: 'Hello there! This is a test message.',
    });

    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeTrue();

    mailerSpy.sendContact.and.resolveTo({ ok: true } as any);

    await component.onSubmit();

    expect(mailerSpy.sendContact).toHaveBeenCalledTimes(1);
    const callArg = mailerSpy.sendContact.calls.mostRecent().args[0];
    expect(callArg).toEqual(
      jasmine.objectContaining({
        name: 'John Tester',
        email: 'john@example.com',
        message: 'Hello there! This is a test message.',
        recaptchaToken: 'token-123',
        locale: 'en-US',
      })
    );

    expect(snackBar.open).toHaveBeenCalledWith(
      'Message sent! I will get back to you soon.',
      undefined,
      jasmine.any(Object)
    );
    expect(component.form.pristine).toBeTrue();
    expect(component.form.value).toEqual({ name: null, email: null, message: null });
    expect(component.sending).toBeFalse();
  });

  it('onSubmit should show error snackbar and reset sending on failure', async () => {
    (window as any).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: () => Promise.resolve('token-err'),
    };

    component.form.setValue({
      name: 'John',
      email: 'john@example.com',
      message: 'A valid long message',
    });

    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeTrue();

    mailerSpy.sendContact.and.rejectWith({ error: 'Server down' });

    await component.onSubmit();

    expect(mailerSpy.sendContact).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'There was an error. Please try again later.',
      undefined,
      jasmine.any(Object)
    );
    expect(component.sending).toBeFalse();
  });

  it('should disable action buttons while sending', async () => {
    component.sending = true;
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const resetBtn = el.querySelector('button[type="button"]') as HTMLButtonElement;
    const submitBtn = el.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(resetBtn.disabled).toBeTrue();
    expect(submitBtn.disabled).toBeTrue();
  });
});
