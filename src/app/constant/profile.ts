/**
 * Datos públicos del perfil. Fuente única para la página "Sobre mí" y para el servidor MCP
 * (src/mcp): lo que el asistente dice no puede diferir de lo que muestra el sitio.
 */

export type Lang = 'es-AR' | 'en-US';

export interface Product {
  /** Página del caso en el sitio (ver constant/projects.ts) */
  slug: 'chatbot-up' | 'arcasuite' | 'control-up';
  name: string;
  tagline: string;
  url: string;
  icon: string;
  technologies: string[];
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
    },
    {
      slug: 'control-up',
      name: 'Control Up',
      tagline: 'Gestión comercial para PyMEs: ventas, stock, clientes y reportes en un solo lugar.',
      url: 'https://controlup.com.ar/',
      icon: 'point_of_sale',
      technologies: ['.NET', 'Angular', 'TypeScript'],
    },
    {
      slug: 'arcasuite',
      name: 'ArcaSuite',
      tagline: 'Facturación electrónica de ARCA (ex AFIP) con IA: lee facturas de compra desde una foto o PDF, sugiere las columnas al importar un CSV y expone un servidor MCP para que agentes de IA emitan y consulten comprobantes.',
      url: 'https://arca-suite.controlup.com.ar/',
      icon: 'receipt_long',
      technologies: ['.NET', 'Gemini', 'MCP', 'PostgreSQL', 'Angular'],
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
    },
    {
      slug: 'control-up',
      name: 'Control Up',
      tagline: 'Business management for SMBs: sales, inventory, customers and reports in one place.',
      url: 'https://controlup.com.ar/',
      icon: 'point_of_sale',
      technologies: ['.NET', 'Angular', 'TypeScript'],
    },
    {
      slug: 'arcasuite',
      name: 'ArcaSuite',
      tagline: 'AI-powered ARCA (formerly AFIP) e-invoicing for Argentina: reads purchase invoices from a photo or PDF, suggests column mappings when importing a CSV and exposes an MCP server so AI agents can issue and query invoices.',
      url: 'https://arca-suite.controlup.com.ar/',
      icon: 'receipt_long',
      technologies: ['.NET', 'Gemini', 'MCP', 'PostgreSQL', 'Angular'],
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
