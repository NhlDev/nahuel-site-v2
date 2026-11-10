import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Lo que usamos de la API pública del widget de Chatbot Up (`window.ChatbotUp`). */
interface ChatbotUpApi {
  ask?: (question: string) => Promise<string>;
}

/**
 * El asistente del sitio (widget de Chatbot Up). El script se carga después de la página, y una versión vieja
 * del widget no trae `ask`, así que los botones "Preguntale al asistente" solo se muestran cuando está disponible.
 */
@Injectable({ providedIn: 'root' })
export class Assistant {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly available = signal(false);

  /** Vuelve a mirar si el widget ya expone `ask` (se llama al cargar el script y al mostrar una página que lo usa). */
  refresh(): void {
    this.available.set(this.isBrowser && typeof this.api()?.ask === 'function');
  }

  /** Abre el chat y le hace la pregunta. Gasta cupo del bot: solo desde un clic. */
  async ask(question: string): Promise<void> {
    await this.api()?.ask?.(question);
  }

  private api(): ChatbotUpApi | undefined {
    return (window as unknown as { ChatbotUp?: ChatbotUpApi }).ChatbotUp;
  }
}
