export interface SiteSettings {
  whatsapp: string;
  instagram: string;
  preco_site: number;
  preco_convite: number;
  imagem_hero: string;
}

export interface PortfolioItem {
  id: string;
  titulo: string;
  tipo: string;
  imagem_url: string;
  ordem: number;
  criado_em: string;
}

export interface Testimonial {
  id: string;
  nome: string;
  texto: string;
  nota: number;
  criado_em: string;
}

export type ServicePricing = 'site' | 'invite' | 'quote';

export interface Service {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  tipo_preco: ServicePricing;
  ordem: number;
  criado_em: string;
}
