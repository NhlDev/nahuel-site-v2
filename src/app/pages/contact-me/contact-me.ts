import { Component, PLATFORM_ID, inject, LOCALE_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Mailer } from '../../services/mailer';
import { CAPTCHA_KEY } from '../../constant';

declare const grecaptcha: any;

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatSnackBarModule
  ],
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss'
})
export class ContactMe {
  readonly locale = inject(LOCALE_ID);
  readonly ownerEmail = 'nahuel.ald@gmail.com';

  private fb: FormBuilder = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  linkedInUrl = 'https://www.linkedin.com/in/nahuel-alderete';
  githubUrl = 'https://github.com/NhlDev';

  metaFacts: Record<string, { icon: string; text: string }[]> = {
    'es-AR': [
      { icon: 'location_on', text: 'Buenos Aires, AR (UTC−3)' },
      { icon: 'schedule', text: 'Respuesta habitual: 24–48h' },
      { icon: 'work', text: 'Disponibilidad: Part/Full‑time' },
    ],
    'en-US': [
      { icon: 'location_on', text: 'Buenos Aires, AR (UTC−3)' },
      { icon: 'schedule', text: 'Typical response: 24–48h' },
      { icon: 'work', text: 'Availability: Part/Full‑time' },
    ]
  };

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private mailer = inject(Mailer);
  private snackBar = inject(MatSnackBar);

  sending = false;
  private readonly recaptchaSiteKey = CAPTCHA_KEY;

  hasError(ctrl: 'name' | 'email' | 'message', err: string) {
    const c = this.form.get(ctrl);
    return !!c && c.touched && c.hasError(err);
  }

  async onSubmit() {
    if (this.form.invalid || this.sending) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending = true;

    try {
      let recaptchaToken = '';
      if (this.isBrowser && typeof grecaptcha !== 'undefined') {

        recaptchaToken = await new Promise((resolve, reject) => {
          grecaptcha.ready(() => {
            grecaptcha.execute(this.recaptchaSiteKey, { action: 'submit' })
              .then((token: string) => {
                resolve(token);
              })
              .catch((error: Error) => {
                console.error("Error executing reCAPTCHA", error);
                reject(error);
              });
          });
        });

        const { name, email, message } = this.form.value as { name: string; email: string; message: string };

        await this.mailer.sendContact({
          name,
          email,
          message,
          recaptchaToken,
          locale: this.locale as string,
        });

        this.openSnack(this.locale === 'en-US'
          ? 'Message sent! I will get back to you soon.'
          : '¡Mensaje enviado! Te responderé pronto.');
        this.form.reset();
      }
    } catch (e) {
      this.openSnack(this.locale === 'en-US'
        ? 'There was an error. Please try again later.'
        : 'Ocurrió un error. Intentá más tarde.');
      console.error(e);
    } finally {
      this.sending = false;
    }
  }

  // Helper para mostrar snackbars
  private openSnack(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
