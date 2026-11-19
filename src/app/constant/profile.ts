/**
 * Datos públicos del perfil. Fuente única para la página "Sobre mí" y para el servidor MCP
 * (src/mcp): lo que el asistente dice no puede diferir de lo que muestra el sitio.
 */

export type Lang = 'es-AR' | 'en-US';

export interface Product {
  /** Página del caso en el sitio (ver constant/projects.ts) */
  slug: 'chatbot-up' | 'comprobado' | 'control-up';
  name: string;
  tagline: string;
  url: string;
  icon: string;
  technologies: string[];
  /** Canales públicos del producto, tal como figuran en su propio sitio. */
  contact: ProductContact;
}

export interface ProductContact {
  email: string;
  /** Solo dígitos con código de país, para wa.me */
  whatsapp?: string;
  /** Para mostrar */
  whatsappDisplay?: string;
}

export interface QuickFact {
  icon: string;
  text: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export const contact = {
  name: 'Nahuel Alderete',
  email: 'nahuel.ald@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nahuel-alderete',
  github: 'https://github.com/NhlDev',
  site: 'https://nahuel.app',
  location: 'Buenos Aires, Argentina',
  timezone: 'UTC−3',
  responseTime: '24–48 h',
} as const;

export const role: Record<Lang, string> = {
  'es-AR': 'AI Engineer & Full-Stack Developer (IA aplicada, LLMs y automatización)',
  'en-US': 'AI Engineer & Full-Stack Developer (applied AI, LLMs and automation)',
};

/** Productos SaaS propios (fundador / desarrollador) */
export const products: Record<Lang, Product[]> = {
  'es-AR': [
    {
      slug: 'chatbot-up',
      name: 'Chatbot Up',
      tagline: 'Asistentes con IA (RAG) entrenados con el contenido de cada negocio, para WhatsApp, Telegram, Instagram y la web.',
      url: 'https://chatbotup.com.ar/',
      icon: 'smart_toy',
      technologies: ['.NET', 'Gemini', 'RAG', 'pgvector', 'MCP', 'Angular'],
      contact: { email: 'info@chatbotup.com.ar', whatsapp: '541181273920', whatsappDisplay: '+54 11 8127-3920' },
    },
    {
      slug: 'control-up',
      name: 'Control Up',
      tagline: 'Gestión comercial para PyMEs: ventas, stock, clientes y reportes en un solo lugar.',
      url: 'https://controlup.com.ar/',
      icon: 'point_of_sale',
      technologies: ['.NET', 'Angular', 'TypeScript'],
      contact: { email: 'info@controlup.com.ar', whatsapp: '541125512106', whatsappDisplay: '+54 11 2551-2106' },
    },
    {
      slug: 'comprobado',
      name: 'Comprobado',
      tagline: 'Facturación electrónica de ARCA (ex AFIP, antes ArcaSuite) desde una consola web, una API REST o un asistente de IA (MCP): emite facturas A, B, C, E y FCE MiPyME, y explica cada error de ARCA en castellano.',
      url: 'https://comprobado.com.ar/',
      icon: 'receipt_long',
      technologies: ['.NET', 'Gemini', 'MCP', 'PostgreSQL', 'Angular'],
      contact: { email: 'admin@comprobado.com.ar', whatsapp: '5491181269157', whatsappDisplay: '+54 9 11 8126-9157' },
    },
  ],
  'en-US': [
    {
      slug: 'chatbot-up',
      name: 'Chatbot Up',
      tagline: 'AI assistants (RAG) trained on each business’s own content, for WhatsApp, Telegram, Instagram and the web.',
      url: 'https://chatbotup.com.ar/',
      icon: 'smart_toy',
      technologies: ['.NET', 'Gemini', 'RAG', 'pgvector', 'MCP', 'Angular'],
      contact: { email: 'info@chatbotup.com.ar', whatsapp: '541181273920', whatsappDisplay: '+54 11 8127-3920' },
    },
    {
      slug: 'control-up',
      name: 'Control Up',
      tagline: 'Business management for SMBs: sales, inventory, customers and reports in one place.',
      url: 'https://controlup.com.ar/',
      icon: 'point_of_sale',
      technologies: ['.NET', 'Angular', 'TypeScript'],
      contact: { email: 'info@controlup.com.ar', whatsapp: '541125512106', whatsappDisplay: '+54 11 2551-2106' },
    },
    {
      slug: 'comprobado',
      name: 'Comprobado',
      tagline: 'ARCA (formerly AFIP) e-invoicing for Argentina (formerly ArcaSuite) from a web console, a REST API or an AI assistant (MCP): issues A, B, C, E and MiPyME credit invoices and explains every ARCA error in plain language.',
      url: 'https://comprobado.com.ar/',
      icon: 'receipt_long',
      technologies: ['.NET', 'Gemini', 'MCP', 'PostgreSQL', 'Angular'],
      contact: { email: 'admin@comprobado.com.ar', whatsapp: '5491181269157', whatsappDisplay: '+54 9 11 8126-9157' },
    },
  ],
};

export const quickFacts: Record<Lang, QuickFact[]> = {
  'es-AR': [
    { icon: 'location_on', text: 'Buenos Aires, Argentina' },
    { icon: 'translate', text: 'Español nativo · Inglés B2' },
    { icon: 'auto_awesome', text: 'Foco: IA aplicada, LLMs y automatización' },
  ],
  'en-US': [
    { icon: 'location_on', text: 'Buenos Aires, Argentina' },
    { icon: 'translate', text: 'Native Spanish · B2 English' },
    { icon: 'auto_awesome', text: 'Focus: applied AI, LLMs and automation' },
  ],
};

/** Mismo stack que muestra la página "Sobre mí" (public/techs). */
export const skills: Record<Lang, SkillGroup[]> = {
  'es-AR': [
    { group: 'IA y automatización', items: ['Gemini', 'Claude', 'RAG', 'MCP (Model Context Protocol)', 'n8n', 'Spec-Driven Development (OpenSpec)'] },
    { group: 'Backend', items: ['.NET', 'C#', 'Node.js'] },
    { group: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript'] },
  ],
  'en-US': [
    { group: 'AI & automation', items: ['Gemini', 'Claude', 'RAG', 'MCP (Model Context Protocol)', 'n8n', 'Spec-Driven Development (OpenSpec)'] },
    { group: 'Backend', items: ['.NET', 'C#', 'Node.js'] },
    { group: 'Frontend', items: ['Angular', 'TypeScript', 'JavaScript'] },
  ],
};
