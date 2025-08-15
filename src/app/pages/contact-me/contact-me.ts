import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-contact-me',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon],
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss'
})
export class ContactMe {
  // Cambia este email por el tuyo
  readonly ownerEmail = 'nahuel.ald@gmail.com';

  private fb: FormBuilder = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  // Enlaces rápidos (actualiza tus perfiles)
  linkedInUrl = 'https://www.linkedin.com/in/nahuel-alderete';
  githubUrl = 'https://github.com/NhlDev';

  // Datos rápidos mostrados al costado del formulario
  metaFacts = [
    { icon: 'location_on', text: 'Buenos Aires, AR (UTC−3)' },
    { icon: 'schedule', text: 'Respuesta habitual: 24–48h' },
    { icon: 'work', text: 'Disponibilidad: Part/Full‑time' },
  ];


  hasError(ctrl: 'name' | 'email' | 'message', err: string) {
    const c = this.form.get(ctrl);
    return !!c && c.touched && c.hasError(err);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, message } = this.form.value;

    // Fallback simple: abre el cliente de correo (puedes reemplazar por una API)
    const subject = encodeURIComponent('Consulta desde nahu-dev');
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`
    );
    window.location.href = `mailto:${this.ownerEmail}?subject=${subject}&body=${body}`;
  }
}
