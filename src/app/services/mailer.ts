import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Mailer {
  async sendContact(payload: { name: string; email: string; message: string; recaptchaToken: string; locale?: string }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Contact failed');
    }
    return res.json();
  }
}
